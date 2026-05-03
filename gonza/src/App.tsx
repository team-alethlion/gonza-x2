/* eslint-disable @typescript-eslint/no-explicit-any */
import { Suspense, useMemo } from "react";
import {
  RouterProvider,
  createBrowserRouter,
  Navigate,
} from "react-router-dom";
import { ThemeProvider } from "flowbite-react";
import routes from "~react-pages";
import { theme } from "./theme";
import "./App.css";

// Import UI Components
import { PageLoader } from "./components/ui/Loader";

// Import Auth Guards
import { AuthGuard } from "./components/auth/AuthGuard";
import { AccessGuard } from "./components/auth/AccessGuard";
import { OnboardingGuard } from "./components/auth/OnboardingGuard";

// Import Layouts
import PublicLayout from "./components/layouts/PublicLayout";
import AgencyLayout from "./components/layouts/AgencyLayout";
import SubscriptionLayout from "./components/layouts/SubscriptionLayout";
import OnboardingLayout from "./components/layouts/OnboardingLayout";
import AuthLayout from "./components/layouts/AuthLayout";
import ErrorPage from "./components/ui/ErrorPage";

function App() {
  const router = useMemo(() => {
    const mapRoutes = (routes: any[], prefix: string) => {
      return routes.map((r) => {
        let newPath = r.path || "";
        if (newPath === prefix) {
          newPath = "";
        } else if (newPath.startsWith(`${prefix}/`)) {
          newPath = newPath.replace(`${prefix}/`, "");
        }
        return { ...r, path: newPath };
      });
    };

    const publicRoutes = routes.filter(
      (r) =>
        (r.path?.startsWith("public") || r.path === "public") &&
        !r.path?.includes("login") &&
        !r.path?.includes("signup"),
    );
    const authRoutes = routes.filter(
      (r) => r.path?.startsWith("auth") || r.path === "auth",
    );
    const agencyRoutes = routes.filter(
      (r) => r.path?.startsWith("agency") || r.path === "agency",
    );
    const subscriptionRoutes = routes.filter(
      (r) => r.path?.startsWith("subscription") || r.path === "subscription",
    );
    const onboardingRoutes = routes.filter(
      (r) => r.path?.startsWith("onboarding") || r.path === "onboarding",
    );

    return createBrowserRouter([
      {
        path: "/",
        element: <PublicLayout />,
        errorElement: <ErrorPage />,
        children: [{ index: true, element: <Navigate to="/public" replace /> }],
      },
      {
        path: "/auth",
        element: <AuthLayout />,
        errorElement: <ErrorPage />,
        children: [
          { index: true, element: <Navigate to="/auth/login" replace /> },
          ...mapRoutes(authRoutes, "auth"),
        ],
      },
      {
        path: "/agency",
        element: (
          <AuthGuard>
            <AccessGuard>
              <OnboardingGuard requireOnboarded={true}>
                <AgencyLayout />
              </OnboardingGuard>
            </AccessGuard>
          </AuthGuard>
        ),
        errorElement: <ErrorPage />,
        children: mapRoutes(agencyRoutes, "agency"),
      },
      {
        path: "/subscription",
        element: (
          <AuthGuard>
            <AccessGuard>
              <SubscriptionLayout />
            </AccessGuard>
          </AuthGuard>
        ),
        errorElement: <ErrorPage />,
        children: mapRoutes(subscriptionRoutes, "subscription"),
      },
      {
        path: "/onboarding",
        element: (
          <AuthGuard>
            <AccessGuard>
              <OnboardingGuard requireOnboarded={false}>
                <OnboardingLayout />
              </OnboardingGuard>
            </AccessGuard>
          </AuthGuard>
        ),
        errorElement: <ErrorPage />,
        children: mapRoutes(onboardingRoutes, "onboarding"),
      },
      {
        path: "/public",
        element: <PublicLayout />,
        errorElement: <ErrorPage />,
        children: mapRoutes(publicRoutes, "public"),
      },
    ]);
  }, []);

  return (
    <Suspense fallback={<PageLoader />}>
      <ThemeProvider theme={theme}>
        <RouterProvider router={router} />
      </ThemeProvider>
    </Suspense>
  );
}

export default App;
