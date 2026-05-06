import React, { useState, useEffect } from "react";
import SpeedTest from "@cloudflare/speedtest";
import { Badge, Button, Spinner } from "flowbite-react";
import { HiRefresh } from "react-icons/hi";

const NetworkSpeedTest = () => {
  const [speed, setSpeed] = useState<string>("Detecting...");
  const [isRunning, setIsRunning] = useState(false);

  const runTest = () => {
    setIsRunning(true);
    setSpeed("Testing...");

    const engine = new SpeedTest({
      autoStart: true,
      // We only want a quick check for the sidebar
      measureUpload: false,
    });

    engine.onResultsChange = () => {
      const results = engine.results.getSummary();
      if (results.download) {
        // Mbps
        const mbps = (results.download / 1000000).toFixed(2);
        setSpeed(`${mbps} Mbps`);
      }
    };

    engine.onFinish = () => {
      setIsRunning(false);
    };

    engine.onError = (err) => {
      console.error("Speed test error:", err);
      setSpeed("Error");
      setIsRunning(false);
    };
  };

  useEffect(() => {
    // Run an initial test on mount
    runTest();
  }, []);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Badge color="warning" className="rounded-sm">
          Network Speed
        </Badge>
        <button
          onClick={runTest}
          disabled={isRunning}
          className="p-1 rounded-sm hover:bg-white/10 text-white/60 transition-all"
          title="Refresh Speed">
          {isRunning ? (
            <Spinner size="xs" />
          ) : (
            <HiRefresh className="w-3 h-3" />
          )}
        </button>
      </div>
      <div className="text-sm text-[#80ced7] dark:text-[#80ced7]">
        Current download:
        <span className="font-bold text-white tracking-tight">{speed}</span>
      </div>
      <div className="text-[10px] text-white/40 leading-relaxed italic">
        Real-time metrics via Cloudflare to optimize syncing.
      </div>
    </div>
  );
};

export default NetworkSpeedTest;
