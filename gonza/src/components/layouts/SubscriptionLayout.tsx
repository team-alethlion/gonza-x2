import React from "react";
import { Outlet } from "react-router-dom";
import { SubscriptionNavbar } from "../ui/SubscriptionNavbar";

const SubscriptionLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <SubscriptionNavbar />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default SubscriptionLayout;
