import React from "react";
import { Outlet } from "react-router-dom";
import { PublicNavbar } from "../ui/PublicNavbar";
import { PublicFooter } from "../ui/PublicFooter";

const PublicLayout = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col">
      <PublicNavbar />
      <main className="container mx-auto px-4 py-8 flex-grow">
        <Outlet />
      </main>
      <PublicFooter />
    </div>
  );
};

export default PublicLayout;
