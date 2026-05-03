import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import { PageLoader } from "../ui/Loader";

interface OnboardingGuardProps {
  children: React.ReactNode;
  requireOnboarded: boolean;
}

export const OnboardingGuard: React.FC<OnboardingGuardProps> = ({ 
  children, 
  requireOnboarded 
}) => {
  const { user, isLoading } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && user) {
      if (requireOnboarded && !user.is_onboarded) {
        // Trying to access Agency but not onboarded
        navigate("/onboarding", { replace: true });
      } else if (!requireOnboarded && user.is_onboarded) {
        // Trying to access Onboarding but already onboarded
        navigate("/agency", { replace: true });
      }
    }
  }, [isLoading, user, requireOnboarded, navigate]);

  if (isLoading) {
    return <PageLoader />;
  }

  return <>{children}</>;
};
