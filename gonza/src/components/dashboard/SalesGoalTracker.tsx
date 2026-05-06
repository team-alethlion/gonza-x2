/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import {
  Card,
  Button,
  TextInput,
  HR,
  Spinner,
  Badge,
} from "flowbite-react";
import { HiOutlineTrendingUp, HiTrendingUp } from "react-icons/hi";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../../db/db";
import { useAuthStore } from "../../store/useAuthStore";
import { apiFetch } from "../../utils/api";
import { NumberFormatter } from "../../utils/formatters";

const SalesGoalTracker = () => {
  const { user } = useAuthStore();
  const [period, setPeriod] = useState<"DAILY" | "WEEKLY" | "MONTHLY">("DAILY");
  const [goalInput, setGoalInput] = useState("");
  const [isUpdating, setIsSubmitting] = useState(false);

  const branchId = user?.branch?.id;

  // 1. Fetch current goal from Dexie
  const currentGoal = useLiveQuery(async () => {
    if (!branchId) return null;
    return await db.salesGoals
      .where({ branch: branchId, period: period })
      .first();
  }, [branchId, period]);

  // 2. Calculate current sales for the selected period
  const currentSales = useLiveQuery(async () => {
    const now = new Date();
    let startDate = new Date();

    if (period === "DAILY") {
      startDate.setHours(0, 0, 0, 0);
    } else if (period === "WEEKLY") {
      const day = now.getDay();
      const diff = now.getDate() - day + (day === 0 ? -6 : 1);
      startDate = new Date(now.setDate(diff));
      startDate.setHours(0, 0, 0, 0);
    } else if (period === "MONTHLY") {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    const startTime = startDate.toISOString();
    let query = db.sales.where("date").aboveOrEqual(startTime);
    if (branchId) {
      query = db.sales.where("branch").equals(branchId).and(s => s.date >= startTime);
    }

    const sales = await query.toArray();
    return sales
      .filter(s => s.status !== "QUOTE")
      .reduce((sum, s) => sum + (s.total_amount || 0), 0);
  }, [branchId, period]);

  const progress = currentGoal?.amount_target 
    ? Math.min(100, Math.round((currentSales || 0) / currentGoal.amount_target * 100))
    : 0;

  const handleSetGoal = async () => {
    if (!goalInput || !branchId) return;
    setIsSubmitting(true);

    try {
      const amount = parseFloat(goalInput);
      const res = await apiFetch("/sales/goals/", {
        method: "POST",
        body: JSON.stringify({
          period: period,
          amount_target: amount,
          branchId: branchId,
          agencyId: (user as any)?.agency?.id,
          status: "ACTIVE"
        }),
      });

      if (res.ok) {
        const savedGoal = await res.json();
        await db.salesGoals.put(savedGoal);
        setGoalInput("");
      }
    } catch (err) {
      console.error("Failed to set goal:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const periodLabel = period === "DAILY" ? "Daily" : period === "WEEKLY" ? "Weekly" : "Monthly";

  return (
    <Card className="bg-white/40 dark:bg-white/[0.03] backdrop-blur-md border border-gray-100/50 dark:border-white/[0.05] shadow-xl mt-6">
      <div className="flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">
              Sales Goal Tracker
            </h3>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mt-1">
              {user?.branch?.name || "Global View"}
            </p>
          </div>
          <div className="p-2 bg-brand-primary/10 rounded-lg">
            <HiOutlineTrendingUp className="h-5 w-5 text-brand-primary dark:text-brand-accent" />
          </div>
        </div>

        {/* Period Switcher (Buttons looking like tabs) */}
        <div className="flex p-1 bg-gray-100/50 dark:bg-black/20 rounded-lg mb-6 border border-gray-200/50 dark:border-white/5">
          {(["DAILY", "WEEKLY", "MONTHLY"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`flex-1 py-2 text-[10px] font-black uppercase tracking-wider transition-all rounded-md ${
                period === p
                  ? "bg-white dark:bg-white/10 text-brand-primary dark:text-brand-accent shadow-sm"
                  : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex justify-between items-end p-3 rounded-xl bg-white/30 dark:bg-white/[0.02] border border-gray-100/50 dark:border-white/[0.05]">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{periodLabel} Goal</span>
            <span className="text-lg font-black text-gray-900 dark:text-white">
              {NumberFormatter.formatCurrency(currentGoal?.amount_target || 0)}
            </span>
          </div>
          
          <div className="flex justify-between items-end p-3 rounded-xl bg-white/30 dark:bg-white/[0.02] border border-gray-100/50 dark:border-white/[0.05]">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Current Sales</span>
            <div className="flex flex-col items-end">
               <span className="text-lg font-black text-brand-primary dark:text-brand-accent">
                {NumberFormatter.formatCurrency(currentSales || 0)}
              </span>
              <Badge color={progress >= 100 ? "success" : "info"} className="mt-1">
                {progress}%
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <TextInput
            type="number"
            placeholder={`Enter ${periodLabel.toLowerCase()} target...`}
            value={goalInput}
            onChange={(e) => setGoalInput(e.target.value)}
            className="flex-1"
            theme={{
              field: {
                input: {
                  base: "block w-full border disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 p-2.5 text-sm rounded-lg backdrop-blur-sm bg-white/40 dark:bg-white/[0.05] border-gray-200/50 dark:border-white/[0.1] text-gray-900 dark:text-white focus:border-brand-primary focus:ring-brand-primary/20",
                }
              }
            }}
          />
          <Button
            color="none"
            disabled={isUpdating}
            onClick={handleSetGoal}
            className="bg-brand-primary text-white hover:bg-brand-primary-dark shadow-lg shadow-brand-primary/20 transition-all rounded-lg px-4"
          >
            {isUpdating ? <Spinner size="xs" /> : "Set"}
          </Button>
        </div>

        <HR className="my-6 border-gray-100/50 dark:border-white/5" />
        
        <div className="flex items-center gap-2 text-[10px] text-gray-400 italic">
          <HiTrendingUp className="h-3 w-3" />
          <span>Tips: Setting realistic {periodLabel.toLowerCase()} goals helps maintain steady growth.</span>
        </div>
      </div>
    </Card>
  );
};

export default SalesGoalTracker;
