export interface Plan {
  id: string;
  name: string;
  priceMonth: number;
  priceYear: number;
  features: string[];
  limits: {
    users: number | "unlimited";
    sales: number | "unlimited";
    products: number | "unlimited";
    customers: number | "unlimited";
  };
  hasTrial: boolean;
}

export const PLANS: Plan[] = [
  {
    id: "standard",
    name: "Standard Plan",
    priceMonth: 50000,
    priceYear: 550000,
    hasTrial: true,
    features: ["Access to all features"],
    limits: {
      users: 3,
      sales: 600,
      products: 800,
      customers: 700,
    },
  },
  {
    id: "premium",
    name: "Premium Plan",
    priceMonth: 70000,
    priceYear: 750000,
    hasTrial: false,
    features: ["Access to all features"],
    limits: {
      users: 7,
      sales: 2000,
      products: 3000,
      customers: 2500,
    },
  },
  {
    id: "enterprise",
    name: "Enterprise Plan",
    priceMonth: 150000,
    priceYear: 1500000,
    hasTrial: false,
    features: ["Access to all features"],
    limits: {
      users: 20,
      sales: "unlimited",
      products: 8000,
      customers: "unlimited",
    },
  },
];
