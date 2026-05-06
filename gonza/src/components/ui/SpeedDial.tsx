import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Tooltip } from "flowbite-react";
import { 
  HiPlus, 
  HiCurrencyDollar, 
  HiCreditCard, 
  HiCube, 
  HiUsers, 
  HiTrendingDown,
  HiClipboardList,
  HiDocumentText
} from "react-icons/hi";

const SpeedDial = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const actions = [
    { 
      icon: HiCurrencyDollar, 
      label: "Create Sale", 
      onClick: () => navigate("/agency/sales/new-sale?create=new") 
    },
    { 
      icon: HiDocumentText, 
      label: "Create Invoice", 
      onClick: () => navigate("/agency/sales/new-sale?create=invoice") 
    },
    { 
      icon: HiCreditCard, 
      label: "Installment Sale", 
      onClick: () => navigate("/agency/sales/new-sale?create=installment") 
    },
    { 
      icon: HiClipboardList, 
      label: "Create Quotation", 
      onClick: () => navigate("/agency/sales/new-sale?create=quotation") 
    },
    { 
      icon: HiCube, 
      label: "Inventory", 
      onClick: () => navigate("/agency/inventory/products") 
    },
    { 
      icon: HiUsers, 
      label: "Customers", 
      onClick: () => navigate("/agency/customers/list") 
    },
    { 
      icon: HiTrendingDown, 
      label: "Expenses", 
      onClick: () => navigate("/agency/finance/expenses") 
    },
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
              className="flex justify-center items-center w-12 h-12 text-brand-primary bg-white/40 dark:bg-white/[0.05] backdrop-blur-md hover:bg-white/60 dark:hover:bg-white/10 dark:text-brand-accent rounded-full border border-gray-100/50 dark:border-white/[0.05] shadow-xl transition-all duration-200 focus:ring-4 focus:ring-brand-primary/20 focus:outline-none"
            >
              <action.icon className="w-5 h-5" />
              <span className="sr-only">{action.label}</span>
            </button>
          </Tooltip>
        ))}
      </div>

      {/* Main Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 flex items-center justify-center rounded-full bg-brand-primary/80 dark:bg-brand-primary/40 backdrop-blur-md text-white border border-white/20 shadow-xl transition-all duration-300 hover:bg-brand-primary focus:outline-none focus:ring-4 focus:ring-brand-primary/20"
      >
        <HiPlus
          className={`w-7 h-7 transition-transform duration-300 ${
            isOpen ? "rotate-45" : "rotate-0"
          }`}
        />
        <span className="sr-only">Open actions menu</span>
      </button>
    </div>
  );
};

export default SpeedDial;


