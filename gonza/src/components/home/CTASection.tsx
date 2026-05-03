import React from "react";
import { Button } from "flowbite-react";
import { HiOutlineUserAdd, HiOutlinePhone } from "react-icons/hi";
import { RouterLink } from "../ui/RouterLink";
import { CONFIG } from "../../config";

const CTASection = () => {
  return (
    <section className="bg-white dark:bg-[#0B1326] py-16 lg:py-24 transition-colors duration-300">
      <div className="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16 lg:px-12">
        <h2 className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-[#252861] md:text-5xl lg:text-6xl dark:text-white">
          Ready to transform <br className="hidden md:block" />
          your business?
        </h2>
        <p className="mb-8 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 xl:px-48 dark:text-gray-400">
          Join hundreds of businesses already running smarter with Gonza Systems.
        </p>
        <div className="flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
          <Button
            as={RouterLink}
            href="/auth/signup"
            size="xl"
            color="primary"
            className="transition-transform hover:scale-105">
            Signup for free
            <HiOutlineUserAdd className="ml-2 h-5 w-5" />
          </Button>
          <Button
            href={`tel:${CONFIG.APP.SUPPORT_PHONE}`}
            size="xl"
            color="secondary"
            className="transition-transform hover:scale-105 border-2">
            <HiOutlinePhone className="mr-2 h-5 w-5" />
            Call Us
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
