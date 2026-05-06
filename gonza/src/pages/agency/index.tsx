/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { Card, Button, Badge, Select, Spinner } from "flowbite-react";
import {
  HiOutlineCurrencyDollar,
  HiOutlineTrendingUp,
  HiOutlineReceiptTax,
  HiOutlineCube,
  HiOutlineUsers,
  HiOutlineScale,
  HiPlus,
} from "react-icons/hi";
import { useAuthStore } from "../../store/useAuthStore";
import { NumberFormatter } from "../../utils/formatters";
import AnalysisGraph from "../../components/dashboard/AnalysisGraph";
import UpcommingCalendar from "../../components/dashboard/UpcommingCalendar";
import { useDashboard } from "../../store/useDashboardStore";
import { useFinanceStore } from "../../store/useFinanceStore";

const AgencyHome = () => {
  const { user } = useAuthStore();
  const [filter, setFilter] = useState("today");

  const { summary: summaryData, loading } = useDashboard(user?.branch?.id);

  const userName = user
    ? `${user.first_name || ""} ${user.last_name || ""}`.trim()
    : "Agent";

  const { sync: syncFinance } = useFinanceStore();
  const branchId = user?.branch?.id;

  // Shared card classes for continuity
  const cardClasses =
    "bg-white/40 dark:bg-white/[0.03] backdrop-blur-md border border-gray-100/50 dark:border-white/[0.05] shadow-xl";
  const actionButtonClasses =
    "border border-gray-100/50 dark:border-white/[0.05] backdrop-blur-sm p-2 w-3xl bg-white/40 dark:bg-white/[0.03] cursor-pointer text-gray-900 dark:text-white rounded-lg hover:bg-white/60 dark:hover:bg-white/10 transition-all duration-200";

  // Add useEffect to sync finance data
  useEffect(() => {
    if (branchId) {
      syncFinance(false, branchId);
    }
  }, [branchId, syncFinance]);

  return (
    <div>
      {/* head section */}
      <div>
        <div className="flex items-center justify-between p-4">
          <span className="text-gray-900 dark:text-white ">{userName}</span>
          <button className="flex items-center justify-center text-white bg-brand-primary/80 dark:bg-brand-primary/40 backdrop-blur-md border border-white/20 hover:bg-brand-primary rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200 shadow-sm">
            <HiPlus className="mr-1 h-4 w-4" />
            new sale
          </button>
        </div>
        <div className="flex items-center justify-start gap-4 p-4 overflow-x-auto bg-white/20 dark:bg-white/[0.02] backdrop-blur-sm border-y border-gray-100/50 dark:border-white/[0.05]">
          <button className={actionButtonClasses}>Create Receipt</button>
          <button className={actionButtonClasses}>Create Invoice</button>
          <button className={actionButtonClasses}>
            Create Installment Sale
          </button>
          <button className={actionButtonClasses}>Create Quatation</button>
        </div>
      </div>

      {/* summary section */}
      <div className="p-4">
        <select
          name="filter"
          id="filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="bg-white/40 dark:bg-white/[0.03] backdrop-blur-md border border-gray-100/50 dark:border-white/[0.05] p-2 text-gray-900 dark:text-white rounded-xl cursor-pointer shadow-sm hover:bg-white/60 dark:hover:bg-white/10 transition-all duration-200">
          <option value="today">Today</option>
          <option value="this_week">This Week</option>
          <option value="this_month">This Month</option>
          <option value="this_year">This Year</option>
        </select>

        {loading ? (
          <div className="flex justify-center py-20">
            <Spinner size="xl" color="info" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
            {/* Total Sales */}
            <Card className={cardClasses}>
              <div>
                <span className="flex items-center gap-2">
                  <HiOutlineCurrencyDollar className="h-4 w-4" />
                  <span className="text-sm">Total Sales</span>
                </span>
              </div>
              <div className="text-xl font-bold ">
                {NumberFormatter.formatCurrency(summaryData?.totalSales)}
              </div>
              <div>
                <span className="text-xs text-gray-500">
                  From {summaryData?.paidSalesCount || 0} transaction (excluding
                  quotes)
                </span>
              </div>
            </Card>

            {/* Total Gross Profit */}
            <Card className={cardClasses}>
              <div>
                <span className="flex items-center gap-2">
                  <HiOutlineTrendingUp className="h-4 w-4" />
                  <span className="text-sm">Total Gross profit</span>
                  <Badge color="success">
                    {summaryData?.totalSales > 0
                      ? `${(
                          (summaryData.totalProfit / summaryData.totalSales) *
                          100
                        ).toFixed(1)}%`
                      : "0.0%"}
                  </Badge>
                </span>
              </div>
              <div className="text-xl font-bold ">
                {NumberFormatter.formatCurrency(summaryData?.totalProfit)}
              </div>
              <div>
                <span className="text-xs text-gray-500">
                  Gross profit from non-quote sales
                </span>
              </div>
            </Card>

            {/* Total Expenses */}
            <Card className={cardClasses}>
              <div>
                <span className="flex items-center gap-2">
                  <HiOutlineReceiptTax className="h-4 w-4" />
                  <span className="text-sm">Total Expenses</span>
                </span>
              </div>
              <div className="mt-1">
                <span className="text-[10px] font-bold text-gray-400 block -mb-1 ">
                  PAID
                </span>
                <span className="text-lg font-bold ">
                  {NumberFormatter.formatCurrency(summaryData?.totalExpenses)}
                </span>
              </div>
              <div className="mt-1">
                <span className="text-[10px] font-bold text-gray-400 block -mb-1 ">
                  DUE
                </span>
                <span className="text-lg font-bold ">
                  {NumberFormatter.formatCurrency(0)}
                </span>
              </div>
            </Card>

            {/* Inventory Value */}
            <Card className={cardClasses}>
              <div>
                <span className="flex items-center gap-2">
                  <HiOutlineCube className="h-4 w-4" />
                  <span className="text-sm">Inventory value</span>
                </span>
              </div>
              <div className="text-xl font-bold ">
                {NumberFormatter.formatCurrency(summaryData?.inventoryValue)}
              </div>
              <div>
                <span className="text-xs text-gray-500">
                  Total value of current inventory
                </span>
              </div>
            </Card>

            {/* Debtors & Creditors */}
            <Card className={cardClasses}>
              <div>
                <span className="flex items-center gap-2">
                  <HiOutlineScale className="h-4 w-4" />
                  <span className="text-sm">Debtors & Creditors</span>
                </span>
              </div>
              <div className="mt-1">
                <span className="text-[10px] font-bold text-brand-secondary block -mb-1 ">
                  DEBTORS
                </span>
                <span className="text-lg font-bold ">
                  {NumberFormatter.formatCurrency(0)}
                </span>
              </div>
              <div className="mt-1">
                <span className="text-[10px] font-bold text-gray-400 block -mb-1 ">
                  CREDITORS
                </span>
                <span className="text-lg font-bold ">
                  {NumberFormatter.formatCurrency(0)}
                </span>
              </div>
            </Card>

            {/* Customer Overview */}
            <Card className={cardClasses}>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <HiOutlineUsers className="h-4 w-4" />
                  <span className="text-sm">Customer Overview</span>
                </span>
                <select
                  name=""
                  id=""
                  className="bg-transparent border-none text-xs focus:ring-0 cursor-pointer">
                  <option value="">Total</option>
                  <option value="">New</option>
                  <option value="">Top 5</option>
                </select>
              </div>
              <div className="text-xl font-bold">
                {summaryData?.totalCustomers || 0}
              </div>
              <div>
                <span className="text-xs text-gray-500">
                  Registered customer
                </span>
              </div>
            </Card>
          </div>
        )}

        {/* Analysis Section */}
        <AnalysisGraph />

        {/* Calendar Section */}
        <UpcommingCalendar />
      </div>
    </div>
  );
};

export default AgencyHome;
