import { useState, useCallback, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { AgencyNavbar } from "../ui/AgencyNavbar";
import { AppSidebar } from "../ui/Sidebar";
import SpeedDial from "../ui/SpeedDial";
import { useAuthStore } from "../../store/useAuthStore";
import { useProductStore } from "../../store/useProductStore";
import { useCustomerStore } from "../../store/useCustomerStore";
import { useSalesStore } from "../../store/useSalesStore";
import { useFinanceStore } from "../../store/useFinanceStore";

const AgencyLayout = () => {
  const { user, isAuthenticated } = useAuthStore();
  const branchId = user?.branch?.id;

  const { sync: syncProducts } = useProductStore();
  const { sync: syncCustomers } = useCustomerStore();
  const { sync: syncSales } = useSalesStore();
  const { sync: syncFinance } = useFinanceStore();

  useEffect(() => {
    if (isAuthenticated && branchId) {
      console.log("🔄 [AgencyLayout] Starting Global Dashboard Sync...");
      Promise.all([
        syncProducts(false, branchId),
        syncCustomers(false, branchId),
        syncSales(false, branchId),
        syncFinance(false, branchId),
      ]).catch((err) => {
        console.error("❌ [AgencyLayout] Global Sync Failed:", err);
      });
    }
  }, [
    isAuthenticated,
    branchId,
    syncProducts,
    syncCustomers,
    syncSales,
    syncFinance,
  ]);

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleSidebar = useCallback(() => {
    // On mobile, toggle the drawer. On desktop, toggle collapse.
    if (window.innerWidth < 1024) {
      setIsMobileOpen((prev) => !prev);
    } else {
      setIsCollapsed((prev) => !prev);
    }
  }, []);

  const closeMobile = useCallback(() => {
    setIsMobileOpen(false);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900 relative">
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 z-30 bg-gray-900/50 backdrop-blur-sm lg:hidden"
          onClick={closeMobile}
        />
      )}

      <AppSidebar 
        collapsed={isCollapsed} 
        isMobileOpen={isMobileOpen} 
        onCloseMobile={closeMobile} 
      />

      <div className="flex flex-col flex-1 overflow-hidden">
        <AgencyNavbar onToggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          <Outlet />
          <SpeedDial />
        </main>
      </div>
    </div>
  );
};

export default AgencyLayout;
