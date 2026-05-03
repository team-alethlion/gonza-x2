import React from "react";
import { HiCheckCircle } from "react-icons/hi";

const MobileAppSection = () => {
  const features = [
    "Record a sale in under 10 seconds",
    "Generate receipts, invoices & quotes instantly",
    "View real-time profit & expense analytics",
    "Works on any Android or iOS device",
  ];

  return (
    <section className="bg-white dark:bg-gray-900 py-16 lg:py-24">
      <div className="max-w-screen-xl px-4 mx-auto lg:grid lg:grid-cols-2 lg:gap-16 items-center">
        {/* Left Side: Content */}
        <div className="text-gray-500 sm:text-lg dark:text-gray-400">
          <h2 className="mb-4 text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            Your entire business, <br />
            <span className="text-[#f05a2b]">in your pocket.</span>
          </h2>
          <p className="mb-8 font-light lg:text-xl">
            The Gonza mobile app puts sales tracking, inventory management, and 
            instant document generation right at your fingertips — whether 
            you're at the office or in the field.
          </p>
          
          <ul role="list" className="pt-8 space-y-5 border-t border-gray-200 dark:border-gray-700">
            {features.map((feature, index) => (
              <li key={index} className="flex space-x-3 items-start">
                <HiCheckCircle className="flex-shrink-0 w-6 h-6 text-[#252861] dark:text-[#80ced7]" />
                <span className="text-base font-medium leading-tight text-gray-900 dark:text-white">
                  {feature}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Right Side: Centered Mockup Image */}
        <div className="mt-12 lg:mt-0 flex justify-center items-center">
          <div className="relative w-full max-w-sm px-8">
            {/* Soft glow background for the transparent image */}
            <div className="absolute inset-0 bg-[#80ced7]/20 blur-3xl rounded-full"></div>
            
            <img
              src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/hero/phone-mockup.png"
              alt="Gonza Mobile App"
              className="relative z-10 w-full h-auto drop-shadow-2xl transition-transform duration-500 hover:scale-105"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default MobileAppSection;
