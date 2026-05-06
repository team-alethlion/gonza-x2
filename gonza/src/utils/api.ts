import { useAuthStore } from "../store/useAuthStore";
import { CONFIG, getApiUrl } from "../config";

interface FetchOptions extends RequestInit {
  headers?: Record<string, string>;
}

/**
 * Enhanced fetch wrapper that handles:
 * 1. Automatic Bearer token attachment
 * 2. Automatic token refresh on 401
 * 3. Automatic logout on refresh failure
 */
export const apiFetch = async (endpoint: string, options: FetchOptions = {}) => {
  const { token, refresh, logout } = useAuthStore.getState();
  
  const headers: Record<string, string> = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  if (options.body && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  const url = getApiUrl(endpoint);
  
  try {
    let response = await fetch(url, { ...options, headers });

    if (response.status === 401) {
      console.warn(`[apiFetch] 401 Unauthorized for ${endpoint}. Attempting refresh...`);
      const newToken = await refresh();
      
      if (newToken) {
        console.log("[apiFetch] Token refresh successful. Retrying request.");
        const retryHeaders = {
          ...headers,
          Authorization: `Bearer ${newToken}`,
        };
        response = await fetch(url, { ...options, headers: retryHeaders });
      } else {
        console.warn("[apiFetch] Refresh failed, logging out.");
        await logout();
      }
    }

    return response;
  } catch (error) {
    console.error(`[apiFetch] Network error for ${endpoint}:`, error);
    throw error;
  }
};
