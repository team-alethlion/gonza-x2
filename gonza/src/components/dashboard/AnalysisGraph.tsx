/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import { Card, Button, Spinner, Select } from "flowbite-react";
import { HiOutlineChartBar } from "react-icons/hi";
import { useAuthStore } from "../../store/useAuthStore";
import { useLiveQuery } from "dexie-react-hooks";
import { db, type Sale, type Expense } from "../../db/db";
import { NumberFormatter } from "../../utils/formatters";

type Timeframe = "daily" | "weekly" | "monthly";

const AnalysisGraph = () => {
  const { user } = useAuthStore();
  const [timeframe, setTimeframe] = useState<Timeframe>("monthly");
  const [selectedYear, setSelectedYear] = useState<string>(
    new Date().getFullYear().toString(),
  );
  const [availableYears, setAvailableYears] = useState<number[]>([]);

  // Fetch available years from existing sales in Dexie
  useEffect(() => {
    const fetchYears = async () => {
      try {
        let salesQuery = db.sales.where("id").notEqual("");
        if (user?.branch?.id) {
          salesQuery = db.sales.where("branch").equals(user.branch.id);
        }
        const sales = await salesQuery.toArray();
        const years = [
          ...new Set(sales.map((s) => new Date(s.date).getFullYear())),
        ].sort((a: number, b: number) => b - a);
        if (years.length === 0) {
          setAvailableYears([new Date().getFullYear()]);
        } else {
          setAvailableYears(years);
        }
      } catch (error) {
        console.error("Failed to get years from Dexie:", error);
        setAvailableYears([new Date().getFullYear()]);
      }
    };
    fetchYears();
  }, [user?.branch?.id]);

  // Compute chart data from Dexie sales and expenses
  const chartData = useLiveQuery(async () => {
    // Fetch all sales for the branch
    let salesQuery = db.sales.where("id").notEqual("");
    if (user?.branch?.id) {
      salesQuery = db.sales.where("branch").equals(user.branch.id);
    }
    const allSales = await salesQuery.toArray();

    // Fetch all expenses for the branch
    let expensesQuery = db.expenses.where("id").notEqual("");
    if (user?.branch?.id) {
      expensesQuery = db.expenses.where("branch").equals(user.branch.id);
    }
    const allExpenses = await expensesQuery.toArray();

    // Filter by year
    const filteredSales = allSales.filter((sale) => {
      const saleYear = new Date(sale.date).getFullYear();
      return saleYear.toString() === selectedYear;
    });
    const filteredExpenses = allExpenses.filter((expense) => {
      const expenseYear = new Date(expense.date).getFullYear();
      return expenseYear.toString() === selectedYear;
    });

    // Group by date based on timeframe
    const salesGroups: Record<string, number> = {};
    const expensesGroups: Record<string, number> = {};

    const addToGroup = (
      groups: Record<string, number>,
      dateObj: Date,
      amount: number,
    ) => {
      let key: string;
      if (timeframe === "daily") {
        key = dateObj.toISOString().split("T")[0];
      } else if (timeframe === "weekly") {
        const startOfYear = new Date(dateObj.getFullYear(), 0, 1);
        const days = Math.floor(
          (dateObj.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000),
        );
        const weekNumber = Math.ceil((days + 1) / 7);
        key = `${dateObj.getFullYear()}-W${weekNumber}`;
      } else {
        key = `${dateObj.getFullYear()}-${dateObj.getMonth() + 1}`;
      }
      groups[key] = (groups[key] || 0) + amount;
    };

    for (const sale of filteredSales) {
      addToGroup(salesGroups, new Date(sale.date), sale.total_amount);
    }
    for (const expense of filteredExpenses) {
      addToGroup(expensesGroups, new Date(expense.date), expense.amount);
    }

    // Get all unique keys from both groups
    const allKeys = new Set([
      ...Object.keys(salesGroups),
      ...Object.keys(expensesGroups),
    ]);
    const sortedKeys = Array.from(allKeys).sort();

    const formattedDates = sortedKeys.map((key) => {
      if (timeframe === "daily") {
        return new Date(key).toLocaleDateString("en-US", {
          day: "numeric",
          month: "short",
        });
      } else if (timeframe === "weekly") {
        return `Week ${key.split("-W")[1]}`;
      } else {
        const [year, month] = key.split("-");
        const date = new Date(parseInt(year), parseInt(month) - 1, 1);
        return date.toLocaleDateString("en-US", {
          month: "short",
          year: "2-digit",
        });
      }
    });

    const salesData = sortedKeys.map((k) => salesGroups[k] || 0);
    const expensesData = sortedKeys.map((k) => expensesGroups[k] || 0);

    return { dates: formattedDates, sales: salesData, expenses: expensesData };
  }, [user?.branch?.id, timeframe, selectedYear]);

  const isLoading = chartData === undefined;

  const options: any = {
    chart: {
      id: "performance-chart",
      toolbar: { show: false },
      zoom: { enabled: false },
      fontFamily: "Inter, sans-serif",
      background: "transparent",
    },
    colors: ["#252861", "#f05a2b"],
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.45,
        opacityTo: 0.05,
        stops: [20, 100],
      },
    },
    dataLabels: { enabled: false },
    stroke: { curve: "smooth", width: 3 },
    xaxis: {
      categories: chartData?.dates || [],
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: { colors: "#9ca3af", fontSize: "12px" },
      },
    },
    yaxis: {
      labels: {
        style: { colors: "#9ca3af", fontSize: "12px" },
        formatter: (val: number) => NumberFormatter.minimize(val),
      },
    },
    grid: {
      show: true,
      borderColor: "#f3f4f6",
      strokeDashArray: 4,
      padding: { left: 20, right: 20 },
    },
    tooltip: {
      theme: "light",
      y: { formatter: (val: number) => NumberFormatter.formatCurrency(val) },
    },
    legend: {
      position: "top",
      horizontalAlign: "right",
      fontSize: "12px",
      fontWeight: 600,
      labels: { colors: "#9ca3af" },
    },
  };

  if (document.documentElement.classList.contains("dark")) {
    options.grid.borderColor = "rgba(255,255,255,0.05)";
    options.tooltip.theme = "dark";
    options.colors = ["#9b87f5", "#f05a2b"];
  }

  const series = [
    { name: "Sales", data: chartData?.sales || [] },
    { name: "Expenses", data: chartData?.expenses || [] },
  ];

  return (
    <Card className="bg-white/40 dark:bg-white/3 backdrop-blur-md border-gray-100/50 dark:border-white/[0.05] shadow-xl mt-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-brand-primary/10 dark:bg-brand-primary/20 mt-1">
            <HiOutlineChartBar className="h-5 w-5 text-brand-primary dark:text-brand-accent" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white/90 leading-tight">
              Performance Analysis
            </h3>
            <p className="text-sm text-gray-500/80 dark:text-gray-400/80">
              Visualize your sales and expenses over time
            </p>
          </div>
        </div>
        <div className="w-32">
          <Select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="cursor-pointer">
            {availableYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </Select>
        </div>
      </div>
      <div className="flex items-center w-fit gap-1 bg-gray-100/30 dark:bg-white/[0.02] backdrop-blur-md p-1 rounded-xl border border-gray-100/20 dark:border-white/[0.05]">
        {(["daily", "weekly", "monthly"] as Timeframe[]).map((tf) => (
          <Button
            key={tf}
            size="xs"
            color="none"
            onClick={() => setTimeframe(tf)}
            className={`text-[10px] font-bold tracking-wider transition-all duration-200 rounded-lg ${
              timeframe === tf
                ? "bg-brand-primary/80 dark:bg-brand-primary/40 text-white backdrop-blur-md shadow-sm border border-white/20"
                : "bg-transparent border-none text-gray-500 hover:bg-white/40 dark:hover:bg-white/10 backdrop-blur-sm"
            }`}>
            {tf.charAt(0).toUpperCase() + tf.slice(1)}
          </Button>
        ))}
      </div>

      <div className="relative h-80 w-full mt-4">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white/20 dark:bg-black/10 backdrop-blur-sm z-10 rounded-xl">
            <Spinner size="lg" color="info" />
          </div>
        ) : !chartData?.dates.length ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
            <HiOutlineChartBar className="h-12 w-12 mb-2 opacity-20" />
            <p className="text-sm font-medium">
              No performance data found for this period
            </p>
          </div>
        ) : null}

        <Chart
          options={options}
          series={series}
          type="area"
          height="100%"
          width="100%"
        />
      </div>
    </Card>
  );
};

export default AnalysisGraph;
