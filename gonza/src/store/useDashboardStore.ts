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

export const useDashboard = (
  branchId: string | undefined,
  period: string = "today",
) => {
  const summary = useLiveQuery(async (): Promise<DashboardSummary | null> => {
    // 0. Calculate date range based on period
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    let startDate = new Date(0); // Default to all time

    if (period === "today") {
      startDate = startOfToday;
    } else if (period === "this_week") {
      const day = now.getDay(); // 0 (Sun) to 6 (Sat)
      const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Adjust to Mon
      startDate = new Date(now.setDate(diff));
      startDate.setHours(0, 0, 0, 0);
    } else if (period === "this_month") {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    } else if (period === "this_year") {
      startDate = new Date(now.getFullYear(), 0, 1);
    }

    const startTime = startDate.toISOString();

    // 1. Sales (exclude quotes)
    let salesQuery = db.sales.where("date").aboveOrEqual(startTime);
    if (branchId) {
      salesQuery = db.sales
        .where("branch")
        .equals(branchId)
        .and((s) => s.date >= startTime);
    }
    const sales = (await salesQuery.toArray()).filter(
      (sale) => sale.status !== "QUOTE",
    );

    const totalSales = sales.reduce((sum, sale) => sum + sale.total_amount, 0);
    const totalProfit = sales.reduce((sum, sale) => sum + sale.profit, 0);
    const paidSalesCount = sales.filter(
      (sale) => sale.status === "COMPLETED",
    ).length;

    // 2. Customers (total Registered)
    let customersQuery = db.customers.where("id").notEqual("");
    if (branchId) {
      customersQuery = db.customers.where("branch").equals(branchId);
    }
    const customers = await customersQuery.toArray();
    const totalCustomers = customers.length;

    // 3. Inventory value (total Current)
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
    let expensesQuery = db.expenses.where("date").aboveOrEqual(startTime);
    if (branchId) {
      expensesQuery = db.expenses
        .where("branch")
        .equals(branchId)
        .and((e) => e.date >= startTime);
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
