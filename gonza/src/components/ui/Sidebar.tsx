"use client";

import { useState, useEffect } from "react";
import {
  Sidebar,
  SidebarCTA,
  SidebarItem,
  SidebarItemGroup,
  SidebarItems,
  Badge,
  Select,
} from "flowbite-react";
import {
  HiLogout,
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
  HiArrowSmRight,
  HiBriefcase,
  HiUser,
} from "react-icons/hi";
import { RouterLink } from "./RouterLink";
import { useAuthStore } from "../../store/useAuthStore";
import { useNavigate, useLocation } from "react-router-dom";

interface AppSidebarProps {
  collapsed?: boolean;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export function AppSidebar({
  collapsed,
  isMobileOpen,
  onCloseMobile,
}: AppSidebarProps) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/agency") return location.pathname === "/agency";
    return location.pathname.startsWith(path);
  };
  const [networkSpeed, setNetworkSpeed] = useState<string>("Detecting...");

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    await logout();
    navigate("/auth/login");
  };

  useEffect(() => {
    // Only close mobile sidebar when the path actually changes
    onCloseMobile?.();
  }, [location.pathname]); // Removed onCloseMobile from dependencies to avoid recreation loop

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
    <div
      className={`fixed inset-y-0 left-0 z-40 transition-transform duration-300 transform lg:static lg:translate-x-0 ${
        isMobileOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
      <Sidebar
        aria-label="Agency Management Sidebar"
        collapsed={collapsed}
        className="bg-white/70 dark:bg-prussian-blue-900/20 backdrop-blur-lg h-full pt-10"
        theme={{
          root: {
            inner:
              "h-full overflow-y-auto overflow-x-hidden bg-white/70 py-4 px-2 dark:bg-prussian-blue-900/0",
          },
          item: {
            base: "flex items-center justify-center rounded-lg p-2 text-base font-normal text-gray-900 hover:bg-white/50 dark:text-white dark:hover:bg-white/10 transition-all duration-200",
            active:
              "bg-brand-primary/10 dark:bg-brand-accent/10 text-brand-primary dark:text-brand-accent border border-brand-primary/20 dark:border-brand-accent/20 backdrop-blur-md font-bold",
            icon: {
              base: "h-6 w-6 flex-shrink-0 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white",
              active: "text-brand-primary dark:text-brand-accent",
            },
          },
        }}>
        {/* bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm border-b border-gray-100 dark:border-gray-800 */}
        {!collapsed && (
          <div className="mb-4 px-1 backdrop-blur-md">
            <div className="flex items-center justify-between ">
              <h2 className="text-[.8rem] px-3 font-extrabold capitalize tracking-[0.2em] text-brand-primary dark:text-white/30 opacity-80">
                {user?.branch?.name || "Main Branch"}
              </h2>
              <button
                onClick={onCloseMobile}
                className="lg:hidden p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 text-gray-500">
                <HiLogout className="w-4 h-4 rotate-180" />
              </button>
            </div>
            <div className="flex items-center">
              <div className="flex-1 min-w-0 flex flex-col gap-2">
                <p className="text-sm font-extrabold truncate text-gray-900 dark:text-white"></p>
                <div className="flex items-center gap-2">
                  <HiUser />
                  <div className="flex-1 min-w-0">
                    <Select
                      name="role"
                      id="role"
                      sizing="sm"
                      theme={{
                        field: {
                          select: {
                            base: "block flex-1! bg-gray-950/20! w-full border disabled:cursor-not-allowed disabled:opacity-50 py-[.3rem]! px-2! text-xs rounded-md!",
                          },
                        },
                      }}>
                      <option value="">
                        {user?.role?.name || "Member"} (
                        {user?.role?.name || "Member"})
                      </option>
                    </Select>
                  </div>
                </div>
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
                active={isActive("/agency")}
                title={collapsed ? "Dashboard" : undefined}>
                Dashboard
              </SidebarItem>
              <SidebarItem
                as={RouterLink}
                href="/agency/sales"
                icon={HiCurrencyDollar}
                active={isActive("/agency/sales")}
                title={collapsed ? "Sales" : undefined}>
                Sales
              </SidebarItem>
              <SidebarItem
                as={RouterLink}
                href="/agency/inventory"
                icon={HiCube}
                active={isActive("/agency/inventory")}
                title={collapsed ? "Inventory" : undefined}>
                Inventory
              </SidebarItem>
              <SidebarItem
                as={RouterLink}
                href="/agency/customers"
                icon={HiUsers}
                active={isActive("/agency/customers")}
                title={collapsed ? "Customers" : undefined}>
                Customers
              </SidebarItem>
            </SidebarItemGroup>

            <SidebarItemGroup>
              <SidebarItem
                as={RouterLink}
                href="/agency/finance"
                icon={HiLibrary}
                active={isActive("/agency/finance")}
                title={collapsed ? "Finance" : undefined}>
                Finance
              </SidebarItem>
              <SidebarItem
                as={RouterLink}
                href="/agency/expenses"
                icon={HiTrendingDown}
                active={isActive("/agency/expenses")}
                title={collapsed ? "Expenses" : undefined}>
                Expenses
              </SidebarItem>
              <SidebarItem
                as={RouterLink}
                href="/agency/purchases"
                icon={HiShoppingCart}
                active={isActive("/agency/purchases")}
                title={collapsed ? "Purchases" : undefined}>
                Purchases
              </SidebarItem>
              <SidebarItem
                as={RouterLink}
                href="/agency/billing"
                icon={HiCreditCard}
                active={isActive("/agency/billing")}
                title={collapsed ? "Billing" : undefined}>
                Billing
              </SidebarItem>
            </SidebarItemGroup>

            <SidebarItemGroup>
              <SidebarItem
                as={RouterLink}
                href="/agency/tasks"
                icon={HiClipboardList}
                active={isActive("/agency/tasks")}
                title={collapsed ? "Tasks" : undefined}>
                Tasks
              </SidebarItem>
              <SidebarItem
                as={RouterLink}
                href="/agency/history"
                icon={HiClock}
                active={isActive("/agency/history")}
                title={collapsed ? "History" : undefined}>
                History
              </SidebarItem>
              <SidebarItem
                as={RouterLink}
                href="/agency/profiles"
                icon={HiUserCircle}
                active={isActive("/agency/profiles")}
                title={collapsed ? "Profiles" : undefined}>
                Profiles
              </SidebarItem>
            </SidebarItemGroup>

            <SidebarItemGroup>
              <SidebarItem
                as={RouterLink}
                href="/agency/settings"
                icon={HiCog}
                active={isActive("/agency/settings")}
                title={collapsed ? "Settings" : undefined}>
                Settings
              </SidebarItem>
              <SidebarItem
                as={RouterLink}
                href="/agency/help"
                icon={HiQuestionMarkCircle}
                active={isActive("/agency/help")}
                title={collapsed ? "Help" : undefined}>
                Help
              </SidebarItem>
              <SidebarItem
                as={RouterLink}
                href="/agency/privacy-policy"
                icon={HiShieldCheck}
                active={isActive("/agency/privacy-policy")}
                title={collapsed ? "Privacy Policy" : undefined}>
                Privacy Policy
              </SidebarItem>
              <SidebarItem
                as={RouterLink}
                href="/public"
                icon={HiArrowSmRight}
                active={isActive("/public")}
                title={collapsed ? "Exit to Public" : undefined}>
                Exit to Public
              </SidebarItem>
            </SidebarItemGroup>
          </SidebarItems>

          {!collapsed && (
            <SidebarCTA>
              <div className="mb-3 flex items-center">
                <Badge color="warning">Network Speed</Badge>
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
                active={isActive("/onboarding")}
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
    </div>
  );
}
