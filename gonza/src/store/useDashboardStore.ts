// src/store/useDashboardStore.ts
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../db/db";

export interface DashboardSummary {
  totalSales: number;
  totalProfit: number;
  totalExpenses: number; // now from db.expenses
  inventoryValue: number;
  totalCustomers: number;
  paidSalesCount: number;
}

export const useDashboard = (branchId: string | undefined) => {
  const summary = useLiveQuery(async (): Promise<DashboardSummary | null> => {
    // 1. Sales (exclude quotes)
    let salesQuery = db.sales.where("id").notEqual("");
    if (branchId) {
      salesQuery = db.sales.where("branch").equals(branchId);
    }
    const sales = (await salesQuery.toArray()).filter(
      (sale) => sale.status !== "QUOTE",
    );

    const totalSales = sales.reduce((sum, sale) => sum + sale.total_amount, 0);
    const totalProfit = sales.reduce((sum, sale) => sum + sale.profit, 0);
    const paidSalesCount = sales.filter(
      (sale) => sale.status === "COMPLETED",
    ).length;

    // 2. Customers
    let customersQuery = db.customers.where("id").notEqual("");
    if (branchId) {
      customersQuery = db.customers.where("branch").equals(branchId);
    }
    const customers = await customersQuery.toArray();
    const totalCustomers = customers.length;

    // 3. Inventory value (stock * selling_price)
    let productsQuery = db.products.where("id").notEqual("");
    if (branchId) {
      productsQuery = db.products.where("branch").equals(branchId);
    }
    const products = await productsQuery.toArray();
    const inventoryValue = products.reduce(
      (sum, prod) => sum + prod.stock * prod.selling_price,
      0,
    );

    // 4. Expenses – sum from synced expenses table
    let expensesQuery = db.expenses.where("id").notEqual("");
    if (branchId) {
      expensesQuery = db.expenses.where("branch").equals(branchId);
    }
    const expenses = await expensesQuery.toArray();
    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

    return {
      totalSales,
      totalProfit,
      totalExpenses,
      inventoryValue,
      totalCustomers,
      paidSalesCount,
    };
  }, [branchId]);

  return {
    summary,
    loading: summary === undefined,
  };
};
