import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import { PageLoader } from "../ui/Loader";

interface AccessGuardProps {
  children: React.ReactNode;
}

/**
 * AccessGuard handles the primary hierarchy of access control:
 * 1. Authentication (handled by AuthGuard)
 * 2. Administrative Blocks (is_frozen or SUSPENDED)
 * 3. Subscription Status (TRIAL/ACTIVE/EXPIRED)
 */
export const AccessGuard: React.FC<AccessGuardProps> = ({ children }) => {
  const { user, isLoading, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isLoading || !isAuthenticated || !user) return;

    // 1. Check for Blocked Status (Priority 1)
    if (user.is_frozen || user.status === "SUSPENDED") {
      if (location.pathname !== "/public/unauthorized") {
        navigate("/public/unauthorized", { replace: true });
      }
      return;
    }

    // 2. Check for Subscription Status (Priority 2)
    const agency = user.agency;
    if (agency) {
      const isExpired = agency.subscription_status === "expired";
      const isSuspended = agency.subscription_status === "suspended";
      
      if ((isExpired || isSuspended) && !location.pathname.startsWith("/subscription")) {
        navigate("/subscription", { replace: true });
        return;
      }
    }

    // Note: Onboarding is handled by the OnboardingGuard specific to routes
  }, [isLoading, user, isAuthenticated, navigate, location.pathname]);

  if (isLoading) return <PageLoader />;
  if (!isAuthenticated) return null;

  return <>{children}</>;
};
