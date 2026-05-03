import { useState } from "react";
import { Outlet } from "react-router-dom";
import { AgencyNavbar } from "../ui/AgencyNavbar";
import { AppSidebar } from "../ui/Sidebar";

const AgencyLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
      <AppSidebar collapsed={isCollapsed} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <AgencyNavbar onToggleSidebar={() => setIsCollapsed(!isCollapsed)} />
        <main className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AgencyLayout;
