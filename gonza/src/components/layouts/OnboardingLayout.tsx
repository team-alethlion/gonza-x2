import React from "react";
import { Outlet } from "react-router-dom";

const OnboardingLayout = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-prussian-blue-900 p-4 gap-8">
      <Outlet />
    </div>
  );
};

export default OnboardingLayout;
