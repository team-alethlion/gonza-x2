import React from "react";
import { Outlet } from "react-router-dom";
import { AuthNavbar } from "../ui/AuthNavbar";

const AuthLayout = () => {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-white dark:bg-gray-900">
      {/* Left Side: Image Content */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-purple-700">
        <img
          src="https://images.unsplash.com/photo-1586769852044-692d6e3703f0?q=80&w=1974&auto=format&fit=crop"
          alt="Authentication Background"
          className="absolute inset-0 h-full w-full object-cover opacity-50"
        />
        <div className="relative z-10 flex h-full w-full flex-col justify-between p-12 text-white">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Gonza Inventory</h2>
            <p className="mt-4 text-lg text-purple-100">
              Manage your business across all branches with ease. Real-time tracking,
              financial oversight, and team collaboration in one place.
            </p>
          </div>
          <div className="mt-auto">
            <blockquote className="space-y-2">
              <p className="text-lg font-medium italic">
                "This system transformed how we handle our multi-branch inventory. 
                The oversight we have now is exactly what we were missing."
              </p>
              <footer className="text-sm">Owner, Main Branch</footer>
            </blockquote>
          </div>
        </div>
      </div>

      {/* Right Side: Navigation and Form */}
      <div className="flex w-full flex-col lg:w-1/2">
        <header className="flex-none p-4">
          <AuthNavbar />
        </header>
        <main className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="flex min-h-full flex-col items-center justify-center p-6 sm:p-12">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AuthLayout;
