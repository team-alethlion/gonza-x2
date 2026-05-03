import React, { useState, useEffect } from "react";
import { Button, Card, Badge, ToggleSwitch, Alert } from "flowbite-react";
import { HiCheck, HiLightningBolt } from "react-icons/hi";
import {
  useSubscriptionStore,
  useSubscription,
} from "../../store/useSubscriptionStore";
import type { BillingCycle, Package } from "../../store/useSubscriptionStore";
import { useAuthStore } from "../../store/useAuthStore";
import { useNavigate, useLocation } from "react-router-dom";
import { PageLoader } from "../../components/ui/Loader";
import { CONFIG } from "../../config";
import { NumberFormatter } from "../../utils/formatters";

const SubscriptionHome = () => {
  const {
    packages,
    isLoading,
    fetchPackages,
    subscribe,
    upgrade,
    reactivate,
    startTrial,
  } = useSubscriptionStore();

  const { currentPlanId, status, hasUsedTrial, daysLeft } = useSubscription();
  const { isAuthenticated, user } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const [isYearly, setIsYearly] = useState(false);

  useEffect(() => {
    fetchPackages();
  }, [fetchPackages]);

  // Redirect if subscription is active/trial
  useEffect(() => {
    if (status === "active" || status === "trial") {
      const target = user?.is_onboarded ? "/agency" : "/onboarding";
      navigate(target, { replace: true });
    }
  }, [status, user?.is_onboarded, navigate]);

  const handleAction = (action: () => Promise<void>) => {
    if (!isAuthenticated) {
      navigate("/auth/login", { state: { from: location } });
      return;
    }
    action();
  };

  const getButtonProps = (plan: Package) => {
    const isCurrentPlan = currentPlanId === plan.id;
    const cycle: BillingCycle = isYearly ? "yearly" : "monthly";
    const hasExistingSubscription = status !== "none";

    // Find current plan details to determine if target is an upgrade
    const currentPlan = packages.find((p) => p.id === currentPlanId);
    const isUpgrade = currentPlan
      ? Number(plan.monthly_price) > Number(currentPlan.monthly_price)
      : false;

    const trialButton = plan.has_free_trial && !hasUsedTrial && (
      <Button
        color="light"
        size="lg"
        className="w-full border-2 border-gray-200 dark:border-gray-700"
        onClick={() => handleAction(() => startTrial(plan.id))}>
        Start {plan.trial_days}-day Free Trial
      </Button>
    );

    // 1. Handle Active/Trial status for the Current Plan
    if (isCurrentPlan && (status === "active" || status === "trial")) {
      return (
        <Button color="gray" disabled className="w-full cursor-not-allowed">
          Current Plan {status === "trial" && "(Trial)"}
        </Button>
      );
    }

    // 2. Handle Expired/Suspended status for the Current Plan
    if (isCurrentPlan && (status === "expired" || status === "suspended")) {
      return (
        <div className="flex flex-col gap-3">
          <Button
            color={status === "expired" ? "failure" : "warning"}
            size="lg"
            className="w-full"
            onClick={() => handleAction(() => reactivate())}>
            {status === "expired" ? "Reactivate Plan" : "Resolve Suspension"}
          </Button>
          {trialButton}
        </div>
      );
    }

    // 3. General Action: Subscribe or Upgrade
    const actionLabel =
      hasExistingSubscription && isUpgrade ? "Upgrade" : "Subscribe";
    const actionColor =
      hasExistingSubscription && isUpgrade ? "secondary" : "primary";

    return (
      <div className="flex flex-col gap-3">
        <Button
          color={actionColor}
          size="lg"
          className="w-full"
          onClick={() => handleAction(() => subscribe(plan.id, cycle))}>
          {actionLabel}
        </Button>
        {trialButton}
      </div>
    );
  };

  if (isLoading) return <PageLoader />;

  return (
    <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6 transition-colors duration-300">
      <div className="mx-auto max-w-screen-md text-center mb-12 lg:mb-16">
        <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-brand-primary dark:text-white sm:text-5xl">
          Choose Your Agency Plan
        </h2>
        <p className="mb-8 font-light text-gray-500 sm:text-xl dark:text-gray-400 max-w-2xl mx-auto">
          Scale your inventory management with professional tools designed for
          the modern African entrepreneur.
        </p>

        {useSubscriptionStore.getState().error && (
          <Alert color="failure" className="mb-8">
            <span className="font-medium">Error loading plans:</span>{" "}
            {useSubscriptionStore.getState().error}
          </Alert>
        )}

        {status !== "none" && (
          <div className="mb-10 flex flex-col items-center gap-2">
            <Badge
              color={
                status === "active" || status === "trial"
                  ? "success"
                  : status === "suspended"
                  ? "warning"
                  : "failure"
              }
              size="lg"
              className="inline-flex items-center px-6 py-2.5 rounded-full font-bold uppercase tracking-wider">
              {status === "active" && "Active Subscription"}
              {status === "trial" && "Free Trial Active"}
              {status === "expired" && "Subscription Expired"}
              {status === "suspended" && "Agency Suspended"}
            </Badge>
            {(status === "active" || status === "trial") && (
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {daysLeft} days remaining in your{" "}
                {status === "trial" ? "trial" : "plan"}
              </p>
            )}
          </div>
        )}

        {packages.length > 0 && (
          <div className="flex justify-center items-center gap-6 p-4 rounded-2xl bg-gray-50 dark:bg-white/5 inline-flex mx-auto">
            <span
              className={`text-sm font-semibold ${
                !isYearly
                  ? "text-brand-primary dark:text-brand-accent"
                  : "text-gray-500"
              }`}>
              Monthly
            </span>
            <ToggleSwitch
              checked={isYearly}
              onChange={setIsYearly}
              color="primary"
            />
            <span
              className={`text-sm font-semibold ${
                isYearly
                  ? "text-brand-primary dark:text-brand-accent"
                  : "text-gray-500"
              }`}>
              Yearly{" "}
              <Badge color="success" className="ml-2">
                Save ~10%
              </Badge>
            </span>
          </div>
        )}
      </div>

      {packages.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 dark:bg-white/5 rounded-3xl border-2 border-dashed border-gray-200 dark:border-white/10 max-w-2xl mx-auto">
          <HiLightningBolt className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-2xl font-bold text-gray-600 dark:text-gray-300">
            No plans available right now
          </h3>
          <p className="text-gray-500 mt-2">
            Please check back later or contact support.
          </p>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-3 max-w-6xl mx-auto">
          {packages.map((plan) => (
            <Card
              key={plan.id}
              className={`flex flex-col relative transition-all duration-300 hover:shadow-xl dark:bg-white/5 border-gray-100 dark:border-white/10 ${
                currentPlanId === plan.id
                  ? "ring-2 ring-brand-secondary scale-105 z-10"
                  : ""
              }`}>
              {currentPlanId === plan.id && (
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-brand-secondary text-white text-xs font-bold px-4 py-1 rounded-full uppercase">
                  Active Plan
                </span>
              )}
              <div className="mb-6">
                <h5 className="mb-2 text-2xl font-bold text-brand-primary dark:text-white">
                  {plan.name}
                </h5>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  {plan.description}
                </p>
              </div>

              <div className="flex items-baseline text-brand-primary dark:text-white">
                <span className="text-2xl font-semibold">UGX</span>
                <span className="text-6xl font-black tracking-tight mx-1">
                  {NumberFormatter.minimize(isYearly ? plan.yearly_price : plan.monthly_price).replace(/[A-Z]/g, '')}
                </span>
                <span className="text-4xl font-bold">
                  {NumberFormatter.minimize(isYearly ? plan.yearly_price : plan.monthly_price).replace(/[0-9.]/g, '')}
                </span>
                <span className="ml-1 text-xl font-normal text-gray-500 dark:text-gray-400">
                  /{isYearly ? "year" : "month"}
                </span>
              </div>

              <ul className="my-10 space-y-4 flex-1">
                <li className="flex items-center space-x-3">
                  <HiCheck className="h-5 w-5 shrink-0 text-brand-secondary" />
                  <span className="text-base font-normal text-gray-600 dark:text-gray-300">
                    <strong className="text-gray-900 dark:text-white font-bold">
                      {plan.unlimited_users ? "Unlimited" : plan.max_users}
                    </strong>{" "}
                    user profiles
                  </span>
                </li>
                <li className="flex items-center space-x-3">
                  <HiCheck className="h-5 w-5 shrink-0 text-brand-secondary" />
                  <span className="text-base font-normal text-gray-600 dark:text-gray-300">
                    <strong className="text-gray-900 dark:text-white font-bold">
                      {plan.unlimited_sales
                        ? "Unlimited"
                        : plan.max_sales_per_month}
                    </strong>{" "}
                    monthly sales
                  </span>
                </li>
                <li className="flex items-center space-x-3">
                  <HiCheck className="h-5 w-5 shrink-0 text-brand-secondary" />
                  <span className="text-base font-normal text-gray-600 dark:text-gray-300">
                    <strong className="text-gray-900 dark:text-white font-bold">
                      {plan.unlimited_products
                        ? "Unlimited"
                        : plan.max_products}
                    </strong>{" "}
                    inventory items
                  </span>
                </li>
                {/* Handle features as either an array or an object */}
                {Array.isArray(plan.features)
                  ? plan.features.map((feature: string, idx: number) => (
                      <li key={idx} className="flex items-center space-x-3">
                        <HiCheck className="h-5 w-5 shrink-0 text-brand-secondary" />
                        <span className="text-base font-normal text-gray-600 dark:text-gray-300">
                          {feature}
                        </span>
                      </li>
                    ))
                  : typeof plan.features === "object" && plan.features !== null
                  ? Object.entries(plan.features).map(([key, value], idx) => (
                      <li key={idx} className="flex items-center space-x-3">
                        <HiCheck className="h-5 w-5 shrink-0 text-brand-secondary" />
                        <span className="text-base font-normal text-gray-600 dark:text-gray-300">
                          <strong>{key}:</strong> {String(value)}
                        </span>
                      </li>
                    ))
                  : null}
              </ul>

              <div className="mt-2 pt-6 border-t border-gray-100 dark:border-white/5">
                {getButtonProps(plan)}
              </div>
            </Card>
          ))}
        </div>
      )}

      <div className="mt-16 text-center">
        <p className="text-gray-500 dark:text-gray-400">
          Need a custom solution?{" "}
          <a
            href={`mailto:${CONFIG.APP.SUPPORT_EMAIL}`}
            className="text-brand-secondary font-bold hover:underline">
            Contact our sales team
          </a>
        </p>
      </div>
    </div>
  );
};

export default SubscriptionHome;
