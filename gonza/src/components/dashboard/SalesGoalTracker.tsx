/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { Button, TextInput, HR, Spinner } from "flowbite-react";
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
    let startDate = new Date(now);

    if (period === "DAILY") {
      startDate.setHours(0, 0, 0, 0);
    } else if (period === "WEEKLY") {
      // Find Monday of the current week
      const day = now.getDay(); // 0 (Sun) to 6 (Sat)
      const diff = now.getDate() - day + (day === 0 ? -6 : 1);
      startDate = new Date(now.getFullYear(), now.getMonth(), diff, 0, 0, 0, 0);
    } else if (period === "MONTHLY") {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
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

  const periodLabel = period.toLowerCase();

  return (
    <div className="p-6 rounded-sm bg-white/40 dark:bg-white/[0.03] backdrop-blur-md border border-gray-100/50 dark:border-white/[0.05] shadow-xl">
      {/* sales, costs, expenses and profits (excluding quotes) */}
      <div className="mb-4">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
          Sales Goal Tracker
        </h2>
        <p className="text-[.7rem] text-gray-500 capitalize tracking-widest font-medium">
          Business: {user?.agency?.name || "Business Name"}
        </p>
      </div>

      <div className="flex p-1 bg-gray-100/50 dark:bg-black/20 rounded-sm mb-6 border border-gray-200/50 dark:border-white/5">
        {(["DAILY", "WEEKLY", "MONTHLY"] as const).map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`flex-1  text-[10px] font-black capitalize tracking-wider transition-all rounded-sm ${
              period === p
                ? "bg-white dark:bg-white/10 text-brand-primary dark:text-brand-accent shadow-sm"
                : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            }`}>
            {p.toLowerCase()}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-2 mb-6">
        <div className="flex justify-between items-center py-2 border-b border-gray-100/50 dark:border-white/5">
          <p className="text-xs  text-gray-500 capitalize tracking-widest">
            {periodLabel} Goal
          </p>
          <p className="text-[.7rem]  text-gray-900 dark:text-white ">
            {NumberFormatter.formatCurrency(currentGoal?.amount_target || 0)}
          </p>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-gray-100/50 dark:border-white/5">
          <p className="text-xs text-gray-500 capitalize tracking-widest">
            Current Sales
          </p>
          <p className="text-[.7rem]  text-brand-primary dark:text-brand-accent">
            {NumberFormatter.formatCurrency(currentSales || 0)}
          </p>
        </div>
        <div className="flex justify-between items-center py-2">
          <p className="text-xs  text-gray-500 capitalize tracking-widest">
            Progress
          </p>
          <p className="text-[.7rem]  text-emerald-500">{progress}%</p>
        </div>
      </div>

      <div className="flex gap-2">
        <TextInput
          type="number"
          placeholder="0.00"
          value={goalInput}
          color="none"
          onChange={(e) => setGoalInput(e.target.value)}
          className="flex-1"
          theme={{
            field: {
              input: {
                base: "block w-full border disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 !px-2.5 !py-1.5 !text-[.75rem] !rounded-sm backdrop-blur-sm bg-white/40 dark:bg-white/[0.05] border-gray-200/50 dark:border-white/[0.1] text-gray-900 dark:text-white focus:border-brand-primary focus:ring-brand-primary/20",
              },
            },
          }}
        />
        <Button
          color="none"
          size="sm"
          disabled={isUpdating}
          onClick={handleSetGoal}
          className="rounded-sm bg-red-500 text-white hover:bg-brand-primary-dark transition-all !px-2.5   capitalize tracking-widest text-[10px]">
          {isUpdating ? <Spinner size="xs" /> : "Set Goal"}
        </Button>
      </div>

      <HR className="my-6 border-gray-100/50 dark:border-white/5" />

      <div className="text-[10px] text-gray-400 italic font-medium leading-relaxed">
        Business Goal Tip: Setting realistic {periodLabel} targets ensures
        steady business growth and team motivation.
      </div>
    </div>
  );
};

export default SalesGoalTracker;
