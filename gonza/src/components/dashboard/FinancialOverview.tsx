/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import Chart from "react-apexcharts";
import { Card } from "flowbite-react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../../db/db";
import { useAuthStore } from "../../store/useAuthStore";

const FinancialOverview = () => {
  const { user } = useAuthStore();
  const branchId = user?.branch?.id;

  const data = useLiveQuery(async () => {
    let salesQuery = db.sales.where("id").notEqual("");
    let expensesQuery = db.expenses.where("id").notEqual("");

    if (branchId) {
      salesQuery = db.sales.where("branch").equals(branchId);
      expensesQuery = db.expenses.where("branch").equals(branchId);
    }

    const sales = (await salesQuery.toArray()).filter(s => s.status !== "QUOTE");
    const expenses = await expensesQuery.toArray();

    const totalSales = sales.reduce((sum, s) => sum + (s.total_amount || 0), 0);
    const totalCost = sales.reduce((sum, s) => sum + (s.total_cost || 0), 0);
    const totalExpenses = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
    const totalProfit = sales.reduce((sum, s) => sum + (s.profit || 0), 0);

    return [
      { name: "Sales", value: totalSales },
      { name: "Cost of Goods", value: totalCost },
      { name: "Expenses", value: totalExpenses },
      { name: "Net Profit", value: totalProfit },
    ];
  }, [branchId]);

  const series = [
    {
      name: "Amount (UGX)",
      data: data?.map((d) => d.value) || [0, 0, 0, 0],
    },
  ];

  const options: any = {
    chart: {
      type: "bar",
      toolbar: { show: false },
      background: "transparent",
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        horizontal: false,
        columnWidth: "55%",
        distributed: true,
      },
    },
    dataLabels: { enabled: false },
    colors: ["#3B82F6", "#F59E0B", "#EF4444", "#10B981"],
    xaxis: {
      categories: data?.map((d) => d.name) || ["Sales", "Cost", "Expenses", "Profit"],
      axisBorder: { show: false },
      labels: {
        style: {
          colors: "#9CA3AF",
          fontSize: "10px",
          fontWeight: 600,
        },
      },
    },
    yaxis: {
      labels: {
        style: { colors: "#9CA3AF" },
        formatter: (val: number) => new Intl.NumberFormat().format(val),
      },
    },
    grid: {
      borderColor: "rgba(156, 163, 175, 0.1)",
      strokeDashArray: 4,
    },
    tooltip: {
      theme: "dark",
      y: {
        formatter: (val: number) => `UGX ${new Intl.NumberFormat().format(val)}`,
      },
    },
    legend: { show: false },
    theme: { mode: "dark" },
  };

  return (
    <Card className="bg-white/40 dark:bg-white/[0.03] backdrop-blur-md border border-gray-100/50 dark:border-white/[0.05] shadow-xl mt-6">
      <div className="flex flex-col">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">
            Financial Overview
          </h3>
          <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest font-medium">
            Sales, costs, expenses, and profits (excluding quotes)
          </p>
        </div>
        <div className="h-[300px] w-full">
          <Chart options={options} series={series} type="bar" height="100%" />
        </div>
      </div>
    </Card>
  );
};

export default FinancialOverview;
