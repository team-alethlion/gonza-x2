import { createTheme } from "flowbite-react";

export const theme = createTheme({
  button: {
    color: {
      primary:
        "bg-brand-primary hover:bg-space-indigo-800 text-white focus:ring-4 focus:ring-brand-primary/30 dark:bg-space-indigo-500 dark:hover:bg-space-indigo-600",
      secondary:
        "bg-brand-secondary hover:bg-tiger-flame-500 text-white focus:ring-4 focus:ring-brand-secondary/30",
      accent:
        "bg-brand-accent hover:bg-soft-periwinkle-300 text-white focus:ring-4 focus:ring-brand-accent/30",
    },
  },
  navbar: {
    root: {
      base: "bg-white px-2 py-2.5 dark:border-space-indigo-800 dark:bg-prussian-blue-900 sm:px-4 border-b border-gray-100 shadow-sm",
    },
    link: {
      active: {
        on: "bg-brand-primary text-white md:bg-transparent md:text-brand-primary md:dark:text-brand-accent",
        off: "border-b border-gray-100 text-gray-700 hover:bg-gray-50 dark:border-space-indigo-800 dark:text-gray-400 dark:hover:bg-space-indigo-800 dark:hover:text-white md:border-0 md:hover:bg-transparent md:hover:text-brand-primary md:dark:hover:bg-transparent md:dark:hover:text-brand-accent",
      },
    },
  },
  sidebar: {
    root: {
      base: "h-full border-r border-gray-100 dark:border-space-indigo-800",
      inner:
        "h-full flex flex-col overflow-hidden bg-white px-3 py-4 dark:bg-prussian-blue-900",
    },
    item: {
      active: "bg-brand-soft text-brand-primary dark:bg-space-indigo-800 dark:text-brand-accent",
      base: "flex items-center justify-center rounded-lg p-2 text-base font-normal text-gray-900 hover:bg-brand-soft dark:text-white dark:hover:bg-space-indigo-800 group",
    },
  },
  card: {
    root: {
      base: "flex rounded-lg border border-gray-200 bg-white shadow-md dark:border-space-indigo-800 dark:bg-space-indigo-800",
    },
  },
  textInput: {
    field: {
      input: {
        colors: {
          gray: "border-gray-300 bg-gray-50 text-gray-900 focus:border-brand-primary focus:ring-brand-primary dark:border-space-indigo-800 dark:bg-prussian-blue-900 dark:text-white dark:placeholder-gray-400 dark:focus:border-brand-accent dark:focus:ring-brand-accent",
        },
      },
    },
  },
  badge: {
    root: {
      color: {
        info: "bg-brand-soft text-brand-primary dark:bg-space-indigo-800 dark:text-brand-accent",
        success: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
        warning: "bg-brand-secondary/10 text-brand-secondary dark:bg-brand-secondary/20 dark:text-brand-secondary",
      }
    }
  }
});
