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
      base: "bg-white px-2 py-1.5 dark:border-white/5 dark:bg-prussian-blue-900 sm:px-4 border-b border-gray-100 shadow-none",
    },
    link: {
      active: {
        on: "bg-brand-primary text-white md:bg-transparent md:text-brand-primary md:dark:text-brand-accent",
        off: "border-b border-gray-100 text-gray-700 hover:bg-gray-50 dark:border-white/5 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white md:border-0 md:hover:bg-transparent md:hover:text-brand-primary md:dark:hover:bg-transparent md:dark:hover:text-brand-accent",
      },
    },
  },
  sidebar: {
    root: {
      base: "h-full border-r border-gray-100 dark:border-white/5",
      inner:
        "h-full flex flex-col overflow-hidden bg-white px-3 py-2 dark:bg-prussian-blue-900/80 backdrop-blur-md shadow-sm",
      // dark:bg-gray-900/80 backdrop-blur-md shadow-sm border-b border-gray-100 dark:border-gray-800
      collapsed: {
        on: "w-16",
        off: "w-60",
      },
    },
    item: {
      active:
        "bg-brand-soft text-brand-primary dark:bg-brand-primary/20 dark:text-brand-accent",
      base: "flex items-center justify-center rounded-lg py-2 px-3 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-white/5 group transition-all duration-200",
      icon: {
        base: "h-5 w-5 flex-shrink-0 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white",
        active: "text-brand-primary dark:text-brand-accent",
      },
    },
    itemGroup: {
      base: "mt-4 space-y-1 border-t border-gray-100 pt-4 first:mt-0 first:border-t-0 first:pt-0 dark:border-white/5",
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
        success:
          "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
        warning:
          "bg-brand-secondary/10 text-brand-secondary dark:bg-brand-secondary/20 dark:text-brand-secondary",
      },
    },
  },
});
