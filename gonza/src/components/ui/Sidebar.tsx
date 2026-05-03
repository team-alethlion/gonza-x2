"use client";

import { useState, useEffect } from "react";
import {
  Sidebar,
  SidebarCTA,
  SidebarItem,
  SidebarItemGroup,
  SidebarItems,
  Badge,
} from "flowbite-react";
import {
  HiArrowSmRight,
  HiChartPie,
  HiCurrencyDollar,
  HiCube,
  HiUsers,
  HiLibrary,
  HiTrendingDown,
  HiShoppingCart,
  HiCreditCard,
  HiClipboardList,
  HiClock,
  HiUserCircle,
  HiCog,
  HiQuestionMarkCircle,
  HiShieldCheck,
  HiLogout,
  HiBriefcase,
} from "react-icons/hi";
import { RouterLink } from "./RouterLink";
import { useAuthStore } from "../../store/useAuthStore";
import { useNavigate } from "react-router-dom";

interface AppSidebarProps {
  collapsed?: boolean;
}

export function AppSidebar({ collapsed }: AppSidebarProps) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [networkSpeed, setNetworkSpeed] = useState<string>("Detecting...");

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    await logout();
    navigate("/auth/login");
  };

  useEffect(() => {
    const updateConnectionInfo = () => {
      const connection = // @ts-expect-error - navigator.connection is not standard in all browsers
        navigator.connection || // @ts-expect-error - navigator.connection is not standard in all browsers
        navigator.mozConnection || // @ts-expect-error - navigator.connection is not standard in all browsers
        navigator.webkitConnection;
      if (connection) {
        setNetworkSpeed(`${connection.downlink} Mbps`);
      } else {
        setNetworkSpeed("Unknown");
      }
    };

    updateConnectionInfo();

    const connection = // @ts-expect-error - navigator.connection is not standard in all browsers
      navigator.connection || // @ts-expect-error - navigator.connection is not standard in all browsers
      navigator.mozConnection || // @ts-expect-error - navigator.connection is not standard in all browsers
      navigator.webkitConnection;
    if (connection && connection.addEventListener) {
      connection.addEventListener("change", updateConnectionInfo);
      return () =>
        connection.removeEventListener("change", updateConnectionInfo);
    }
  }, []);

  return (
    <Sidebar
      aria-label="Agency Management Sidebar"
      collapsed={collapsed}
      className="bg-white/70 dark:bg-prussian-blue-900/70 backdrop-blur-lg">
      {!collapsed && (
        <div className="px-4 py-6 border-b border-gray-100 dark:border-white/5 mb-2 bg-brand-soft/30 dark:bg-brand-primary/10 backdrop-blur-md">
          <h2 className="text-xs font-black uppercase tracking-widest text-brand-primary dark:text-brand-accent">
            {user?.branch?.name || "Main Branch"}
          </h2>
          <div className="mt-2 flex items-center">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold truncate text-gray-900 dark:text-white">
                {user?.first_name} {user?.last_name || ""}{" "}
                <span className="text-xs font-medium opacity-60 capitalize">
                  ({user?.role?.name || "Member"})
                </span>
              </p>
            </div>
          </div>
        </div>
      )}
      <div className="flex-1 overflow-y-auto overflow-x-hidden pr-1 custom-scrollbar">
        <SidebarItems>
          <SidebarItemGroup>
            <SidebarItem
              as={RouterLink}
              href="/agency"
              icon={HiChartPie}
              title={collapsed ? "Dashboard" : undefined}>
              Dashboard
            </SidebarItem>
            <SidebarItem
              as={RouterLink}
              href="/agency/sales"
              icon={HiCurrencyDollar}
              title={collapsed ? "Sales" : undefined}>
              Sales
            </SidebarItem>
            <SidebarItem
              as={RouterLink}
              href="/agency/inventory"
              icon={HiCube}
              title={collapsed ? "Inventory" : undefined}>
              Inventory
            </SidebarItem>
            <SidebarItem
              as={RouterLink}
              href="/agency/customers"
              icon={HiUsers}
              title={collapsed ? "Customers" : undefined}>
              Customers
            </SidebarItem>
          </SidebarItemGroup>

          <SidebarItemGroup>
            <SidebarItem
              as={RouterLink}
              href="/agency/finance"
              icon={HiLibrary}
              title={collapsed ? "Finance" : undefined}>
              Finance
            </SidebarItem>
            <SidebarItem
              as={RouterLink}
              href="/agency/expenses"
              icon={HiTrendingDown}
              title={collapsed ? "Expenses" : undefined}>
              Expenses
            </SidebarItem>
            <SidebarItem
              as={RouterLink}
              href="/agency/purchases"
              icon={HiShoppingCart}
              title={collapsed ? "Purchases" : undefined}>
              Purchases
            </SidebarItem>
            <SidebarItem
              as={RouterLink}
              href="/agency/billing"
              icon={HiCreditCard}
              title={collapsed ? "Billing" : undefined}>
              Billing
            </SidebarItem>
          </SidebarItemGroup>

          <SidebarItemGroup>
            <SidebarItem
              as={RouterLink}
              href="/agency/tasks"
              icon={HiClipboardList}
              title={collapsed ? "Tasks" : undefined}>
              Tasks
            </SidebarItem>
            <SidebarItem
              as={RouterLink}
              href="/agency/history"
              icon={HiClock}
              title={collapsed ? "History" : undefined}>
              History
            </SidebarItem>
            <SidebarItem
              as={RouterLink}
              href="/agency/profiles"
              icon={HiUserCircle}
              title={collapsed ? "Profiles" : undefined}>
              Profiles
            </SidebarItem>
          </SidebarItemGroup>

          <SidebarItemGroup>
            <SidebarItem
              as={RouterLink}
              href="/agency/settings"
              icon={HiCog}
              title={collapsed ? "Settings" : undefined}>
              Settings
            </SidebarItem>
            <SidebarItem
              as={RouterLink}
              href="/agency/help"
              icon={HiQuestionMarkCircle}
              title={collapsed ? "Help" : undefined}>
              Help
            </SidebarItem>
            <SidebarItem
              as={RouterLink}
              href="/agency/privacy-policy"
              icon={HiShieldCheck}
              title={collapsed ? "Privacy Policy" : undefined}>
              Privacy Policy
            </SidebarItem>
            <SidebarItem
              as={RouterLink}
              href="/public"
              icon={HiArrowSmRight}
              title={collapsed ? "Exit to Public" : undefined}>
              Exit to Public
            </SidebarItem>
          </SidebarItemGroup>
        </SidebarItems>

        {!collapsed && (
          <SidebarCTA>
            <div className="mb-3 flex items-center">
              <Badge color="warning">Network Speed</Badge>
              <button
                aria-label="Close"
                className="-m-1.5 ml-auto inline-flex h-6 w-6 rounded-lg bg-white/10 p-1 text-white hover:bg-white/20 focus:ring-2 focus:ring-gray-400"
                type="button">
                <svg
                  aria-hidden
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
            <div className="mb-3 text-sm text-[#80ced7] dark:text-[#80ced7]">
              Current download speed:{" "}
              <span className="font-bold text-white">{networkSpeed}</span>
            </div>
            <div className="text-xs text-white/60">
              This helps us optimize your inventory syncing performance.
            </div>
          </SidebarCTA>
        )}
      </div>

      <div className="mt-auto border-t border-gray-100 pt-2 dark:border-gray-700">
        <SidebarItems>
          <SidebarItemGroup>
            <SidebarItem
              as={RouterLink}
              href="/onboarding"
              icon={HiBriefcase}
              title={collapsed ? "Manage Businesses" : undefined}>
              Manage Businesses
            </SidebarItem>
            <SidebarItem
              onClick={handleLogout}
              className="cursor-pointer"
              icon={HiLogout}
              title={collapsed ? "Logout" : undefined}>
              Logout
            </SidebarItem>
          </SidebarItemGroup>
        </SidebarItems>
      </div>
    </Sidebar>
  );
}
