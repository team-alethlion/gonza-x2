import React, { useState } from "react";
import AddCustomer from "../../../components/sales/AddCustomer";
import ProductService from "../../../components/sales/ProductService";
import ReceiptOptions from "../../../components/sales/ReceiptOptions";
import SalePreview from "../../../components/sales/SalePreview";
import { Button } from "flowbite-react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { newSaleSchema } from "../../../types/sale";
import type { NewSaleFormData } from "../../../types/sale";

const NewSale = () => {
  const [showPreview, setShowPreview] = useState(false);

  const methods = useForm<NewSaleFormData>({
    resolver: zodResolver(newSaleSchema),
    defaultValues: {
      date: new Date(),
      customers: [{ name: "", address1: "", contact: "", email: "", address2: "", category: "" }],
      items: [
        {
          id: Math.random().toString(36).substr(2, 9),
          message: "",
          productAppend: "",
          quantity: 1,
          pricePerUnit: 0,
          discountType: "%",
          discountValue: 0,
          costPerUnit: 0,
          itemTotalCost: 0,
        },
      ],
      taxRate: 18,
      subtotal: 0,
      taxAmount: 0,
      grandTotal: 0,
      totalItems: 0,
      receiptOptions: {
        showReceipt: true,
        sendEmail: false,
        includePayment: true,
      }
    },
    mode: "onChange",
  });

  const onSubmit = (data: NewSaleFormData) => {
    console.log("Creating sale with data:", data);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        {/* new save section */}
        <AddCustomer onShowPreview={() => setShowPreview(true)} />
        {/* item/service */}
        <ProductService />
        {/*  */}
        <ReceiptOptions />
        {/* Actions */}
        <div className="flex items-center justify-end gap-4 mt-4 m-0.5">
          <Button
            color="none"
            className="rounded-sm bg-white/40 dark:bg-white/[0.03] backdrop-blur-md border border-gray-200/50 dark:border-white/[0.05] text-gray-700 dark:text-gray-300 hover:bg-white/60 dark:hover:bg-white/10 transition-all shadow-sm">
            Cancel
          </Button>
          <Button
            color="none"
            type="button"
            onClick={() => methods.reset()}
            className="rounded-sm bg-white/40 dark:bg-white/[0.03] backdrop-blur-md border border-rose-500/20 dark:border-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-50/50 dark:hover:bg-rose-900/10 transition-all shadow-sm">
            Clear Form
          </Button>
          <Button
            color="none"
            type="submit"
            className="rounded-sm bg-brand-primary/80 dark:bg-brand-primary/40 backdrop-blur-md border border-brand-primary/20 dark:border-brand-accent/20 text-white hover:bg-brand-primary transition-all shadow-md">
            Create Sale
          </Button>
        </div>
      </form>

      <SalePreview 
        show={showPreview} 
        onClose={() => setShowPreview(false)} 
        data={methods.getValues()} 
      />
    </FormProvider>
  );
};

export default NewSale;
