import React, { useState } from "react";
import AddCustomer from "../../../components/sales/AddCustomer";
import ProductService from "../../../components/sales/ProductService";
import Payment from "../../../components/sales/Payment";
import ReceiptOptions from "../../../components/sales/ReceiptOptions";
import SalePreview from "../../../components/sales/SalePreview";
import { Button, Spinner, Alert } from "flowbite-react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { newSaleSchema } from "../../../types/sale";
import type { NewSaleFormData } from "../../../types/sale";
import { useAuthStore } from "../../../store/useAuthStore";
import { apiFetch } from "../../../utils/api";
import { syncQueue } from "../../../services/syncQueue";
import { getApiUrl } from "../../../config";

const NewSale = () => {
  const [showPreview, setShowPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submittedData, setSubmittedData] = useState<NewSaleFormData | null>(
    null,
  );

  const { user } = useAuthStore();

  const methods = useForm<NewSaleFormData>({
    resolver: zodResolver(newSaleSchema),
    defaultValues: {
      date: new Date(),
      customers: [
        {
          name: "",
          address1: "",
          contact: "",
          email: "",
          category: "",
        },
      ],
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
      paymentStatus: "Paid",
      linkToCash: true,
      cashAccountId: "",
      shippingCost: 0,
      receiptOptions: {
        showReceipt: true,
        sendEmail: false,
        includePayment: true,
      },
    },
    mode: "onChange",
  });

  const { reset } = methods;

  const onSubmit = async (data: NewSaleFormData) => {
    console.log("working");
    if (!user) {
      setSubmitError("You must be logged in to create a sale.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    const mainCustomer = data.customers[0];
    const payload = {
      agencyId: user.agency?.id,
      branchId: user.branch?.id,
      userId: user.id,
      date: data.date.toISOString(),
      customerName: mainCustomer.name,
      customerContact: mainCustomer.contact,
      customerAddress: mainCustomer.address1,
      customerId: mainCustomer.id || null,
      customerCategoryId: mainCustomer.category || null,
      items: data.items.map((item) => ({
        productId: item.productId || null,
        productName: item.productName || item.message,
        description: item.productAppend
          ? `${item.message} (${item.productAppend})`
          : item.message,
        quantity: item.quantity,
        price: item.pricePerUnit,
        cost: item.costPerUnit,
        discountType: item.discountType === "%" ? "percentage" : "amount",
        discountPercentage: item.discountType === "%" ? item.discountValue : 0,
        discountAmount: item.discountType === "UGX" ? item.discountValue : 0,
      })),
      taxRate: data.taxRate,
      paymentStatus: data.paymentStatus,
      shippingCost: data.shippingCost,
      notes: data.notes,
      amountPaid: data.paymentStatus === "Paid" ? data.grandTotal : 0,
      saleSourceId: data.saleSource || null,
      linkToCash: data.linkToCash,
      cashAccountId: data.cashAccountId || null,
      sendEmail: data.receiptOptions.sendEmail,
    };

    try {
      const res = await apiFetch("/sales/sales/", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || "Failed to create sale");
      }

      // 🛡️ Strategic Capture: Save the data for preview BEFORE resetting the form
      if (data.receiptOptions.showReceipt) {
        setSubmittedData({ ...data });
        setShowPreview(true);
      }

      reset();
      alert("Sale created successfully!");
    } catch (err: any) {
      const isNetworkError =
        !navigator.onLine ||
        err.message.includes("Failed to fetch") ||
        err.message.includes("NetworkError") ||
        err.message.includes("network");

      if (isNetworkError) {
        try {
          const pendingId = await syncQueue.queueSale(payload);
          console.log(`Sale queued with ID: ${pendingId}`);
          alert(
            "You are offline. Sale has been saved locally and will be synced when you're back online.",
          );
          reset();
        } catch (queueErr) {
          console.error("Failed to queue sale:", queueErr);
          setSubmitError("Failed to save sale locally. Please try again.");
        }
      } else {
        setSubmitError(err.message || "An unexpected error occurred");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClosePreview = () => {
    setShowPreview(false);
    // 🛡️ Cleanup: Only clear submittedData AFTER the modal starts closing
    setTimeout(() => setSubmittedData(null), 300);
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit, (errors) => {
          console.error("Form Validation Errors:", errors);
        })}>
        {submitError && (
          <Alert color="failure" className="mb-4 rounded-sm">
            <span className="font-medium">Submission Error!</span> {submitError}
          </Alert>
        )}

        <AddCustomer onShowPreview={() => setShowPreview(true)} />
        <ProductService />
        <Payment />
        <ReceiptOptions />

        <div className="flex items-center justify-end gap-4 mt-4 m-0.5">
          <Button
            type="button"
            color="none"
            className="rounded-sm bg-white/40 dark:bg-white/[0.03] backdrop-blur-md border border-gray-200/50 dark:border-white/[0.05] text-gray-700 dark:text-gray-300 hover:bg-white/60 dark:hover:bg-white/10 transition-all shadow-sm">
            Cancel
          </Button>

          <Button
            color="none"
            type="button"
            onClick={() => reset()}
            className="rounded-sm bg-white/40 dark:bg-white/[0.03] backdrop-blur-md border border-rose-500/20 dark:border-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-50/50 dark:hover:bg-rose-900/10 transition-all shadow-sm">
            Clear Form
          </Button>

          <Button
            color="none"
            type="submit"
            disabled={isSubmitting}
            className="rounded-sm bg-brand-primary/80 dark:bg-brand-primary/40 backdrop-blur-md border border-brand-primary/20 dark:border-brand-accent/20 text-white hover:bg-brand-primary transition-all shadow-md min-w-[150px]">
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <Spinner size="xs" /> Creating...
              </div>
            ) : (
              "Create Sale"
            )}
          </Button>
        </div>
      </form>

      <SalePreview
        show={showPreview}
        onClose={handleClosePreview}
        data={submittedData || methods.getValues()}
      />
    </FormProvider>
  );
};

export default NewSale;
