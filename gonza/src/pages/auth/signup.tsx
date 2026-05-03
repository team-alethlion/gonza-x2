import React, { useState } from "react";
import { Button, Checkbox, Label, TextInput } from "flowbite-react";
import { HiMail, HiLockClosed, HiEye, HiEyeOff } from "react-icons/hi";
import { FcGoogle } from "react-icons/fc";
import { useThemeStore } from "../../store/useThemeStore";
import { RouterLink } from "../../components/ui/RouterLink";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { mode } = useThemeStore();

  return (
    <div className="w-full max-w-md bg-transparent border-none shadow-none">
      <div className="flex flex-col gap-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create Account</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Join us to start managing your agency today.
          </p>
        </div>

        <Button 
          color={mode === "dark" ? "gray" : "light"} 
          className="w-full border-gray-300 dark:border-gray-600"
        >
          <FcGoogle className="mr-2 h-5 w-5" />
          Continue with Google
        </Button>

        <div className="flex items-center gap-4">
          <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700"></div>
          <span className="text-sm text-gray-500 dark:text-gray-400 uppercase">or sign up with email</span>
          <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700"></div>
        </div>

        <form className="flex flex-col gap-4">
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
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 dark:text-gray-400"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <HiEyeOff className="h-5 w-5" />
                ) : (
                  <HiEye className="h-5 w-5" />
                )}
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
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 dark:text-gray-400"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <HiEyeOff className="h-5 w-5" />
                ) : (
                  <HiEye className="h-5 w-5" />
                )}
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
          >
            Register new account
          </Button>
        </form>

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
