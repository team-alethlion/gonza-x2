import {
  Avatar,
  Dropdown,
  DropdownDivider,
  DropdownHeader,
  DropdownItem,
  Navbar,
  NavbarBrand,
} from "flowbite-react";
import { HiMenuAlt2, HiMoon, HiSun } from "react-icons/hi";
import { RouterLink } from "./RouterLink";
import { useThemeStore } from "../../store/useThemeStore";

interface AgencyNavbarProps {
  onToggleSidebar?: () => void;
}

export function AgencyNavbar({ onToggleSidebar }: AgencyNavbarProps) {
  const { mode, toggleMode } = useThemeStore();

  return (
    <Navbar fluid rounded className="relative">
      {/* Leftmost: Sidebar Toggle */}
      <div className="flex items-center">
        <button
          onClick={onToggleSidebar}
          className="mr-3 cursor-pointer rounded p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:ring-2 focus:ring-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
        >
          <HiMenuAlt2 className="h-6 w-6" />
        </button>
      </div>

      {/* Middle: Agency Logo */}
      <div className="absolute left-1/2 -translate-x-1/2 flex items-center">
        <NavbarBrand as={RouterLink} href="/agency">
          <img
            src="/favicon.svg"
            className="mr-3 h-6 sm:h-9"
            alt="Agency Logo"
          />
          <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
            Agency Name
          </span>
        </NavbarBrand>
      </div>

      {/* Rightmost: Theme Toggle & User Avatar */}
      <div className="flex items-center md:order-2 gap-2">
        <button
          onClick={toggleMode}
          className="rounded-lg p-2.5 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
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
            <Avatar
              alt="User settings"
              img="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
              rounded
              size="sm"
            />
          }
        >
          <DropdownHeader>
            <div className="flex flex-col gap-1">
              <span className="block text-sm font-bold text-purple-600 dark:text-purple-400">
                Main Branch
              </span>
              <span className="block text-sm">Bonnie Green</span>
              <span className="block truncate text-sm font-medium">
                name@flowbite.com
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
          <DropdownItem href="/logout">Sign out</DropdownItem>
        </Dropdown>
      </div>
    </Navbar>
  );
}
