import React from "react";
import UnauthorizedPage from "../../components/ui/UnauthorizedPage";
import { useAuthStore } from "../../store/useAuthStore";

const UnauthorizedRoute = () => {
  const { user } = useAuthStore();
  
  // Determine the type of block to display
  let type: "frozen" | "suspended" | "unauthorized" = "unauthorized";
  
  if (user?.is_frozen) {
    type = "frozen";
  } else if (user?.status === "SUSPENDED") {
    type = "suspended";
  }

  return <UnauthorizedPage type={type} />;
};

export default UnauthorizedRoute;
