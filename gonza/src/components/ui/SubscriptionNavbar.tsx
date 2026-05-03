import {
  Avatar,
  Dropdown,
  DropdownDivider,
  DropdownHeader,
  DropdownItem,
  Navbar,
  NavbarBrand,
  NavbarCollapse,
  NavbarLink,
  NavbarToggle,
} from "flowbite-react";
import { useLocation } from "react-router-dom";
import { HiMoon, HiSun } from "react-icons/hi";
import { RouterLink } from "./RouterLink";
import { useThemeStore } from "../../store/useThemeStore";

export function SubscriptionNavbar() {
  const location = useLocation();
  const { mode, toggleMode } = useThemeStore();

  return (
    <Navbar fluid rounded>
      <NavbarBrand as={RouterLink} href="/">
        <img
          src="/favicon.svg"
          className="mr-3 h-6 sm:h-9"
          alt="Flowbite React Logo"
        />
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
          Gonza Plans
        </span>
      </NavbarBrand>
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
          <DropdownItem as={RouterLink} href="/agency">
            Back to Dashboard
          </DropdownItem>
          <DropdownItem as={RouterLink} href="/onboarding">
            Manage Businesses
          </DropdownItem>
          <DropdownDivider />
          <DropdownItem href="/logout">Sign out</DropdownItem>
        </Dropdown>
        <NavbarToggle />
      </div>
    </Navbar>
  );
}
