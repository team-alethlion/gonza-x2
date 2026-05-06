import React, { useState, useEffect } from "react";
import { Badge, Spinner } from "flowbite-react";
import { HiRefresh } from "react-icons/hi";

const NetworkSpeedTest = () => {
  const [speed, setSpeed] = useState<number>(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const getSpeedEstimate = () => {
    const connection =
      // @ts-expect-error - navigator.connection is not standard
      navigator.connection ||
      // @ts-expect-error - vendor prefix
      navigator.mozConnection ||
      // @ts-expect-error - vendor prefix
      navigator.webkitConnection;

    if (connection && connection.downlink) {
      return connection.downlink;
    }
    return 0;
  };

  const updateSpeed = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setSpeed(getSpeedEstimate());
      setIsRefreshing(false);
    }, 600);
  };

  useEffect(() => {
    setSpeed(getSpeedEstimate());

    const connection =
      // @ts-expect-error - navigator.connection is not standard
      navigator.connection ||
      // @ts-expect-error - vendor prefix
      navigator.mozConnection ||
      // @ts-expect-error - vendor prefix
      navigator.webkitConnection;

    if (connection && connection.addEventListener) {
      connection.addEventListener("change", updateSpeed);
      return () => connection.removeEventListener("change", updateSpeed);
    }
  }, []);

  const getStatusInfo = (val: number) => {
    if (val === 0) return { text: "Detecting...", color: "text-gray-400" };
    if (val < 1) return { text: "Very Slow", color: "text-red-500" };
    if (val < 3) return { text: "Slow", color: "text-orange-500" };
    if (val < 7) return { text: "Good", color: "text-emerald-500" };
    if (val < 15) return { text: "Fast", color: "text-brand-accent" };
    return { text: "Excellent", color: "text-brand-secondary" };
  };

  const status = getStatusInfo(speed);

  return (
    <div className="space-y-3 min-h-[90px] flex flex-col justify-between ">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-widest text-white/60">
          Network Speed
        </span>

        <button
          onClick={updateSpeed}
          disabled={isRefreshing}
          className="p-1 rounded-sm hover:bg-white/10 text-white/60 transition-all"
          title="Refresh Estimate">
          {isRefreshing ? (
            <Spinner size="xs" />
          ) : (
            <HiRefresh className="w-3 h-3" />
          )}
        </button>
      </div>
      <div className="text-sm text-[#80ced7] dark:text-[#80ced7]">
        <div className="font-bold flex gap-1 items-baseline text-white tracking-tight">
          <span
            className={`text-lg transition-colors duration-500 ${
              speed > 5 ? "text-emerald-500" : "text-rose-500"
            }`}>
            {speed || "---"}
          </span>
          <span className="text-[10px] opacity-60">Mbps</span>
        </div>
      </div>
      <div
        className={`text-[10px] font-bold uppercase tracking-wider ${status.color}`}>
        {status.text}
      </div>
    </div>
  );
};

export default NetworkSpeedTest;
