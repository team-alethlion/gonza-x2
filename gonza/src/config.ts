/**
 * Centralized environment variables and constants for the Gonza frontend.
 * This ensures easy updates when deploying to platforms like Vercel.
 */

export const CONFIG = {
  API: {
    BASE_URL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api",
    AUTH: {
      LOGIN: "/auth/token/",
      REFRESH: "/auth/token/refresh/",
      VERIFY: "/auth/token/verify/",
    },
    USERS: {
      BASE: "/users/",
      PROFILE: "/users/profile/",
    },
    INVENTORY: {
      BASE: "/inventory/",
      PRODUCTS: "/inventory/products/",
      CATEGORIES: "/inventory/categories/",
      STOCKS: "/inventory/stocks/",
    },
    SALES: {
      BASE: "/sales/",
      INVOICES: "/sales/invoices/",
      RECEIPTS: "/sales/receipts/",
      QUOTES: "/sales/quotes/",
    },
    FINANCE: {
      BASE: "/finance/",
      EXPENSES: "/finance/expenses/",
      PAYMENTS: "/finance/payments/",
    },
    CUSTOMERS: {
      BASE: "/customers/",
    },
    MESSAGING: {
      BASE: "/messaging/",
    },
    TASKS: {
      BASE: "/tasks/",
    },
    ACTIVITIES: {
      BASE: "/activities/",
    },
    CORE: {
      BASE: "/core/",
    },
  },
  APP: {
    NAME: import.meta.env.VITE_APP_NAME || "Gonza Systems",
    SUPPORT_PHONE: import.meta.env.VITE_SUPPORT_PHONE || "0758519696",
    SUPPORT_EMAIL: import.meta.env.VITE_SUPPORT_EMAIL || "gonzasystems@gmail.com",
  },
};

/**
 * Utility to construct full API URLs
 */
export const getApiUrl = (endpoint: string): string => {
  const baseUrl = CONFIG.API.BASE_URL.endsWith("/")
    ? CONFIG.API.BASE_URL.slice(0, -1)
    : CONFIG.API.BASE_URL;
  
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  return `${baseUrl}${cleanEndpoint}`;
};
