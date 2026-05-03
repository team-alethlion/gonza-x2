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
  useThemeMode,
} from "flowbite-react";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { HiMoon, HiSun } from "react-icons/hi";
import { RouterLink } from "./RouterLink";
import { useThemeStore } from "../../store/useThemeStore";

export function PublicNavbar() {
  const location = useLocation();
  const { mode, toggleMode } = useThemeStore();
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className={`${isSticky ? 'sticky top-0 z-50 w-full transition-all duration-300' : 'relative'}`}>
      <Navbar 
        fluid 
        rounded={!isSticky}
        className={`${isSticky ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm border-b border-gray-100 dark:border-gray-800' : 'bg-white dark:bg-gray-900'}`}
      >
        <NavbarBrand as={RouterLink} href="/">
          <img
            src="/favicon.svg"
            className="mr-3 h-6 sm:h-9"
            alt="Flowbite React Logo"
          />
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
          Gonza Public
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
            Go to Dashboard
          </DropdownItem>
          <DropdownItem as={RouterLink} href="/onboarding">
            Manage Businesses
          </DropdownItem>
          <DropdownDivider />
          <DropdownItem href="/logout">Sign out</DropdownItem>
        </Dropdown>
        <NavbarToggle />
      </div>
      <NavbarCollapse>
        <NavbarLink
          as={RouterLink}
          href="/public"
          active={location.pathname === "/public"}
        >
          Home
        </NavbarLink>
        <NavbarLink
          as={RouterLink}
          href="/public/about"
          active={location.pathname === "/public/about"}
        >
          About
        </NavbarLink>
        <NavbarLink
          as={RouterLink}
          href="/subscription"
          active={location.pathname === "/subscription"}
        >
          Pricing
        </NavbarLink>
        <NavbarLink
          as={RouterLink}
          href="/auth/signup"
          active={location.pathname === "/auth/signup"}
        >
          Get Started
        </NavbarLink>      </NavbarCollapse>
    </Navbar>
  </div>
  );
}
