import { useState, useCallback } from "react";
import { Outlet } from "react-router-dom";
import { AgencyNavbar } from "../ui/AgencyNavbar";
import { AppSidebar } from "../ui/Sidebar";
import SpeedDial from "../ui/SpeedDial";

const AgencyLayout = () => {
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
