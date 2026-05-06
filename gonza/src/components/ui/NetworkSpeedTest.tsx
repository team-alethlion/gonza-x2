import React, { useState, useEffect } from "react";
import { Badge, Spinner } from "flowbite-react";
import { HiRefresh } from "react-icons/hi";

const NetworkSpeedTest = () => {
  const [speed, setSpeed] = useState<string>("Detecting...");
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
      // The browser's downlink is a passive estimate in Mbps
      // It is often capped at 10Mbps to prevent fingerprinting
      return `${connection.downlink} Mbps`;
    }
    return "Unknown";
  };

  const updateSpeed = () => {
    setIsRefreshing(true);
    // Artificial delay to make the refresh feel "real" and prevent UI flickering
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

  return (
    <div className="space-y-3 min-h-[90px] flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <Badge color="warning" className="rounded-sm">Network Speed</Badge>
        <button 
          onClick={updateSpeed} 
          disabled={isRefreshing}
          className="p-1 rounded-sm hover:bg-white/10 text-white/60 transition-all"
          title="Refresh Estimate"
        >
          {isRefreshing ? <Spinner size="xs" /> : <HiRefresh className="w-3 h-3" />}
        </button>
      </div>
      <div className="text-sm text-[#80ced7] dark:text-[#80ced7]">
        Current estimate:{" "}
        <span className="font-bold text-white tracking-tight">{speed}</span>
      </div>
      <div className="text-[10px] text-white/40 leading-relaxed italic">
        Zero-data background estimate for sync performance.
      </div>
    </div>
  );
};

export default NetworkSpeedTest;
