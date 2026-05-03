import React, { useState } from "react";
import { Button, Checkbox, Label, TextInput, Alert } from "flowbite-react";
import { HiMail, HiLockClosed, HiEye, HiEyeOff, HiUser, HiCheck, HiInformationCircle } from "react-icons/hi";
import { FcGoogle } from "react-icons/fc";
import { useThemeStore } from "../../store/useThemeStore";
import { useAuthStore } from "../../store/useAuthStore";
import { RouterLink } from "../../components/ui/RouterLink";
import { useNavigate } from "react-router-dom";
import { CONFIG, getApiUrl } from "../../config";

const Signup = () => {
  const [step, setStep] = useState(1); // 1: Details, 2: Verification
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [code, setCode] = useState("");
  
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { mode } = useThemeStore();
  const { login: storeLogin } = useAuthStore();
  const navigate = useNavigate();

  const handleInitiateSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(getApiUrl(`${CONFIG.API.USERS.BASE}users/initiate_signup/`), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to initiate signup");

      setStep(2);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifySignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      // 1. Verify and Create User
      const verifyRes = await fetch(getApiUrl(`${CONFIG.API.USERS.BASE}users/verify_signup/`), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name, code }),
      });

      const verifyData = await verifyRes.json();
      if (!verifyRes.ok) throw new Error(verifyData.error || "Verification failed");

      // 2. Login to get tokens
      const tokenRes = await fetch(getApiUrl(CONFIG.API.AUTH.LOGIN), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const tokenData = await tokenRes.json();
      if (!tokenRes.ok) throw new Error("Verification successful, but login failed. Please login manually.");

      // 3. Fetch full profile to get is_onboarded status
      const userRes = await fetch(getApiUrl(`${CONFIG.API.USERS.BASE}users/me/`), {
        headers: { Authorization: `Bearer ${tokenData.access}` },
      });
      const userData = await userRes.json();

      // 4. Update store and redirect
      await storeLogin(userData, tokenData.access, tokenData.refresh);
      navigate("/onboarding", { replace: true });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-transparent border-none shadow-none">
      <div className="flex flex-col gap-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {step === 1 ? "Create Account" : "Verify Email"}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {step === 1 
              ? "Join us to start managing your business today." 
              : `We've sent a 6-digit code to ${email}`}
          </p>
        </div>

        {error && (
          <Alert color="failure" icon={HiInformationCircle}>
            <span className="font-medium">Error!</span> {error}
          </Alert>
        )}

        {step === 1 ? (
          <>
            <Button 
              color={mode === "dark" ? "gray" : "light"} 
              className="w-full border-gray-300 dark:border-gray-600"
              disabled={isSubmitting}
            >
              <FcGoogle className="mr-2 h-5 w-5" />
              Continue with Google
            </Button>

            <div className="flex items-center gap-4">
              <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700"></div>
              <span className="text-sm text-gray-500 dark:text-gray-400 uppercase">or sign up with email</span>
              <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700"></div>
            </div>

            <form className="flex flex-col gap-4" onSubmit={handleInitiateSignup}>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="name" value="Full Name" />
                </div>
                <TextInput
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  required
                  shadow
                  icon={HiUser}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
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
                    placeholder="••••••••"
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
                    disabled={isSubmitting}
                  >
                    {showPassword ? <HiEyeOff className="h-5 w-5" /> : <HiEye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="confirm-password" value="Confirm Password" />
                </div>
                <div className="relative">
                  <TextInput
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    required
                    shadow
                    icon={HiLockClosed}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 dark:text-gray-400"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={isSubmitting}
                  >
                    {showConfirmPassword ? <HiEyeOff className="h-5 w-5" /> : <HiEye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="agree" required />
                <Label htmlFor="agree" className="flex text-sm">
                  I agree with the&nbsp;
                  <RouterLink href="#" className="text-[#252861] hover:underline dark:text-[#80ced7]">
                    terms and conditions
                  </RouterLink>
                </Label>
              </div>
              <Button 
                type="submit" 
                color="primary"
                isProcessing={isSubmitting}
                disabled={isSubmitting}
              >
                Register new account
              </Button>
            </form>
          </>
        ) : (
          <form className="flex flex-col gap-4" onSubmit={handleVerifySignup}>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="code" value="Verification Code" />
              </div>
              <TextInput
                id="code"
                type="text"
                placeholder="123456"
                required
                shadow
                icon={HiCheck}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
            <Button 
              type="submit" 
              color="primary"
              isProcessing={isSubmitting}
              disabled={isSubmitting}
            >
              Verify & Complete Signup
            </Button>
            <button 
              type="button" 
              onClick={() => setStep(1)} 
              className="text-sm text-gray-500 hover:underline"
              disabled={isSubmitting}
            >
              Go back to details
            </button>
          </form>
        )}

        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          Already have an account?{" "}
          <RouterLink href="/auth/login" className="font-medium text-[#252861] hover:underline dark:text-[#80ced7]">
            Sign In
          </RouterLink>
        </p>

        <div className="text-center border-t border-gray-100 dark:border-gray-700 pt-4">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Need help? <RouterLink href="#" className="text-[#252861] hover:underline dark:text-[#80ced7]">Contact support</RouterLink>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
