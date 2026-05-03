import { createTheme } from "flowbite-react";

export const theme = createTheme({
  button: {
    color: {
      primary:
        "bg-[#252861] hover:bg-[#1c1e4a] text-white focus:ring-4 focus:ring-[#252861]/30 dark:bg-[#464cb9] dark:hover:bg-[#383d94]",
      secondary:
        "bg-[#f05a2b] hover:bg-[#ee4411] text-white focus:ring-4 focus:ring-[#f05a2b]/30",
      accent:
        "bg-[#9b87f5] hover:bg-[#8971f4] text-white focus:ring-4 focus:ring-[#9b87f5]/30",
    },
  },
  navbar: {
    root: {
      base: "bg-white px-2 py-2.5 dark:border-[#1c1e4a] dark:bg-[#0B1326] sm:px-4 border-b border-gray-100 shadow-sm",
    },
    link: {
      active: {
        on: "bg-[#252861] text-white md:bg-transparent md:text-[#252861] md:dark:text-[#9b87f5]",
        off: "border-b border-gray-100 text-gray-700 hover:bg-gray-50 dark:border-[#1c1e4a] dark:text-gray-400 dark:hover:bg-[#1c1e4a] dark:hover:text-white md:border-0 md:hover:bg-transparent md:hover:text-[#252861] md:dark:hover:bg-transparent md:dark:hover:text-[#9b87f5]",
      },
    },
  },
  sidebar: {
    root: {
      base: "h-full border-r border-gray-100 dark:border-[#1c1e4a]",
      inner:
        "h-full flex flex-col overflow-hidden bg-white px-3 py-4 dark:bg-[#0B1326]",
    },
    item: {
      active: "bg-[#F1F0FB] text-[#252861] dark:bg-[#1c1e4a] dark:text-[#9b87f5]",
      base: "flex items-center justify-center rounded-lg p-2 text-base font-normal text-gray-900 hover:bg-[#F1F0FB] dark:text-white dark:hover:bg-[#1c1e4a] group",
    },
  },
  card: {
    root: {
      base: "flex rounded-lg border border-gray-200 bg-white shadow-md dark:border-[#1c1e4a] dark:bg-[#1c1e4a]",
    },
  },
  textInput: {
    field: {
      input: {
        colors: {
          gray: "border-gray-300 bg-gray-50 text-gray-900 focus:border-[#252861] focus:ring-[#252861] dark:border-[#1c1e4a] dark:bg-[#0B1326] dark:text-white dark:placeholder-gray-400 dark:focus:border-[#9b87f5] dark:focus:ring-[#9b87f5]",
        },
      },
    },
  },
  badge: {
    root: {
      color: {
        info: "bg-[#F1F0FB] text-[#252861] dark:bg-[#1c1e4a] dark:text-[#9b87f5]",
        success: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
        warning: "bg-[#f05a2b]/10 text-[#f05a2b] dark:bg-[#f05a2b]/20 dark:text-[#f05a2b]",
      }
    }
  }
});
