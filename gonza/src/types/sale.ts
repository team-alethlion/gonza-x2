import * as z from "zod";

export const customerItemSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Customer name is required"),
  address1: z.string().min(5, "Address is required"),
  contact: z.string().min(10, "Valid contact is required"),
  email: z.string().email("Invalid email address"),
  category: z.string().min(1, "Please select a category"),
});

export const productItemSchema = z.object({
  id: z.string(),
  productId: z.string().optional(),
  productName: z.string().optional(),
  message: z.string().min(1, "Product description is required"),
  productAppend: z.string().optional(),
  quantity: z.coerce.number().min(0.01, "Quantity must be > 0"),
  pricePerUnit: z.coerce.number().min(0, "Price cannot be negative"),
  discountType: z.enum(["%", "UGX"]),
  discountValue: z.coerce.number().min(0, "Discount cannot be negative"),
  costPerUnit: z.coerce.number().min(0, "Cost cannot be negative"),
  itemTotalCost: z.number(),
});

export const newSaleSchema = z.object({
  date: z.date(),
  customers: z.array(customerItemSchema),
  items: z.array(productItemSchema),
  taxRate: z.coerce.number().min(0, "Tax rate cannot be negative"),
  subtotal: z.number(),
  taxAmount: z.number(),
  grandTotal: z.number(),
  totalItems: z.number(),
  paymentStatus: z.enum(["Paid", "NOT PAID", "Installment Sale"]).default("Paid"),
  linkToCash: z.boolean().default(true),
  cashAccountId: z.string().optional(),
  saleSource: z.string().optional(),
  notes: z.string().optional(),
  shippingCost: z.coerce.number().default(0),
  receiptOptions: z.object({
    showReceipt: z.boolean(),
    sendEmail: z.boolean(),
    includePayment: z.boolean(),
  }),
});

export type NewSaleFormData = z.infer<typeof newSaleSchema>;
