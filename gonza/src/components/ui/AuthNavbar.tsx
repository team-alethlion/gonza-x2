import {
  Navbar,
  NavbarBrand,
} from "flowbite-react";
import { HiMoon, HiSun } from "react-icons/hi";
import { RouterLink } from "./RouterLink";
import { useThemeStore } from "../../store/useThemeStore";

export function AuthNavbar() {
  const { mode, toggleMode } = useThemeStore();

  return (
    <Navbar fluid rounded className="bg-transparent dark:bg-transparent">
      <NavbarBrand as={RouterLink} href="/public">
        <img
          src="/favicon.svg"
          className="mr-3 h-6 sm:h-9"
          alt="Agency Logo"
        />
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
          Gonza
        </span>
      </NavbarBrand>
      <div className="flex items-center gap-2">
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
        <RouterLink 
          href="/public/about" 
          className="text-sm font-medium text-gray-500 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400"
        >
          Help
        </RouterLink>
      </div>
    </Navbar>
  );
}
