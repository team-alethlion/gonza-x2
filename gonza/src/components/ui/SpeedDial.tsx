import React, { useState } from "react";
import { Button, Tooltip } from "flowbite-react";
import { 
  HiPlus, 
  HiCurrencyDollar, 
  HiCreditCard, 
  HiCube, 
  HiUsers, 
  HiTrendingDown 
} from "react-icons/hi";

const SpeedDial = () => {
  const [isOpen, setIsOpen] = useState(false);

  const actions = [
    { icon: HiCurrencyDollar, label: "Create Sale", onClick: () => console.log("Create Sale clicked") },
    { icon: HiCreditCard, label: "Create Installment Sale", onClick: () => console.log("Installment Sale clicked") },
    { icon: HiCube, label: "Add Product", onClick: () => console.log("Add Product clicked") },
    { icon: HiUsers, label: "Add Customer", onClick: () => console.log("Add Customer clicked") },
    { icon: HiTrendingDown, label: "Add Expense", onClick: () => console.log("Add Expense clicked") },
  ];

  return (
    <div className="fixed end-6 bottom-6 group z-50">
      {/* Speed Dial Menu */}
      <div
        className={`flex flex-col items-center mb-4 space-y-2 transition-all duration-300 ${
          isOpen ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-10 scale-0 pointer-events-none"
        }`}
      >
        {actions.map((action, index) => (
          <Tooltip key={index} content={action.label} placement="left">
            <button
              type="button"
              onClick={() => {
                action.onClick();
                setIsOpen(false);
              }}
              className="flex justify-center items-center w-12 h-12 text-brand-primary bg-brand-soft hover:bg-space-indigo-100 dark:bg-space-indigo-800 dark:text-brand-accent dark:hover:bg-space-indigo-700 rounded-full border border-gray-200 dark:border-white/5 shadow-sm transition-colors duration-200 focus:ring-4 focus:ring-brand-primary/20 focus:outline-none"
            >
              <action.icon className="w-5 h-5" />
              <span className="sr-only">{action.label}</span>
            </button>
          </Tooltip>
        ))}
      </div>

      {/* Main Toggle Button */}
      <Button
        pill
        size="xl"
        color="primary"
        onClick={() => setIsOpen(!isOpen)}
        className="!p-0 w-14 h-14 flex items-center justify-center shadow-lg transition-all duration-300"
      >
        <HiPlus
          className={`w-7 h-7 transition-transform duration-300 ${
            isOpen ? "rotate-45" : "rotate-0"
          }`}
        />
        <span className="sr-only">Open actions menu</span>
      </Button>
    </div>
  );
};

export default SpeedDial;


