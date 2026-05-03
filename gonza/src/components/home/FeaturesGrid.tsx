import React from "react";
import {
  HiOutlineCurrencyDollar,
  HiOutlineDocumentText,
  HiOutlinePresentationChartLine,
  HiOutlineUsers,
  HiOutlineCube,
  HiOutlineCloudUpload,
  HiOutlineTrendingDown,
  HiOutlineShieldCheck,
  HiOutlineDocumentDownload,
} from "react-icons/hi";

const features = [
  {
    title: "Sales & Receipts",
    desc: "Record every transaction and generate professional receipts instantly — no paperwork.",
    icon: HiOutlineCurrencyDollar,
  },
  {
    title: "Invoices & Quotes",
    desc: "Send polished invoices and quotations to clients in a few taps.",
    icon: HiOutlineDocumentText,
  },
  {
    title: "Profit Analytics",
    desc: "Crystal-clear financial insights with real-time charts and reports.",
    icon: HiOutlinePresentationChartLine,
  },
  {
    title: "Customer Management",
    desc: "Rich customer profiles, purchase history, and relationship tracking.",
    icon: HiOutlineUsers,
  },
  {
    title: "Inventory Control",
    desc: "Monitor stock levels, get low-stock alerts, and avoid over-ordering.",
    icon: HiOutlineCube,
  },
  {
    title: "Cloud-Based Access",
    desc: "Your data secure in the cloud — accessible from any device, anywhere.",
    icon: HiOutlineCloudUpload,
  },
  {
    title: "Expense Tracking",
    desc: "Log expenses with categories and understand where your money goes.",
    icon: HiOutlineTrendingDown,
  },
  {
    title: "Enterprise Security",
    desc: "Encrypted data storage with role-based access control for your team.",
    icon: HiOutlineShieldCheck,
  },
  {
    title: "Instant Documents",
    desc: "PDF receipts, invoices, and quotes in one tap — share via WhatsApp or email.",
    icon: HiOutlineDocumentDownload,
  },
];

const FeaturesGrid = () => {
  return (
    <section className="bg-[#F1F0FB] dark:bg-[#0B1326] py-16 lg:py-24 transition-colors duration-300">
      <div className="max-w-screen-xl px-4 mx-auto">
        <div className="max-w-screen-md mb-8 lg:mb-16">
          <h2 className="mb-4 text-4xl font-extrabold tracking-tight text-[#0B1326] dark:text-white">
            Everything you need. <br />
            <span className="text-[#f05a2b]">Nothing you don't.</span>
          </h2>
          <p className="text-gray-600 dark:text-[#dadbf1]/80 sm:text-xl">
            A complete business management platform built for the pace of
            African commerce.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 -space-x-px -space-y-px overflow-hidden rounded-2xl border border-gray-200 dark:border-white/10 shadow-2xl">
          {features.map((feature, index) => {
            return (
              <div
                key={index}
                className="relative p-8 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 transition-all duration-300 hover:z-10 hover:shadow-2xl hover:bg-gray-50 dark:hover:bg-white/10 group">
                <div className="flex justify-center items-center mb-4 w-12 h-12 rounded-lg bg-[#F1F0FB] dark:bg-white/10 text-[#0B1326] dark:text-[#9b87f5] group-hover:bg-[#f05a2b] group-hover:text-white dark:group-hover:bg-[#9b87f5] dark:group-hover:text-[#0B1326] transition-colors duration-300">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="mb-2 text-xl font-bold text-[#0B1326] dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-500 dark:text-[#dadbf1]/60 font-light leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesGrid;
