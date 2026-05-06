import React, { useState } from "react";
import { Button, Checkbox, Label, TextInput, Alert } from "flowbite-react";
import {
  HiMail,
  HiLockClosed,
  HiEye,
  HiEyeOff,
  HiInformationCircle,
} from "react-icons/hi";
import { FcGoogle } from "react-icons/fc";
import { useThemeStore } from "../../store/useThemeStore";
import { useAuthStore } from "../../store/useAuthStore";
import { RouterLink } from "../../components/ui/RouterLink";
import { useNavigate, useLocation } from "react-router-dom";
import { CONFIG, getApiUrl } from "../../config";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { mode } = useThemeStore();
  const { login: storeLogin } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/agency";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      // 1. Obtain Token
      const tokenRes = await fetch(getApiUrl(CONFIG.API.AUTH.LOGIN), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const tokenData = await tokenRes.json();

      if (!tokenRes.ok) {
        throw new Error(tokenData.detail || "Invalid email or password");
      }

      // 2. Fetch User Profile (Me)
      const userRes = await fetch(
        getApiUrl(`${CONFIG.API.USERS.BASE}users/me/`),
        {
          headers: {
            Authorization: `Bearer ${tokenData.access}`,
          },
        },
      );

      const userData = await userRes.json();

      if (!userRes.ok) {
        throw new Error("Failed to fetch user profile");
      }

      // 3. Update Store
      await storeLogin(userData, tokenData.access, tokenData.refresh);

      // 4. Redirect based on onboarding status
      if (!userData.is_onboarded) {
        navigate("/onboarding", { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-transparent border-none shadow-none">
      <div className="flex flex-col gap-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Sign In
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Welcome back! Please enter your details.
          </p>
        </div>

        {error && (
          <Alert color="failure" icon={HiInformationCircle}>
            <span className="font-medium">Error!</span> {error}
          </Alert>
        )}

        <Button
          color={mode === "dark" ? "gray" : "light"}
          className="w-full border-gray-300 dark:border-gray-600"
          disabled={isSubmitting}>
          <FcGoogle className="mr-2 h-5 w-5" />
          Continue with Google
        </Button>

        <div className="flex items-center gap-4">
          <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700"></div>
          <span className="text-sm text-gray-500 dark:text-gray-400 ">
            or sign in with email
          </span>
          <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700"></div>
        </div>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="email" value="Email address" />
            </div>
            <TextInput
              id="email"
              type="email"
              placeholder="name@flowbite.com"
              required
              shadow
              icon={HiMail}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="password" value="Password" />
            </div>
            <div className="relative">
              <TextInput
                id="password"
                type={showPassword ? "text" : "password"}
                required
                shadow
                icon={HiLockClosed}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isSubmitting}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 dark:text-gray-400"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isSubmitting}>
                {showPassword ? (
                  <HiEyeOff className="h-5 w-5" />
                ) : (
                  <HiEye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Checkbox id="remember" />
              <Label htmlFor="remember">Remember me</Label>
            </div>
            <RouterLink
              href="#"
              className="text-sm text-purple-600 hover:underline dark:text-purple-400">
              Forgot password?
            </RouterLink>
          </div>
          <Button
            type="submit"
            color="primary"
            isProcessing={isSubmitting}
            disabled={isSubmitting}>
            Sign In
          </Button>
        </form>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          Don't have an account?{" "}
          <RouterLink
            href="/auth/signup"
            className="font-medium text-[#252861] hover:underline dark:text-[#80ced7]">
            Sign Up
          </RouterLink>
        </p>

        <div className="text-center border-t border-gray-100 dark:border-gray-700 pt-4">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Need help?{" "}
            <RouterLink
              href="#"
              className="text-[#252861] hover:underline dark:text-[#80ced7]">
              Contact support
            </RouterLink>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
