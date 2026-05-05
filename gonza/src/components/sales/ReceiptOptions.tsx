import { Checkbox, Label } from "flowbite-react";
import React from "react";
import { useFormContext } from "react-hook-form";
import type { NewSaleFormData } from "../../types/sale";

const ReceiptOptions = () => {
  const { register } = useFormContext<NewSaleFormData>();

  return (
    <div className="bg-white/40 dark:bg-white/[0.03] backdrop-blur-md border border-gray-200/50 dark:border-white/[0.05] rounded-sm p-4 shadow-xl mb-6 space-y-3">
      <div className="flex items-center gap-2">
        <Checkbox 
          id="show-receipt" 
          {...register("receiptOptions.showReceipt")}
          className="text-brand-primary focus:ring-brand-primary dark:border-white/10 dark:bg-white/5 dark:focus:ring-brand-primary dark:focus:ring-offset-gray-800" 
        />
        <Label htmlFor="show-receipt" className="flex text-sm font-medium text-gray-900 dark:text-gray-300">
          Show receipt after creating Sale
        </Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox 
          id="send-email" 
          {...register("receiptOptions.sendEmail")}
          className="text-brand-primary focus:ring-brand-primary dark:border-white/10 dark:bg-white/5 dark:focus:ring-brand-primary dark:focus:ring-offset-gray-800" 
        />
        <Label htmlFor="send-email" className="flex text-sm font-medium text-gray-900 dark:text-gray-300">
          Send thank you email
        </Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox 
          id="include-payment" 
          {...register("receiptOptions.includePayment")}
          className="text-brand-primary focus:ring-brand-primary dark:border-white/10 dark:bg-white/5 dark:focus:ring-brand-primary dark:focus:ring-offset-gray-800" 
        />
        <Label htmlFor="include-payment" className="flex text-sm font-medium text-gray-900 dark:text-gray-300">
          Include payment information
        </Label>
      </div>
    </div>
  );
};

export default ReceiptOptions;
