import {
  Dropdown,
  DropdownDivider,
  DropdownHeader,
  DropdownItem,
  Navbar,
  NavbarBrand,
} from "flowbite-react";
import { HiMenuAlt2, HiMoon, HiSun } from "react-icons/hi";
import { RouterLink } from "./RouterLink";
import { useNavigate } from "react-router-dom";
import { useThemeStore } from "../../store/useThemeStore";
import { useAuthStore } from "../../store/useAuthStore";
import { UserAvatar } from "./UserAvatar";

interface AgencyNavbarProps {
  onToggleSidebar?: () => void;
}

export function AgencyNavbar({ onToggleSidebar }: AgencyNavbarProps) {
  const navigate = useNavigate();
  const { mode, toggleMode } = useThemeStore();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    navigate("/public");
  };

  return (
    <Navbar fluid rounded className="relative">
      {/* Leftmost: Sidebar Toggle */}
      <div className="flex items-center">
        <button
          onClick={onToggleSidebar}
          className="mr-3 cursor-pointer rounded p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:ring-2 focus:ring-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
          <HiMenuAlt2 className="h-6 w-6" />
        </button>
      </div>
      {/* Middle: Agency Logo */}
      <div className="absolute left-1/2 -translate-x-1/2 flex items-center">
        <NavbarBrand as={RouterLink} href="/agency">
          <img
            src="/icon.png"
            className="mr-2 h-6 sm:h-7 rounded-md"
            alt="Agency Logo"
          />
          <span className="self-center whitespace-nowrap text-lg font-bold tracking-tight text-gray-900 dark:text-white">
            {user?.agency?.name || "Gonza Systems"}
          </span>
        </NavbarBrand>
      </div>

      {/* Rightmost: Theme Toggle & User Avatar */}
      <div className="flex items-center md:order-2 gap-2">
        <button
          onClick={toggleMode}
          className="rounded-lg p-2 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-white/5 dark:focus:ring-gray-700 transition-colors"
          aria-label="Toggle dark mode"
        >
          {mode === "dark" ? (
            <HiSun className="h-5 w-5" />
          ) : (
            <HiMoon className="h-5 w-5" />
          )}
        </button>
        <Dropdown
          arrowIcon={false}
          inline
          label={
            <div className="hover:opacity-80 transition-opacity">
              <UserAvatar 
                name={user?.first_name || user?.email} 
                src={user?.image}
                size={32}
              />
            </div>
          }
        >
          <DropdownHeader className="bg-gray-50/50 dark:bg-white/5">
            <div className="flex flex-col gap-1">
              <span className="block text-[10px] font-black uppercase tracking-widest text-brand-secondary dark:text-brand-accent">
                {user?.branch?.name || "Main Branch"}
              </span>
              <span className="block text-sm font-bold text-gray-900 dark:text-white">
                {user?.first_name} {user?.last_name}
              </span>
              <span className="block truncate text-xs font-medium text-gray-500 dark:text-gray-400">
                {user?.email}
              </span>
            </div>
          </DropdownHeader>
          <DropdownItem as={RouterLink} href="/agency/profiles">
            Profile
          </DropdownItem>
          <DropdownItem as={RouterLink} href="/onboarding">
            Manage Businesses
          </DropdownItem>
          <DropdownItem as={RouterLink} href="/agency/settings">
            Settings
          </DropdownItem>
          <DropdownDivider />
          <DropdownItem onClick={handleLogout}>Sign out</DropdownItem>
        </Dropdown>
      </div>
    </Navbar>
  );
}
