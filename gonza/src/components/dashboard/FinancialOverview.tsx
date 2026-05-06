/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import Chart from "react-apexcharts";
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

    const sales = (await salesQuery.toArray()).filter(
      (s) => s.status !== "QUOTE",
    );
    const expenses = await expensesQuery.toArray();

    const totalSales = sales.reduce((sum, s) => sum + (s.total_amount || 0), 0);
    const totalCost = sales.reduce((sum, s) => sum + (s.total_cost || 0), 0);
    const totalExpenses = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
    const totalProfit = sales.reduce((sum, s) => sum + (s.profit || 0), 0);

    return [
      { name: "Sales", value: totalSales },
      { name: "Costs", value: totalCost },
      { name: "Expenses", value: totalExpenses },
      { name: "Profits", value: totalProfit },
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
      fontFamily: "inherit",
    },
    plotOptions: {
      bar: {
        borderRadius: 2,
        horizontal: false,
        columnWidth: "40%",
        distributed: true,
      },
    },
    dataLabels: { enabled: false },
    colors: ["#3B82F6", "#F59E0B", "#EF4444", "#10B981"],
    xaxis: {
      categories: data?.map((d) => d.name) || [
        "Sales",
        "Costs",
        "Expenses",
        "Profits",
      ],
      axisBorder: { show: false },
      labels: {
        style: {
          colors: "#9CA3AF",
          fontSize: "11px",
        },
      },
    },
    yaxis: {
      labels: {
        style: { colors: "#9CA3AF", fontSize: "11px" },
        formatter: (val: number) => new Intl.NumberFormat().format(val),
      },
    },
    grid: {
      borderColor: "rgba(156, 163, 175, 0.1)",
      strokeDashArray: 3,
    },
    tooltip: {
      theme: "dark",
      style: { fontSize: "11px" },
      y: {
        formatter: (val: number) =>
          `UGX ${new Intl.NumberFormat().format(val)}`,
      },
    },
    legend: { show: false },
  };

  return (
    <div className="financial_overview p-6 rounded-sm bg-white/40 dark:bg-white/[0.03] backdrop-blur-md border border-gray-100/50 dark:border-white/[0.05] shadow-xl">
      <div>
        <span className="text-lg font-bold text-gray-900 dark:text-white">
          Financial Overview
        </span>
        <p className="text-sm text-gray-500">
          Sales, costs, expenses, and profits (excluding quotes)
        </p>
      </div>
      <div className="row mt-4">
        <div className="mixed-chart">
          <Chart
            options={options}
            series={series}
            type="bar"
            width="100%"
            height="250"
          />
        </div>
      </div>
    </div>
  );
};

export default FinancialOverview;
