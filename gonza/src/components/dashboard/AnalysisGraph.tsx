/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import { Card, Button, Spinner, Select } from "flowbite-react";
import { HiOutlineChartBar } from "react-icons/hi";
import { useAuthStore } from "../../store/useAuthStore";
import { getApiUrl, CONFIG } from "../../config";
import { NumberFormatter } from "../../utils/formatters";

const AnalysisGraph = () => {
  const { user, token } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<"daily" | "weekly" | "monthly">(
    "monthly",
  );
  const [selectedYear, setSelectedYear] = useState<string>(
    new Date().getFullYear().toString(),
  );
  const [availableYears, setAvailableYears] = useState<number[]>([]);
  const [chartData, setChartData] = useState<{
    dates: string[];
    sales: number[];
    expenses: number[];
  }>({
    dates: [],
    sales: [],
    expenses: [],
  });

  // Fetch available years
  useEffect(() => {
    const fetchYears = async () => {
      if (!user?.branch?.id || !token) return;
      try {
        const url = getApiUrl(`${CONFIG.API.SALES.BASE}performance_years/`);
        const res = await fetch(`${url}?branchId=${user.branch.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const years = await res.json();
          setAvailableYears(years);
        }
      } catch (error) {
        console.error("Failed to fetch available years:", error);
      }
    };
    fetchYears();
  }, [user?.branch?.id, token]);

  // Fetch chart data
  useEffect(() => {
    const fetchChartData = async () => {
      if (!user?.branch?.id || !token) return;

      setLoading(true);
      try {
        const url = getApiUrl(`${CONFIG.API.SALES.BASE}performance_chart/`);
        const params = new URLSearchParams({
          branchId: user.branch.id,
          timeframe: timeframe,
          year: selectedYear,
        });

        const res = await fetch(`${url}?${params}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          const dates = data.map((item: any) => {
            const d = new Date(item.date);
            if (timeframe === "monthly") {
              return d.toLocaleDateString("en-US", {
                month: "short",
                year: "2-digit",
              });
            }
            return d.toLocaleDateString("en-US", {
              day: "numeric",
              month: "short",
            });
          });
          const sales = data.map((item: any) => item.sales);
          const expenses = data.map((item: any) => item.expenses);
          setChartData({ dates, sales, expenses });
        }
      } catch (error) {
        console.error("Failed to fetch performance chart:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, [user?.branch?.id, token, timeframe, selectedYear]);

  const options: any = {
    chart: {
      id: "performance-chart",
      toolbar: { show: false },
      zoom: { enabled: false },
      fontFamily: "Inter, sans-serif",
      background: "transparent",
    },
    colors: ["#252861", "#f05a2b"], // Space Indigo and Tiger Flame
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
    stroke: {
      curve: "smooth",
      width: 3,
    },
    xaxis: {
      categories: chartData.dates,
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: {
          colors: "#9ca3af",
          fontSize: "12px",
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: "#9ca3af",
          fontSize: "12px",
        },
        formatter: (val: number) => NumberFormatter.minimize(val),
      },
    },
    grid: {
      show: true,
      borderColor: "#f3f4f6",
      strokeDashArray: 4,
      padding: {
        left: 20,
        right: 20,
      },
    },
    tooltip: {
      theme: "light",
      x: { show: true },
      y: {
        formatter: (val: number) => NumberFormatter.formatCurrency(val),
      },
    },
    legend: {
      position: "top",
      horizontalAlign: "right",
      fontSize: "12px",
      fontWeight: 600,
      labels: {
        colors: "#9ca3af",
      },
    },
    theme: {
      mode: "light",
    },
  };

  // Adjust for dark mode continuity
  if (document.documentElement.classList.contains("dark")) {
    options.grid.borderColor = "rgba(255, 255, 255, 0.05)";
    options.tooltip.theme = "dark";
    options.theme.mode = "dark";
    options.colors = ["#9b87f5", "#f05a2b"]; // Soft Periwinkle and Tiger Flame
  }

  const series = [
    {
      name: "Sales",
      data: chartData.sales,
    },
    {
      name: "Expenses",
      data: chartData.expenses,
    },
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
            id="years"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            required
            className="cursor-pointer"
            theme={{
              field: {
                select: {
                  base: "block w-full border disabled:cursor-not-allowed disabled:opacity-50 !py-1.5 !px-3 text-xs rounded-xl bg-white/50 dark:bg-white/[0.05] backdrop-blur-sm border-gray-100/50 dark:border-white/[0.1]",
                },
              },
            }}>
            {availableYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </Select>
        </div>
      </div>
      <div className="flex items-center w-fit gap-1 bg-gray-100/30 dark:bg-white/[0.02] backdrop-blur-md p-1 rounded-xl border border-gray-100/20 dark:border-white/[0.05]">
        <Button
          size="xs"
          color="none"
          onClick={() => setTimeframe("daily")}
          className={`text-[10px] font-bold uppercase tracking-wider transition-all duration-200 rounded-lg ${
            timeframe === "daily"
              ? "bg-brand-primary/80 dark:bg-brand-primary/40 text-white backdrop-blur-md shadow-sm border border-white/20"
              : "bg-transparent border-none text-gray-500 hover:bg-white/40 dark:hover:bg-white/10 backdrop-blur-sm"
          }`}>
          Daily
        </Button>
        <Button
          size="xs"
          color="none"
          onClick={() => setTimeframe("weekly")}
          className={`text-[10px] font-bold uppercase tracking-wider transition-all duration-200 rounded-lg ${
            timeframe === "weekly"
              ? "bg-brand-primary/80 dark:bg-brand-primary/40 text-white backdrop-blur-md shadow-sm border border-white/20"
              : "bg-transparent border-none text-gray-500 hover:bg-white/40 dark:hover:bg-white/10 backdrop-blur-sm"
          }`}>
          Weekly
        </Button>
        <Button
          size="xs"
          color="none"
          onClick={() => setTimeframe("monthly")}
          className={`text-[10px] font-bold uppercase tracking-wider transition-all duration-200 rounded-lg ${
            timeframe === "monthly"
              ? "bg-brand-primary/80 dark:bg-brand-primary/40 text-white backdrop-blur-md shadow-sm border border-white/20"
              : "bg-transparent border-none text-gray-500 hover:bg-white/40 dark:hover:bg-white/10 backdrop-blur-sm"
          }`}>
          Monthly
        </Button>
      </div>

      <div className="relative h-80 w-full mt-4">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white/20 dark:bg-black/10 backdrop-blur-sm z-10 rounded-xl">
            <Spinner size="lg" color="info" />
          </div>
        ) : chartData.dates.length === 0 ? (
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
