/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import { Card, Button, Spinner } from "flowbite-react";
import { HiOutlineChartBar } from "react-icons/hi";
import { useAuthStore } from "../../store/useAuthStore";
import { getApiUrl, CONFIG } from "../../config";
import { NumberFormatter } from "../../utils/formatters";

const AnalysisGraph = () => {
  const { user, token } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<"daily" | "weekly" | "monthly">("monthly");
  const [chartData, setChartData] = useState<{ dates: string[]; amounts: number[] }>({
    dates: [],
    amounts: [],
  });

  useEffect(() => {
    const fetchChartData = async () => {
      if (!user?.branch?.id || !token) return;

      setLoading(true);
      try {
        const url = getApiUrl(`${CONFIG.API.SALES.BASE}performance_chart/`);
        const params = new URLSearchParams({
          branchId: user.branch.id,
          timeframe: timeframe,
        });

        const res = await fetch(`${url}?${params}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          const dates = data.map((item: any) => {
            const d = new Date(item.date);
            if (timeframe === "monthly") {
              return d.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
            }
            return d.toLocaleDateString("en-US", { day: "numeric", month: "short" });
          });
          const amounts = data.map((item: any) => item.amount);
          setChartData({ dates, amounts });
        }
      } catch (error) {
        console.error("Failed to fetch performance chart:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, [user?.branch?.id, token, timeframe]);

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
      name: "Sales Volume",
      data: chartData.amounts,
    },
  ];

  return (
    <Card className="bg-white dark:bg-prussian-blue-900 border-gray-100 dark:border-white/5 shadow-none mt-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-brand-soft/50 dark:bg-brand-primary/20 mt-1">
            <HiOutlineChartBar className="h-5 w-5 text-brand-primary dark:text-brand-accent" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">
              Performance Analysis
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Visualize your sales trends over time
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-gray-50 dark:bg-white/5 p-1 rounded-lg">
          <Button
            size="xs"
            color={timeframe === "daily" ? "primary" : "gray"}
            pill={timeframe !== "daily"}
            onClick={() => setTimeframe("daily")}
            className={`text-[10px] font-bold uppercase tracking-wider ${
              timeframe === "daily" ? "" : "bg-transparent border-none text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10"
            }`}
          >
            Daily
          </Button>
          <Button
            size="xs"
            color={timeframe === "weekly" ? "primary" : "gray"}
            pill={timeframe !== "weekly"}
            onClick={() => setTimeframe("weekly")}
            className={`text-[10px] font-bold uppercase tracking-wider ${
              timeframe === "weekly" ? "" : "bg-transparent border-none text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10"
            }`}
          >
            Weekly
          </Button>
          <Button
            size="xs"
            color={timeframe === "monthly" ? "primary" : "gray"}
            pill={timeframe !== "monthly"}
            onClick={() => setTimeframe("monthly")}
            className={`text-[10px] font-bold uppercase tracking-wider ${
              timeframe === "monthly" ? "" : "bg-transparent border-none text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10"
            }`}
          >
            Monthly
          </Button>
        </div>
      </div>

      <div className="relative h-80 w-full">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-prussian-blue-900/50 z-10 rounded-lg">
            <Spinner size="lg" color="info" />
          </div>
        ) : chartData.dates.length === 0 ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
            <HiOutlineChartBar className="h-12 w-12 mb-2 opacity-20" />
            <p className="text-sm font-medium">No performance data found for this period</p>
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
