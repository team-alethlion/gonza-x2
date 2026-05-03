import React, { useState } from "react";
import { Button, Card, Label, TextInput, Alert } from "flowbite-react";
import { 
  HiUser, 
  HiOfficeBuilding, 
  HiCheckCircle, 
  HiArrowRight, 
  HiArrowLeft,
  HiLocationMarker,
  HiPhone,
  HiInformationCircle
} from "react-icons/hi";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuthStore } from "../../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import { CONFIG, getApiUrl } from "../../config";
import { PageLoader } from "../../components/ui/Loader";

// 1. Define Validation Schema
const phoneRegex = /^\+?[0-9\s-]{10,}$/;
const onboardingSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  phone: z.string().regex(phoneRegex, "Invalid phone number format (min 10 digits)"),
  agencyName: z.string().min(3, "Agency name must be at least 3 characters"),
  location: z.string().min(5, "Please provide a more detailed location"),
  branchPhone: z.string().optional().refine((val) => !val || phoneRegex.test(val), {
    message: "Invalid business phone format (min 10 digits)",
  }),
});

type OnboardingData = z.infer<typeof onboardingSchema>;

const OnboardingHome = () => {
  const { user, token, refreshProfile, setOnboarded } = useAuthStore();
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // 2. Initialize React Hook Form
  const {
    register,
    handleSubmit,
    trigger,
    getValues,
    formState: { errors },
  } = useForm<OnboardingData>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      firstName: user?.first_name || "",
      lastName: user?.last_name || "",
      phone: user?.phone || "",
      agencyName: user?.agency?.name || "",
      location: user?.branch?.location || "",
      branchPhone: user?.branch?.phone || "",
    },
    mode: "onChange", // Real-time feedback
  });

  const nextStep = async () => {
    // Validate fields for the current step before proceeding
    let fieldsToValidate: (keyof OnboardingData)[] = [];
    if (step === 1) fieldsToValidate = ["firstName", "lastName", "phone"];
    if (step === 2) fieldsToValidate = ["agencyName", "location", "branchPhone"];

    const isValid = await trigger(fieldsToValidate);
    if (isValid) setStep((prev) => prev + 1);
  };

  const prevStep = () => setStep((prev) => prev - 1);

  const onFinalSubmit = async (data: OnboardingData) => {
    setApiError(null);
    setIsSubmitting(true);

    try {
      if (!token || !user) throw new Error("Authentication session missing");

      // 1. Update User Profile
      const userUpdateRes = await fetch(getApiUrl(`${CONFIG.API.USERS.BASE}users/${user.id}/`), {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          first_name: data.firstName,
          last_name: data.lastName,
          phone: data.phone,
          is_onboarded: true
        }),
      });

      if (!userUpdateRes.ok) throw new Error("Failed to update user profile");

      // 2. Update Agency Name
      if (user.agency?.id) {
        const agencyUpdateRes = await fetch(getApiUrl(`${CONFIG.API.CORE.BASE}agencies/${user.agency.id}/`), {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: data.agencyName,
            is_onboarded: true
          }),
        });

        if (!agencyUpdateRes.ok) throw new Error("Failed to update agency details");
      }

      // 3. Update Main Branch Location & Phone
      if (user.branch?.id) {
        await fetch(getApiUrl(`${CONFIG.API.CORE.BASE}branches/${user.branch.id}/`), {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            location: data.location,
            phone: data.branchPhone || data.phone,
          }),
        });
      }

      // 4. Update Local State & Redirect
      await setOnboarded(true);
      await refreshProfile();
      navigate("/agency", { replace: true });

    } catch (err: unknown) {
      const error = err as Error;
      setApiError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) return <PageLoader />;

  const currentValues = getValues();

  return (
    <>
      {/* Flowbite Breadcrumb Stepper */}
      <div className="w-full max-w-4xl">
        <ol className="flex items-center w-full p-3 space-x-2 text-sm font-medium text-center text-gray-500 bg-white border border-gray-200 rounded-lg shadow-sm dark:text-gray-400 sm:text-base dark:bg-space-indigo-800 dark:border-space-indigo-800 sm:p-4 sm:space-x-4 rtl:space-x-reverse">
          <li className={`flex items-center ${step >= 1 ? 'text-brand-primary dark:text-brand-accent' : ''}`}>
            <span className={`flex items-center justify-center w-5 h-5 me-2 text-xs border rounded-full shrink-0 ${step >= 1 ? 'border-brand-primary dark:border-brand-accent bg-brand-primary text-white dark:bg-space-indigo-500' : 'border-gray-500 dark:border-gray-400'}`}>
              1
            </span>
            Personal <span className="hidden sm:inline-flex ms-2">Identity</span>
            <svg className="w-3 h-3 ms-2 sm:ms-4 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 12 10">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m7 9 4-4-4-4M1 9l4-4-4-4"/>
            </svg>
          </li>
          <li className={`flex items-center ${step >= 2 ? 'text-brand-primary dark:text-brand-accent' : ''}`}>
            <span className={`flex items-center justify-center w-5 h-5 me-2 text-xs border rounded-full shrink-0 ${step >= 2 ? 'border-brand-primary dark:border-brand-accent bg-brand-primary text-white dark:bg-space-indigo-500' : 'border-gray-500 dark:border-gray-400'}`}>
              2
            </span>
            Business <span className="hidden sm:inline-flex ms-2">Setup</span>
            <svg className="w-3 h-3 ms-2 sm:ms-4 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 12 10">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m7 9 4-4-4-4M1 9l4-4-4-4"/>
            </svg>
          </li>
          <li className={`flex items-center ${step >= 3 ? 'text-brand-primary dark:text-brand-accent' : ''}`}>
            <span className={`flex items-center justify-center w-5 h-5 me-2 text-xs border rounded-full shrink-0 ${step >= 3 ? 'border-brand-primary dark:border-brand-accent bg-brand-primary text-white dark:bg-space-indigo-500' : 'border-gray-500 dark:border-gray-400'}`}>
              3
            </span>
            Review
          </li>
        </ol>
      </div>

      {apiError && (
        <div className="w-full max-w-md">
          <Alert color="failure" icon={HiInformationCircle}>
            <span className="font-medium">Onboarding Error:</span> {apiError}
          </Alert>
        </div>
      )}

      <Card className="w-full max-w-md shadow-lg dark:bg-space-indigo-800 dark:border-space-indigo-800">
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onFinalSubmit)}>
          {step === 1 && (
            <>
              <h3 className="text-xl font-bold text-brand-primary dark:text-brand-accent">Personal Information</h3>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="firstName" value="First Name" />
                </div>
                <TextInput
                  id="firstName"
                  type="text"
                  icon={HiUser}
                  placeholder="John"
                  {...register("firstName")}
                  color={errors.firstName ? "failure" : "gray"}
                  helperText={errors.firstName?.message}
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="lastName" value="Last Name" />
                </div>
                <TextInput
                  id="lastName"
                  type="text"
                  icon={HiUser}
                  placeholder="Doe"
                  {...register("lastName")}
                  color={errors.lastName ? "failure" : "gray"}
                  helperText={errors.lastName?.message}
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="phone" value="Phone Number" />
                </div>
                <TextInput
                  id="phone"
                  type="text"
                  icon={HiPhone}
                  placeholder="+256 700 000 000"
                  {...register("phone")}
                  color={errors.phone ? "failure" : "gray"}
                  helperText={errors.phone?.message}
                />
              </div>
              <div className="flex justify-end">
                <Button color="primary" onClick={nextStep}>
                  Next: Business <HiArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h3 className="text-xl font-bold text-brand-primary dark:text-brand-accent">
                {user?.role?.name?.toLowerCase() === 'admin' ? "Business Identity" : "Branch Setup"}
              </h3>
              <div>
                <div className="mb-2 block">
                  <Label 
                    htmlFor="agencyName" 
                    value={user?.role?.name?.toLowerCase() === 'admin' ? "Agency / Business Name" : "Company Name"} 
                  />
                </div>
                <TextInput
                  id="agencyName"
                  type="text"
                  icon={HiOfficeBuilding}
                  placeholder="Your Agency Name"
                  {...register("agencyName")}
                  color={errors.agencyName ? "failure" : "gray"}
                  helperText={errors.agencyName?.message}
                  disabled={user?.role?.name?.toLowerCase() !== 'admin'}
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label 
                    htmlFor="location" 
                    value={user?.role?.name?.toLowerCase() === 'admin' ? "Primary Location (Headquarters)" : "Branch Location"} 
                  />
                </div>
                <TextInput
                  id="location"
                  type="text"
                  icon={HiLocationMarker}
                  placeholder="Plot 12, Kampala Rd"
                  {...register("location")}
                  color={errors.location ? "failure" : "gray"}
                  helperText={errors.location?.message}
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="branchPhone" value="Business Phone (Optional)" />
                </div>
                <TextInput
                  id="branchPhone"
                  type="text"
                  icon={HiPhone}
                  placeholder="+256 700 000 000"
                  {...register("branchPhone")}
                  color={errors.branchPhone ? "failure" : "gray"}
                  helperText={
                    errors.branchPhone ? (
                      <span className="font-medium">{errors.branchPhone.message}</span>
                    ) : (
                      "If not provided, your personal number will be used for business contact."
                    )
                  }
                />
              </div>
              <div className="flex justify-between">
                <Button color="light" onClick={prevStep}>
                  <HiArrowLeft className="mr-2 h-5 w-5" /> Back
                </Button>
                <Button color="primary" onClick={nextStep}>
                  Next: Review <HiArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <h3 className="text-xl font-bold text-brand-primary dark:text-brand-accent">Review & Complete</h3>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <p><strong className="text-gray-900 dark:text-white capitalize">{user?.role?.name || "Admin"}:</strong> {currentValues.firstName} {currentValues.lastName}</p>
                <p><strong className="text-gray-900 dark:text-white">Agency:</strong> {currentValues.agencyName}</p>
                <p><strong className="text-gray-900 dark:text-white">Location:</strong> {currentValues.location}</p>
                <p><strong className="text-gray-900 dark:text-white">Phone:</strong> {currentValues.phone}</p>
              </div>
              <div className="flex justify-between mt-4">
                <Button color="light" onClick={prevStep} disabled={isSubmitting}>
                  <HiArrowLeft className="mr-2 h-5 w-5" /> Edit
                </Button>
                <Button 
                  type="submit"
                  color="primary"
                  isProcessing={isSubmitting}
                  disabled={isSubmitting}
                >
                  🚀 Launch Dashboard
                </Button>
              </div>
            </>
          )}
        </form>
      </Card>
    </>
  );
};

export default OnboardingHome;