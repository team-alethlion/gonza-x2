import React from "react";
import { Button } from "flowbite-react";
import {
  HiOutlineUserAdd,
  HiOutlineLogin,
  HiOutlineArrowRight,
} from "react-icons/hi";
import { RouterLink } from "../ui/RouterLink";
import { useAuthStore } from "../../store/useAuthStore";

const HeroCentered = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16 lg:px-12">
        {/* Badge/Announcement (Optional but looks professional) */}
        <div
          className="inline-flex justify-between items-center py-1 px-1 pr-4 mb-7 text-sm text-gray-700 bg-[#ededf8] rounded-full dark:bg-[#1c1e4a] dark:text-white hover:bg-gray-200 dark:hover:bg-[#252861]"
          role="alert">
          <span className="text-xs bg-[#252861] rounded-full text-white px-4 py-1.5 mr-3 dark:bg-[#464cb9]">
            New
          </span>
          <span className="text-sm font-medium">
            Built for African businesses
          </span>
          <svg
            className="ml-2 w-5 h-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg">
            <path
              fillRule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 -1.414 0z"
              clipRule="evenodd"></path>
          </svg>
        </div>

        <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
          Business management <br className="hidden md:block" />
          at the <span className="text-[#9b87f5]">speed of light</span>.
        </h1>

        <p className="mb-8 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 xl:px-48 dark:text-gray-400">
          Track sales, profits & expenses. Generate receipts, invoices & quotes
          — from one powerful, cloud-based platform designed for how you work.
        </p>

        <div className="flex flex-col mb-8 lg:mb-16 space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
          {isAuthenticated ? (
            <Button as={RouterLink} href="/agency" size="xl" color="primary">
              Go to Dashboard
              <HiOutlineArrowRight className="ml-2 h-5 w-5" />
            </Button>
          ) : (
            <>
              <Button as={RouterLink} href="/auth/signup" size="xl" color="primary">
                Signup for free
                <HiOutlineUserAdd className="ml-2 h-5 w-5" />
              </Button>
              <Button as={RouterLink} href="/auth/login" size="xl" color="secondary">
                <HiOutlineLogin className="mr-2 h-5 w-5" />
                Sign in
              </Button>
            </>
          )}
        </div>
        <div>No credit card required · Cloud-based · Instant setup</div>
      </div>
    </section>
  );
};

export default HeroCentered;
