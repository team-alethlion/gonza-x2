import {
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
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { HiMoon, HiSun } from "react-icons/hi";
import { RouterLink } from "./RouterLink";
import { useThemeStore } from "../../store/useThemeStore";
import { useAuthStore } from "../../store/useAuthStore";
import { UserAvatar } from "./UserAvatar";

export function PublicNavbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { mode, toggleMode } = useThemeStore();
  const { user, isAuthenticated, logout } = useAuthStore();
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

  const handleLogout = async () => {
    await logout();
    navigate("/public");
  };

  return (
    <div className={`${isSticky ? 'sticky top-0 z-50 w-full transition-all duration-300' : 'relative'}`}>
      <Navbar 
        fluid 
        rounded={!isSticky}
        className={`${isSticky ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm border-b border-gray-100 dark:border-gray-800' : 'bg-white dark:bg-gray-900'}`}
      >
        <NavbarBrand as={RouterLink} href="/">
          <img
            src="/icon.png"
            className="mr-3 h-8 sm:h-10 rounded-lg"
            alt="Gonza Systems Logo"
          />
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
          Gonza Systems
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

        {isAuthenticated ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <UserAvatar 
                name={user?.first_name || user?.email} 
                src={user?.image}
                size={32}
              />
            }
          >
            <DropdownHeader>
              <div className="flex flex-col gap-1">
                <span className="block text-sm font-bold text-[#f05a2b] dark:text-[#9b87f5]">
                  {user?.agency?.name || "Main Branch"}
                </span>
                <span className="block text-sm">
                  {user?.first_name} {user?.last_name}
                </span>
                <span className="block truncate text-sm font-medium">
                  {user?.email}
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
            <DropdownItem onClick={handleLogout}>Sign out</DropdownItem>
          </Dropdown>
        ) : (
          <div className="flex items-center">
             <UserAvatar size={32} />
          </div>
        )}
        
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
        
        {!isAuthenticated && (
          <NavbarLink
            as={RouterLink}
            href="/auth/signup"
            active={location.pathname === "/auth/signup"}
          >
            Get Started
          </NavbarLink>
        )}
      </NavbarCollapse>
    </Navbar>
  </div>
  );
}
