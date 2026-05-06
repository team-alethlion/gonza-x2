import React, { useState, useEffect, useCallback } from "react";
import { syncQueue } from "../../services/syncQueue";
import { db } from "../../db/db";
import { Button, Tooltip, Spinner } from "flowbite-react";
import { HiCloudUpload, HiRefresh } from "react-icons/hi";

interface PendingSyncIndicatorProps {
  className?: string;
  onSyncStart?: () => void;
  onSyncComplete?: (successCount: number, failCount: number) => void;
}

export const PendingSyncIndicator: React.FC<PendingSyncIndicatorProps> = ({
  className = "",
  onSyncStart,
  onSyncComplete,
}) => {
  const [pendingCount, setPendingCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const refreshCount = useCallback(async () => {
    const pending = await db.pendingSales
      .where("status")
      .anyOf(["pending", "failed"])
      .count();
    setPendingCount(pending);
  }, []);

  const handleManualSync = useCallback(async () => {
    if (isSyncing || !isOnline) return;
    setIsSyncing(true);
    onSyncStart?.();

    syncQueue.setCallbacks({
      onStart: (total) => console.log(`Syncing ${total} sales...`),
      onComplete: (success, fail) => {
        setIsSyncing(false);
        onSyncComplete?.(success, fail);
        refreshCount();
      },
    });

    await syncQueue.processQueue();
    setIsSyncing(false);
    refreshCount();
  }, [isSyncing, isOnline, onSyncStart, onSyncComplete, refreshCount]);

  // Auto‑sync when coming online
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      handleManualSync();
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [handleManualSync]);

  // Subscribe to pending sales changes
  useEffect(() => {
    refreshCount();
    const subscription = db.pendingSales
      .where("status")
      .anyOf(["pending", "failed"])
      .subscribe(refreshCount);
    return () => subscription.unsubscribe();
  }, [refreshCount]);

  if (pendingCount === 0 && !isSyncing) return null;

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 flex items-center gap-2 ${className}`}>
      <div className="bg-white/40 dark:bg-white/[0.03] backdrop-blur-md rounded-sm border border-gray-200/50 dark:border-white/[0.1] shadow-xl px-3 py-2 flex items-center gap-2">
        {isSyncing ? (
          <>
            <Spinner size="sm" color="info" />
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
              Syncing...
            </span>
          </>
        ) : (
          <>
            <HiCloudUpload className="text-brand-primary w-4 h-4" />
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
              {pendingCount} sale{pendingCount !== 1 ? "s" : ""} pending
            </span>
            <Tooltip content="Sync now" placement="top">
              <Button
                size="xs"
                color="none"
                disabled={!isOnline}
                onClick={handleManualSync}
                className="rounded-full p-1 bg-brand-primary/10 text-brand-primary hover:bg-brand-primary/20 transition-colors backdrop-blur-sm">
                <HiRefresh className="w-3.5 h-3.5" />
              </Button>
            </Tooltip>
          </>
        )}
      </div>
    </div>
  );
};
