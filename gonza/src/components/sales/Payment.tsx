import {
  Label,
  Select,
  Textarea,
  ToggleSwitch,
  TextInput,
} from "flowbite-react";
import React, { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { type NewSaleFormData } from "../../types/sale";
import { apiFetch } from "../../utils/api";
import { useAuthStore } from "../../store/useAuthStore";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../../db/db";

const Payment = () => {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<NewSaleFormData>();

  const { user } = useAuthStore();
  const [cashAccounts, setCashAccounts] = useState<any[]>([]);
  const saleCategories = useLiveQuery(() => db.saleCategories.toArray());
  const saleSources = useLiveQuery(() => db.saleSources.toArray());

  const watchedLinkToCash = watch("linkToCash");
  const watchedPaymentStatus = watch("paymentStatus");

  useEffect(() => {
    const fetchCashAccounts = async () => {
      if (!user?.branch?.id) return;
      try {
        const res = await apiFetch(
          `/finance/accounts/?branchId=${user.branch.id}`,
        );
        if (res.ok) {
          const data = await res.json();
          const accounts = Array.isArray(data) ? data : data.results || [];
          setCashAccounts(accounts);
        }
      } catch (err) {
        console.error("Failed to fetch cash accounts:", err);
      }
    };

    fetchCashAccounts();
  }, [user, setValue, watch]);

  const selectTheme = {
    field: {
      select: {
        base: "block w-full border disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 bg-white/40 dark:bg-white/[0.05] border-gray-200/50 dark:border-white/[0.1] text-gray-900 dark:text-white focus:border-brand-primary focus:ring-brand-primary/20 p-2.5 text-sm rounded-sm backdrop-blur-sm",
      },
    },
  };

  const textareaTheme = {
    base: "block w-full border disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 bg-white/40 dark:bg-white/[0.05] border-gray-200/50 dark:border-white/[0.1] text-gray-900 dark:text-white focus:border-brand-primary focus:ring-brand-primary/20 p-2.5 text-sm rounded-sm backdrop-blur-sm",
  };

  return (
    <div className="bg-white/40 dark:bg-white/[0.03] backdrop-blur-md border border-gray-200/50 dark:border-white/[0.05] rounded-sm p-4 shadow-xl mb-6">
      <span className="font-bold text-brand-primary dark:text-brand-accent block mb-4 text-sm font-black  tracking-[0.2em]">
        Payment Information
      </span>

      <div className="">
        <div className="space-y-4">
          <div>
            <Label className="text-[10px] font-bold  tracking-widest text-gray-500 block mb-1.5">
              Payment Status
            </Label>
            <Select {...register("paymentStatus")} theme={selectTheme}>
              <option value="Paid">Paid</option>
              <option value="NOT PAID">Not Paid</option>
              <option value="Installment Sale">Installment Sale</option>
            </Select>
          </div>
        </div>

        <div className="space-y-4 mt-4">
          <div className="p-4 rounded-sm bg-white/30 dark:bg-white/[0.02] border border-gray-200/30 dark:border-white/[0.05] backdrop-blur-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 font-bold  tracking-tighter">
                Link to Cash Account
              </span>

              <div>
                <ToggleSwitch
                  className="text-brand-primary focus:ring-brand-primary dark:border-white/10 dark:bg-white/5 dark:focus:ring-brand-primary dark:focus:ring-offset-gray-800"
                  checked={!!watchedLinkToCash}
                  onChange={(checked) => setValue("linkToCash", checked)}
                />
              </div>
            </div>
            <p className="text-[.65rem]">
              Record this payment in a cash account
            </p>

            {watchedLinkToCash && watchedPaymentStatus === "Paid" && (
              <div className="mt-3">
                <Label className="text-[10px] font-bold  tracking-widest text-gray-500 block mb-1.5">
                  Select Cash Account
                </Label>
                <Select {...register("cashAccountId")} theme={selectTheme}>
                  <option value="">Select a Cash Account</option>
                  {cashAccounts.map((acc) => (
                    <option key={acc.id} value={acc.id}>
                      {acc.name} (Bal:
                      {new Intl.NumberFormat().format(acc.current_balance)})
                    </option>
                  ))}
                </Select>
              </div>
            )}
          </div>

          <div>
            <Label className="text-[10px] font-bold  tracking-widest text-gray-500 block mb-1.5">
              Sale Source
            </Label>
            <Select {...register("saleSource")} theme={selectTheme}>
              <option value="">Select Source</option>
              {saleSources?.map((source) => (
                <option key={source.id} value={source.id}>
                  {source.name}
                </option>
              ))}
            </Select>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <Label className="text-[10px] font-bold  tracking-widest text-gray-500 block mb-1.5">
          Notes
        </Label>
        <Textarea
          placeholder="Additional notes about this sale..."
          rows={3}
          {...register("notes")}
          theme={textareaTheme}
        />
      </div>
    </div>
  );
};

export default Payment;
