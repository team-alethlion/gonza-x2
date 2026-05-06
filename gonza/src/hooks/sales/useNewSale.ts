import { useSearchParams } from "react-router-dom";
import { type NewSaleFormData } from "../../types/sale";
import { db } from "../../db/db";
import { useSalesStore } from "../../store/useSalesStore";
import { useProductStore } from "../../store/useProductStore";
import { useFinanceStore } from "../../store/useFinanceStore";

export const useNewSaleLogic = () => {
  const [searchParams] = useSearchParams();
  const createType = searchParams.get("create") || "new";

  const { sync: syncSales } = useSalesStore();
  const { syncProducts } = useProductStore();
  const { sync: syncFinance } = useFinanceStore();

  const getDefaultValues = (user: any): Partial<NewSaleFormData> => {
    const baseDefaults = {
      date: new Date(),
      customers: [
        { name: "", address1: "", contact: "", email: "", category: "" },
      ],
      items: [
        {
          id: Math.random().toString(36).substr(2, 9),
          message: "",
          productAppend: "",
          quantity: 1,
          pricePerUnit: 0,
          discountType: "%" as const,
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
      paymentStatus: "Paid" as const,
      linkToCash: true,
      cashAccountId: "",
      shippingCost: 0,
      receiptOptions: {
        showReceipt: true,
        sendEmail: false,
        includePayment: true,
      },
    };

    switch (createType) {
      case "invoice":
        return {
          ...baseDefaults,
          paymentStatus: "NOT PAID",
          receiptOptions: {
            ...baseDefaults.receiptOptions,
            includePayment: false,
          },
        };
      case "quotation":
        return {
          ...baseDefaults,
          paymentStatus: "QUOTE",
          receiptOptions: {
            ...baseDefaults.receiptOptions,
            includePayment: false,
          },
        };
      case "installment":
        return { ...baseDefaults, paymentStatus: "Installment Sale" };
      case "receipt":
      default:
        return baseDefaults;
    }
  };

  const handlePostSubmissionSync = async (saleData: any, branchId?: string) => {
    try {
      // 1. Manually inject into Dexie for immediate UI update
      if (saleData.id) {
        // Ensure data format matches Dexie/Sale interface
        await db.sales.put({
          ...saleData,
          total_amount: saleData.total_amount || saleData.totalAmount,
          total_cost: saleData.total_cost || saleData.totalCost,
          amount_paid: saleData.amount_paid || saleData.amountPaid,
          balance_due: saleData.balance_due || saleData.balanceDue,
        });
      }

      // 2. Trigger background syncs to ensure everything is consistent (stock, finance, etc.)
      // We don't await these to keep the UI snappy, they run in background
      Promise.all([
        syncSales(branchId),
        syncProducts(branchId),
        syncFinance(false, branchId),
      ]).catch(e => console.error("Background sync failed", e));
      
    } catch (err) {
      console.error("Post-submission sync failed:", err);
    }
  };

  return {
    createType,
    getDefaultValues,
    handlePostSubmissionSync,
  };
};
