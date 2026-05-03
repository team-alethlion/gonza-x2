import React from "react";
import { Button } from "flowbite-react";
import { HiLockClosed, HiHome, HiSupport } from "react-icons/hi";
import { RouterLink } from "./RouterLink";
import { useAuthStore } from "../../store/useAuthStore";

interface UnauthorizedPageProps {
  type?: "frozen" | "suspended" | "unauthorized";
}

const UnauthorizedPage: React.FC<UnauthorizedPageProps> = ({ type = "unauthorized" }) => {
  const { logout } = useAuthStore();

  const content = {
    frozen: {
      title: "Account Frozen",
      description: "Your account has been frozen by a system administrator. Please contact support to resolve this issue.",
      icon: <HiLockClosed className="w-20 h-20 text-red-600 dark:text-red-500" />,
    },
    suspended: {
      title: "Access Suspended",
      description: "Your access to the system has been suspended. This may be due to a policy violation or administrative action.",
      icon: <HiLockClosed className="w-20 h-20 text-orange-600 dark:text-orange-500" />,
    },
    unauthorized: {
      title: "Unauthorized Access",
      description: "You do not have the necessary permissions to access this page.",
      icon: <HiLockClosed className="w-20 h-20 text-gray-600 dark:text-gray-500" />,
    },
  }[type];

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-8 bg-white dark:bg-space-indigo-800 p-10 rounded-3xl shadow-xl border border-gray-100 dark:border-space-indigo-700">
        <div className="flex justify-center">
          <div className="p-4 bg-gray-50 dark:bg-prussian-blue-900 rounded-full">
            {content.icon}
          </div>
        </div>
        
        <div className="space-y-4">
          <h1 className="text-3xl font-black text-brand-primary dark:text-brand-accent">
            {content.title}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            {content.description}
          </p>
        </div>

        <div className="flex flex-col gap-3 pt-4">
          <Button color="primary" as={RouterLink} href="/" className="font-bold">
            <HiHome className="mr-2 h-5 w-5" /> Return Home
          </Button>
          <Button color="light" onClick={() => logout()} className="font-bold">
            Logout and Switch Account
          </Button>
          <div className="pt-4">
            <a href="mailto:support@gonza.com" className="inline-flex items-center text-sm font-medium text-brand-primary dark:text-brand-accent hover:underline">
              <HiSupport className="mr-2 h-4 w-4" /> Contact Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
