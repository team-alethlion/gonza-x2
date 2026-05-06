import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useProductStore } from "../../store/useProductStore";
import { useCustomerStore } from "../../store/useCustomerStore";
import { useSalesStore } from "../../store/useSalesStore";
import { useAuthStore } from "../../store/useAuthStore";
import { PendingSyncIndicator } from "../common/PendingSyncIndicator";

const SalesLayout: React.FC = () => {
  const { user, isAuthenticated } = useAuthStore();
  const branchId = user?.branch?.id;

  const { sync: syncProducts } = useProductStore();
  const { sync: syncCustomers } = useCustomerStore();
  const { sync: syncSales } = useSalesStore();

  useEffect(() => {
    if (isAuthenticated && branchId) {
      Promise.all([
        syncProducts(false, branchId),
        syncCustomers(false, branchId),
        syncSales(false, branchId),
      ]).catch(console.error);
    }
  }, [isAuthenticated, branchId, syncProducts, syncCustomers, syncSales]);

  return (
    <div className="sales-layout">
      <PendingSyncIndicator />
      <Outlet />
    </div>
  );
};

export default SalesLayout;
