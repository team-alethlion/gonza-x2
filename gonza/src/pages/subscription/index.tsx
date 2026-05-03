import React, { useState } from "react";
import { Button, Card, Badge, ToggleSwitch } from "flowbite-react";
import { HiCheck, HiX, HiLightningBolt, HiStar, HiOfficeBuilding } from "react-icons/hi";
import { PLANS } from "./plans";
import type { Plan } from "./plans";
import { useSubscriptionStore } from "../../store/useSubscriptionStore";
import type { BillingCycle } from "../../store/useSubscriptionStore";

const SubscriptionHome = () => {
  const { 
    currentPlanId, 
    status, 
    hasUsedTrial, 
    subscribe, 
    upgrade, 
    reactivate, 
    startTrial 
  } = useSubscriptionStore();
  
  const [isYearly, setIsYearly] = useState(false);

  const getButtonProps = (plan: Plan) => {
    const isCurrentPlan = currentPlanId === plan.id;
    const cycle: BillingCycle = isYearly ? "yearly" : "monthly";

    // 1. None state
    if (status === "none") {
      return (
        <div className="flex flex-col gap-2">
          <Button 
            color="primary"
            onClick={() => subscribe(plan.id, cycle)}
          >
            Subscribe Now
          </Button>
          {plan.hasTrial && !hasUsedTrial && (
            <Button color="secondary" onClick={() => startTrial(plan.id)}>
              Start 7-day Free Trial
            </Button>
          )}
        </div>
      );
    }

    // 2. Active state
    if (status === "active") {
      if (isCurrentPlan) {
        return (
          <Button color="gray" disabled className="cursor-not-allowed">
            Current Plan
          </Button>
        );
      }
      
      // Upgrade logic (simply assuming any higher plan or different plan is an upgrade for now)
      // Standard -> Premium -> Enterprise
      const planOrder = ["standard", "premium", "enterprise"];
      const currentIdx = planOrder.indexOf(currentPlanId || "");
      const targetIdx = planOrder.indexOf(plan.id);

      if (targetIdx > currentIdx) {
        return (
          <Button color="secondary" onClick={() => upgrade(plan.id)}>
            <HiLightningBolt className="mr-2 h-5 w-5" />
            Upgrade Plan
          </Button>
        );
      }
      
      return (
        <Button color="primary" onClick={() => subscribe(plan.id, cycle)}>
          Switch to this Plan
        </Button>
      );
    }

    // 3. Expired state
    if (status === "expired") {
      if (isCurrentPlan) {
        return (
          <Button color="failure" onClick={() => reactivate()}>
            Reactivate Plan
          </Button>
        );
      }
      return (
        <Button 
          color="primary"
          onClick={() => subscribe(plan.id, cycle)}
        >
          Subscribe
        </Button>
      );
    }

    return null;
  };

  const getPlanIcon = (planId: string) => {
    switch (planId) {
      case "standard": return <HiLightningBolt className="h-8 w-8 text-[#252861] dark:text-[#80ced7]" />;
      case "premium": return <HiStar className="h-8 w-8 text-[#f05a2b]" />;
      case "enterprise": return <HiOfficeBuilding className="h-8 w-8 text-[#252861] dark:text-[#80ced7]" />;
      default: return null;
    }
  };

  return (
    <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
      <div className="mx-auto max-w-screen-md text-center mb-8 lg:mb-12">
        <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
          Choose Your Agency Plan
        </h2>
        <p className="mb-5 font-light text-gray-500 sm:text-xl dark:text-gray-400">
          Scale your inventory management with professional tools designed for growth.
        </p>
        
        {status !== "none" && (
          <div className="mb-8">
            <Badge color={status === "active" ? "success" : "failure"} size="lg" className="inline-flex items-center px-4 py-2">
              {status === "active" ? "Active Subscription" : "Subscription Expired"}
            </Badge>
          </div>
        )}

        <div className="flex justify-center items-center gap-4 mb-8">
          <span className={`text-sm ${!isYearly ? 'font-bold text-gray-900 dark:text-white' : 'text-gray-500'}`}>Monthly</span>
          <ToggleSwitch checked={isYearly} onChange={setIsYearly} />
          <span className={`text-sm ${isYearly ? 'font-bold text-gray-900 dark:text-white' : 'text-gray-500'}`}>
            Yearly <Badge color="success" className="ml-2">Save ~10%</Badge>
          </span>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-6 lg:gap-10">
        {PLANS.map((plan) => (
          <Card key={plan.id} className={`max-w-sm w-full flex flex-col ${currentPlanId === plan.id ? 'ring-2 ring-[#252861] dark:ring-[#80ced7]' : ''}`}>
            <h5 className="mb-4 text-xl font-medium text-gray-500 dark:text-gray-400">
              {plan.name}
            </h5>
            <div className="flex justify-center mb-4">
              {getPlanIcon(plan.id)}
            </div>
            <div className="flex items-baseline text-gray-900 dark:text-white">
              <span className="text-3xl font-semibold">UGX</span>
              <span className="text-5xl font-extrabold tracking-tight">
                {isYearly
                  ? (plan.priceYear / 1000).toLocaleString()
                  : (plan.priceMonth / 1000).toLocaleString()}
              </span>
              <span className="ml-1 text-4xl font-bold">K</span>
              <span className="ml-1 text-xl font-normal text-gray-500 dark:text-gray-400">
                /{isYearly ? "year" : "month"}
              </span>
            </div>
            
            <ul className="my-7 space-y-5 flex-1">
              <li className="flex space-x-3">
                <svg
                  className="h-5 w-5 shrink-0 text-[#252861] dark:text-[#80ced7]"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-base font-normal leading-tight text-gray-500 dark:text-gray-400">
                  {plan.limits.users === "unlimited" ? "Unlimited" : plan.limits.users} user profiles
                </span>
              </li>
              <li className="flex space-x-3">
                <svg
                  className="h-5 w-5 shrink-0 text-[#252861] dark:text-[#80ced7]"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-base font-normal leading-tight text-gray-500 dark:text-gray-400">
                  {plan.limits.sales === "unlimited" ? "Unlimited" : plan.limits.sales} sales per month
                </span>
              </li>
              <li className="flex space-x-3">
                <svg
                  className="h-5 w-5 shrink-0 text-[#252861] dark:text-[#80ced7]"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-base font-normal leading-tight text-gray-500 dark:text-gray-400">
                  {plan.limits.products === "unlimited" ? "Unlimited" : plan.limits.products} products
                </span>
              </li>
              <li className="flex space-x-3">
                <svg
                  className="h-5 w-5 shrink-0 text-[#252861] dark:text-[#80ced7]"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-base font-normal leading-tight text-gray-500 dark:text-gray-400">
                  {plan.limits.customers === "unlimited" ? "Unlimited" : plan.limits.customers} new customers
                </span>
              </li>
              {plan.features.map((feature, idx) => (
                <li key={idx} className="flex space-x-3">
                  <svg
                    className="h-5 w-5 shrink-0 text-[#252861] dark:text-[#80ced7]"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-base font-normal leading-tight text-gray-500 dark:text-gray-400">
                    {feature}
                  </span>
                </li>
              ))}
              {/* Optional: Add grayed out features for lower plans if desired */}
              {plan.id === "standard" && (
                <li className="flex space-x-3 line-through decoration-gray-500">
                  <svg
                    className="h-5 w-5 shrink-0 text-gray-400 dark:text-gray-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-base font-normal leading-tight text-gray-500">
                    Priority Support
                  </span>
                </li>
              )}
            </ul>
            
            <div className="mt-6">
              {getButtonProps(plan)}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SubscriptionHome;
