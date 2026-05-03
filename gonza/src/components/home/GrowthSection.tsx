import React from "react";
import {
  HiLightningBolt,
  HiPresentationChartLine,
  HiShieldCheck,
  HiSupport,
} from "react-icons/hi";

const GrowthSection = () => {
  const points = [
    {
      title: "Intuitive",
      desc: "Zero training required, start in minutes.",
      icon: HiLightningBolt,
    },
    {
      title: "Smart Analytics",
      desc: "Surface insights automatically to drive decisions.",
      icon: HiPresentationChartLine,
    },
    {
      title: "Bank-Grade Security",
      desc: "Encrypted data storage keeps your business safe.",
      icon: HiShieldCheck,
    },
    {
      title: "Local Support",
      desc: "Dedicated support team based in your timezone.",
      icon: HiSupport,
    },
  ];

  return (
    <section className="bg-white dark:bg-[#0B1326] py-16 lg:py-24 overflow-hidden">
      <div className="max-w-screen-xl px-4 mx-auto lg:grid lg:grid-cols-2 lg:gap-16 items-center">
        {/* Left Side: MacBook Chrome Window Mockup */}
        <div className="relative mb-12 lg:mb-0">
          {/* Decorative glow behind laptop */}
          <div className="absolute -left-20 -top-20 w-64 h-64 bg-[#9b87f5]/20 blur-3xl rounded-full"></div>

          <div className="relative mx-auto border-gray-800 dark:border-gray-800 bg-gray-800 border-[6px] md:border-[10px] rounded-t-xl h-[180px] max-w-[300px] md:h-[350px] md:max-w-[600px] shadow-2xl">
            <div className="rounded-lg overflow-hidden h-full bg-white dark:bg-gray-900 flex flex-col">
              {/* Chrome-style Tab Bar */}
              <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 px-3 py-2 border-b border-gray-200 dark:border-gray-700">
                <div className="flex space-x-1.5">
                  <div className="w-2 h-2 rounded-full bg-red-400"></div>
                  <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                  <div className="w-2 h-2 rounded-full bg-green-400"></div>
                </div>
                <div className="flex-1 max-w-sm px-2">
                  <div className="bg-white dark:bg-gray-700 rounded-sm px-2 py-0.5 text-[8px] md:text-[10px] text-gray-400 border border-gray-200 dark:border-gray-600 truncate">
                    gonzasystems.com/dashboard
                  </div>
                </div>
              </div>

              {/* Screen Content */}
              <div className="flex-1 bg-gray-50 dark:bg-gray-800 relative">
                <img
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop"
                  alt="Dashboard View"
                  className="absolute inset-0 w-full h-full object-cover object-top"
                />
              </div>
            </div>
          </div>
          {/* Laptop Base */}
          <div className="relative mx-auto bg-gray-900 dark:bg-gray-700 rounded-b-xl rounded-t-sm h-[10px] max-w-[340px] md:h-[18px] md:max-w-[680px]">
            <div className="absolute left-1/2 top-0 -translate-x-1/2 rounded-b-xl w-[40px] h-[3px] md:w-[80px] md:h-[6px] bg-gray-800"></div>
          </div>
        </div>

        {/* Right Side: Content */}
        <div className="text-gray-500 sm:text-lg dark:text-gray-400">
          <h2 className="mb-4 text-4xl font-extrabold tracking-tight text-[#252861] dark:text-white leading-tight">
            Focus on growth. <br />
            <span className="text-[#f05a2b]">We handle the rest.</span>
          </h2>
          <p className="mb-8 font-light lg:text-xl">
            Stop wrestling with spreadsheets. Gonza automates the tedious parts
            of running a business so you can focus on what actually matters —
            your customers and your growth.
          </p>

          <div className="space-y-6">
            {points.map((point, index) => (
              <div key={index} className="flex items-end justify-center gap-4">
                <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-lg bg-[#F1F0FB] dark:bg-[#1c1e4a] text-[#252861] dark:text-[#9b87f5] mt-1">
                  <point.icon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">
                    {point.title} &mdash;{" "}
                    <span className="font-normal text-sm text-gray-500 dark:text-gray-400">
                      {point.desc}
                    </span>
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default GrowthSection;
