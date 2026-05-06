/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import {
  Button,
  TextInput,
  HR,
  Spinner,
} from "flowbite-react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../../db/db";
import { useAuthStore } from "../../store/useAuthStore";
import { useSalesGoalStore } from "../../store/useSalesGoalStore";
import { NumberFormatter } from "../../utils/formatters";

const SalesGoalTracker = () => {
  const { user } = useAuthStore();
  const { setGoal } = useSalesGoalStore();
  const [period, setPeriod] = useState<"DAILY" | "WEEKLY" | "MONTHLY">("DAILY");
  const [goalInput, setGoalInput] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const branchId = user?.branch?.id;

  // 🛡️ Strategic Identification: Get the correct period name for the query
  const getPeriodName = (p: string) => {
    const now = new Date();
    if (p === "DAILY") return `DAILY-${now.toISOString().split("T")[0]}`;
    if (p === "WEEKLY") {
       const firstDayOfYear = new Date(now.getFullYear(), 0, 1);
       const pastDaysOfYear = (now.getTime() - firstDayOfYear.getTime()) / 86400000;
       const weekNum = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
       return `WEEKLY-${now.getFullYear()}-W${weekNum}`;
    }
    return `MONTHLY-${now.getFullYear()}-${now.getMonth() + 1}`;
  };

  // Fetch current goal from Dexie based on specific period_name
  const currentGoal = useLiveQuery(async () => {
    if (!branchId) return null;
    const pName = getPeriodName(period);
    return await db.salesGoals
      .where({ branch: branchId, period: period, period_name: pName })
      .first();
  }, [branchId, period]);

  // Calculate current sales for the selected period
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
      query = db.sales
        .where("branch")
        .equals(branchId)
        .and((s) => s.date >= startTime);
    }

    const sales = await query.toArray();
    return sales
      .filter((s) => s.status !== "QUOTE")
      .reduce((sum, s) => sum + (s.total_amount || 0), 0);
  }, [branchId, period]);

  const progress = currentGoal?.amount_target
    ? Math.min(
        100,
        Math.round(((currentSales || 0) / currentGoal.amount_target) * 100),
      )
    : 0;

  const handleSetGoal = async () => {
    if (!goalInput || !branchId) return;
    setIsUpdating(true);

    try {
      const amount = parseFloat(goalInput);
      await setGoal({
        period,
        amount_target: amount,
        branchId,
        agencyId: (user as any)?.agency?.id,
      });
      setGoalInput("");
    } catch (err) {
      console.error("Failed to set goal:", err);
    } finally {
      setIsUpdating(false);
    }
  };

  const periodLabel = period === "DAILY" ? "daily" : period === "WEEKLY" ? "weekly" : "monthly";

  return (
    <div className="p-6 rounded-sm bg-white/40 dark:bg-white/[0.03] backdrop-blur-md border border-gray-100/50 dark:border-white/[0.05] shadow-xl">
      <div>
        <h2 className="text-lg font-bold mb-4">Sales Goal Tracker</h2>
        <p className="text-sm text-gray-500">Business: {user?.agency?.name || "Business Name"}</p>
      </div>

      <div className="flex gap-2 mb-4">
        <Button onClick={() => setPeriod("DAILY")}>Daily</Button>
        <Button onClick={() => setPeriod("WEEKLY")}>Weekly</Button>
        <Button onClick={() => setPeriod("MONTHLY")}>Monthly</Button>
      </div>

      <div className="flex flex-col gap-4 mb-4">
        <div className="flex justify-between mb-4">
          <p>{periodLabel} Goal</p>
          <p>ugx {NumberFormatter.formatCurrency(currentGoal?.amount_target || 0)}</p>
        </div>
        <div className="flex justify-between mb-4">
          <p>Current Sales</p>
          <p>ugx {NumberFormatter.formatCurrency(currentSales || 0)}</p>
        </div>
        <div className="flex justify-between mb-4">
          <p>Progress</p>
          <p>{progress}%</p>
        </div>
      </div>

      <div>
        <TextInput 
          type="number"
          value={goalInput}
          onChange={(e) => setGoalInput(e.target.value)}
          placeholder="Set target amount"
        />
        <Button onClick={handleSetGoal} disabled={isUpdating} className="mt-2">
          {isUpdating ? <Spinner size="xs" /> : "Set Goal"}
        </Button>
      </div>
      <HR />
      <div className="text-sm italic text-gray-400">Business Goal Tip: Setting realistic targets helps maintain steady growth.</div>
    </div>
  );
};

export default SalesGoalTracker;
