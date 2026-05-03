import React, { useState } from "react";
import { Button, Card, Badge, ToggleSwitch } from "flowbite-react";
import { HiCheck, HiLightningBolt } from "react-icons/hi";
import { PLANS } from "./plans";
import type { Plan } from "./plans";
import { useSubscriptionStore, useSubscription } from "../../store/useSubscriptionStore";
import type { BillingCycle } from "../../store/useSubscriptionStore";
import { useAuthStore } from "../../store/useAuthStore";
import { useNavigate, useLocation } from "react-router-dom";

const SubscriptionHome = () => {
  const { 
    subscribe, 
    upgrade, 
    reactivate, 
    startTrial 
  } = useSubscriptionStore();
  
  const { currentPlanId, status, hasUsedTrial, daysLeft } = useSubscription();
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [isYearly, setIsYearly] = useState(false);

  const handleAction = (action: () => Promise<void>) => {
    if (!isAuthenticated) {
      navigate("/auth/login", { state: { from: location } });
      return;
    }
    action();
  };

  const getButtonProps = (plan: Plan) => {
    const isCurrentPlan = currentPlanId === plan.id;
    const cycle: BillingCycle = isYearly ? "yearly" : "monthly";

    // 1. Not Authenticated or No Subscription
    if (!isAuthenticated || status === "none") {
      return (
        <div className="flex flex-col gap-3">
          <Button 
            color="primary"
            size="lg"
            className="w-full"
            onClick={() => handleAction(() => subscribe(plan.id, cycle))}
          >
            Subscribe Now
          </Button>
          {plan.hasTrial && !hasUsedTrial && (
            <Button 
              color="light" 
              size="lg"
              className="w-full border-2 border-gray-200 dark:border-gray-700"
              onClick={() => handleAction(() => startTrial(plan.id))}
            >
              Start 7-day Free Trial
            </Button>
          )}
        </div>
      );
    }

    // 2. Active state (includes 'trial' status)
    if (status === "active" || status === "trial") {
      if (isCurrentPlan) {
        return (
          <Button color="gray" disabled className="w-full cursor-not-allowed">
            Current Plan {status === 'trial' && '(Trial)'}
          </Button>
        );
      }
      
      const planOrder = ["standard", "premium", "enterprise"];
      const currentIdx = planOrder.indexOf(currentPlanId || "");
      const targetIdx = planOrder.indexOf(plan.id);

      if (targetIdx > currentIdx) {
        return (
          <Button color="secondary" size="lg" className="w-full" onClick={() => handleAction(() => upgrade(plan.id))}>
            <HiLightningBolt className="mr-2 h-5 w-5" />
            Upgrade Plan
          </Button>
        );
      }
      
      return (
        <Button color="primary" size="lg" className="w-full" onClick={() => handleAction(() => subscribe(plan.id, cycle))}>
          Switch to this Plan
        </Button>
      );
    }

    // 3. Expired state
    if (status === "expired") {
      if (isCurrentPlan) {
        return (
          <Button color="failure" size="lg" className="w-full" onClick={() => handleAction(() => reactivate())}>
            Reactivate Plan
          </Button>
        );
      }
      return (
        <Button 
          color="primary"
          size="lg"
          className="w-full"
          onClick={() => handleAction(() => subscribe(plan.id, cycle))}
        >
          Subscribe
        </Button>
      );
    }

    return null;
  };

  return (
    <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6 transition-colors duration-300">
      <div className="mx-auto max-w-screen-md text-center mb-12 lg:mb-16">
        <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-[#252861] dark:text-white sm:text-5xl">
          Choose Your Agency Plan
        </h2>
        <p className="mb-8 font-light text-gray-500 sm:text-xl dark:text-gray-400 max-w-2xl mx-auto">
          Scale your inventory management with professional tools designed for the modern African entrepreneur.
        </p>
        
        {status !== "none" && (
          <div className="mb-10 flex flex-col items-center gap-2">
            <Badge 
              color={status === "active" || status === "trial" ? "success" : "failure"} 
              size="lg" 
              className="inline-flex items-center px-6 py-2.5 rounded-full font-bold uppercase tracking-wider"
            >
              {status === "active" && "Active Subscription"}
              {status === "trial" && "Free Trial Active"}
              {status === "expired" && "Subscription Expired"}
            </Badge>
            {(status === "active" || status === "trial") && (
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {daysLeft} days remaining in your {status === 'trial' ? 'trial' : 'plan'}
              </p>
            )}
          </div>
        )}

        <div className="flex justify-center items-center gap-6 p-4 rounded-2xl bg-gray-50 dark:bg-white/5 inline-flex mx-auto">
          <span className={`text-sm font-semibold ${!isYearly ? 'text-[#252861] dark:text-[#9b87f5]' : 'text-gray-500'}`}>Monthly</span>
          <ToggleSwitch checked={isYearly} onChange={setIsYearly} color="primary" />
          <span className={`text-sm font-semibold ${isYearly ? 'text-[#252861] dark:text-[#9b87f5]' : 'text-gray-500'}`}>
            Yearly <Badge color="success" className="ml-2">Save ~10%</Badge>
          </span>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3 max-w-6xl mx-auto">
        {PLANS.map((plan) => (
          <Card 
            key={plan.id} 
            className={`flex flex-col relative transition-all duration-300 hover:shadow-xl dark:bg-white/5 border-gray-100 dark:border-white/10 ${
              currentPlanId === plan.id ? 'ring-2 ring-[#f05a2b] scale-105 z-10' : ''
            }`}
          >
            {currentPlanId === plan.id && (
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#f05a2b] text-white text-xs font-bold px-4 py-1 rounded-full uppercase">
                Active Plan
              </span>
            )}
            <div className="mb-6">
              <h5 className="mb-2 text-2xl font-bold text-[#252861] dark:text-white">
                {plan.name}
              </h5>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Perfect for {plan.id === 'enterprise' ? 'large scale operations' : 'growing businesses'}
              </p>
            </div>
            
            <div className="flex items-baseline text-[#252861] dark:text-white">
              <span className="text-2xl font-semibold">UGX</span>
              <span className="text-6xl font-black tracking-tight mx-1">
                {isYearly
                  ? (plan.priceYear / 1000).toLocaleString()
                  : (plan.priceMonth / 1000).toLocaleString()}
              </span>
              <span className="text-4xl font-bold">K</span>
              <span className="ml-1 text-xl font-normal text-gray-500 dark:text-gray-400">
                /{isYearly ? "year" : "month"}
              </span>
            </div>
            
            <ul className="my-10 space-y-4 flex-1">
              <li className="flex items-center space-x-3">
                <HiCheck className="h-5 w-5 shrink-0 text-[#f05a2b]" />
                <span className="text-base font-normal text-gray-600 dark:text-gray-300">
                  <strong className="text-gray-900 dark:text-white font-bold">{plan.limits.users === "unlimited" ? "Unlimited" : plan.limits.users}</strong> user profiles
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <HiCheck className="h-5 w-5 shrink-0 text-[#f05a2b]" />
                <span className="text-base font-normal text-gray-600 dark:text-gray-300">
                  <strong className="text-gray-900 dark:text-white font-bold">{plan.limits.sales === "unlimited" ? "Unlimited" : plan.limits.sales}</strong> monthly sales
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <HiCheck className="h-5 w-5 shrink-0 text-[#f05a2b]" />
                <span className="text-base font-normal text-gray-600 dark:text-gray-300">
                  <strong className="text-gray-900 dark:text-white font-bold">{plan.limits.products === "unlimited" ? "Unlimited" : plan.limits.products}</strong> inventory items
                </span>
              </li>
              {plan.features.map((feature, idx) => (
                <li key={idx} className="flex items-center space-x-3">
                  <HiCheck className="h-5 w-5 shrink-0 text-[#f05a2b]" />
                  <span className="text-base font-normal text-gray-600 dark:text-gray-300">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>
            
            <div className="mt-2 pt-6 border-t border-gray-100 dark:border-white/5">
              {getButtonProps(plan)}
            </div>
          </Card>
        ))}
      </div>
      
      <div className="mt-16 text-center">
        <p className="text-gray-500 dark:text-gray-400">
          Need a custom solution? <a href="mailto:gonzasystems@gmail.com" className="text-[#f05a2b] font-bold hover:underline">Contact our sales team</a>
        </p>
      </div>
    </div>
  );
};

export default SubscriptionHome;
