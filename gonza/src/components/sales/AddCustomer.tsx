import React from "react";
import {
  Label,
  Datepicker,
  HelperText,
  TextInput,
  Select,
  Button,
} from "flowbite-react";
import { HiTrash, HiPlus, HiEye } from "react-icons/hi";
import { useFormContext, useFieldArray } from "react-hook-form";
import type { NewSaleFormData } from "../../types/sale";

interface AddCustomerProps {
  onShowPreview: () => void;
}

const AddCustomer: React.FC<AddCustomerProps> = ({ onShowPreview }) => {
  // 1. Use Form Context from parent
  const {
    register,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<NewSaleFormData>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "customers",
  });

  const watchedDate = watch("date");

  const inputTheme = {
    field: {
      input: {
        base: "block w-full border disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 p-2.5 text-sm rounded-sm backdrop-blur-sm",
        addon: "hidden",
        colors: {
          failure: "bg-red-50/20 dark:bg-red-900/10 border-red-500/50 dark:border-red-500/30 text-red-700 dark:text-red-500 focus:border-red-500 focus:ring-red-500/20 backdrop-blur-sm",
          gray: "bg-white/40 dark:bg-white/[0.05] border-gray-200/50 dark:border-white/[0.1] text-gray-900 dark:text-white focus:border-brand-primary focus:ring-brand-primary/20",
        },
        sizes: {
          md: "p-2.5 text-sm rounded-sm",
        },
      },
    },
  };

  const selectTheme = {
    field: {
      select: {
        base: "block w-full border disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 bg-white/40 dark:bg-white/[0.05] border-gray-200/50 dark:border-white/[0.1] text-gray-900 dark:text-white focus:border-brand-primary focus:ring-brand-primary/20 p-2.5 text-sm rounded-sm backdrop-blur-sm",
      },
    },
  };

  const datepickerTheme = {
    root: {
      input: {
        base: "block w-full border disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 p-2.5 text-sm rounded-sm backdrop-blur-sm",
        addon: "hidden",
        colors: {
          gray: "bg-white/40 dark:bg-white/[0.05] border-gray-200/50 dark:border-white/[0.1] text-gray-900 dark:text-white focus:border-brand-primary focus:ring-brand-primary/20",
        }
      }
    },
    popup: {
      root: {
        base: "absolute top-10 z-50 block pt-2",
        inner:
          "inline-block rounded-sm bg-white/95 p-4 shadow-xl dark:bg-white/[0.03] backdrop-blur-3xl border border-gray-200/50 dark:border-white/[0.1]",
      },
      footer: {
        base: "mt-2 flex space-x-2 border-t border-gray-100/50 dark:border-white/[0.05] pt-2",
        button: {
          base: "w-full rounded-sm px-5 py-2 text-center text-sm font-medium focus:ring-4 focus:ring-brand-primary/20 transition-all duration-200",
          today: "bg-brand-primary/80 dark:bg-brand-primary/40 text-white hover:bg-brand-primary backdrop-blur-md",
          clear: "border border-gray-300 bg-white text-gray-900 hover:bg-gray-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10 backdrop-blur-md"
        }
      }
    },
    views: {
      days: {
        header: {
          base: "grid grid-cols-7 mb-1",
          title: "dow h-6 text-center text-sm font-medium leading-6 text-gray-500 dark:text-gray-400"
        },
        items: {
          base: "grid w-64 grid-cols-7",
          item: {
            base: "block flex-1 cursor-pointer rounded-sm border-0 text-center text-sm font-semibold leading-9 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-white/10",
            selected: "bg-brand-primary/80 dark:bg-brand-primary/40 text-white hover:bg-brand-primary backdrop-blur-md",
            disabled: "text-gray-500 opacity-20"
          }
        }
      },
      months: {
        items: {
          item: {
            selected: "bg-brand-primary/80 dark:bg-brand-primary/40 text-white hover:bg-brand-primary backdrop-blur-md",
          }
        }
      },
      years: {
        items: {
          item: {
            selected: "bg-brand-primary/80 dark:bg-brand-primary/40 text-white hover:bg-brand-primary backdrop-blur-md",
          }
        }
      },
      decades: {
        items: {
          item: {
            selected: "bg-brand-primary/80 dark:bg-brand-primary/40 text-white hover:bg-brand-primary backdrop-blur-md",
          }
        }
      }
    }
  };

  return (
    <div className="bg-white/40 dark:bg-white/[0.03] backdrop-blur-md border border-gray-200/50 dark:border-white/[0.05] rounded-sm p-4 shadow-xl mb-6">
      {/* new save section */}
      <div>
        {/* new sale header */}
        <div className="flex items-center justify-between mb-4 border-b border-gray-100/50 dark:border-white/[0.05] pb-4">
          <div>
            <div className="font-bold text-gray-900 dark:text-white">New Sale</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Enter the sale details below</div>
          </div>
          <button 
            type="button"
            className="flex items-center gap-1.5 text-xs font-bold text-brand-primary dark:text-brand-accent hover:bg-brand-primary/10 px-3 py-1.5 rounded-sm transition-colors uppercase tracking-wider"
            onClick={onShowPreview}
          >
            <HiEye className="w-4 h-4" /> Preview
          </button>
        </div>

        <div>
          <div className="mb-4">
            <Label htmlFor="date" className="mb-1 block text-xs font-black uppercase tracking-wider text-gray-500">Date</Label>
            <Datepicker 
              id="date" 
              value={watchedDate} 
              onChange={(d) => d && setValue("date", d)} 
              theme={datepickerTheme}
            />
          </div>

          <div>
            <span className="font-bold text-brand-primary dark:text-brand-accent block mb-4 text-sm font-black uppercase tracking-[0.2em]">Customer Information</span>

            <div className="space-y-6">
              {fields.map((field, index) => (
                <div key={field.id} className="relative p-4 rounded-sm bg-white/30 dark:bg-white/[0.02] border border-gray-200/30 dark:border-white/[0.05] backdrop-blur-sm space-y-4 shadow-sm">
                  {fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="absolute top-2 right-2 p-1 rounded-sm text-rose-500 hover:bg-rose-500/10 transition-all z-10"
                    >
                      <HiTrash className="h-4 w-4" />
                    </button>
                  )}

                  <div>
                    <div className="mb-2 block">
                      <Label htmlFor={`customers.${index}.name`} color={errors.customers?.[index]?.name ? "failure" : "gray"} className="text-[10px] font-bold uppercase tracking-widest">
                        Customer Name
                      </Label>
                    </div>
                    <TextInput
                      id={`customers.${index}.name`}
                      placeholder="Bonnie Green"
                      {...register(`customers.${index}.name`)}
                      color={errors.customers?.[index]?.name ? "failure" : "gray"}
                      theme={inputTheme}
                    />
                    {errors.customers?.[index]?.name && (
                      <HelperText color="failure" className="mt-1 text-xs font-medium">
                        {errors.customers?.[index]?.name?.message}
                      </HelperText>
                    )}
                  </div>

                  <div>
                    <div className="mb-2 block">
                      <Label htmlFor={`customers.${index}.address1`} color={errors.customers?.[index]?.address1 ? "failure" : "gray"} className="text-[10px] font-bold uppercase tracking-widest">
                        Customer Address
                      </Label>
                    </div>
                    <TextInput
                      id={`customers.${index}.address1`}
                      placeholder="Bonnie Green"
                      {...register(`customers.${index}.address1`)}
                      color={errors.customers?.[index]?.address1 ? "failure" : "gray"}
                      theme={inputTheme}
                    />
                    {errors.customers?.[index]?.address1 && (
                      <HelperText color="failure" className="mt-1 text-xs font-medium">
                        {errors.customers?.[index]?.address1?.message}
                      </HelperText>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="mb-2 block">
                        <Label htmlFor={`customers.${index}.contact`} color={errors.customers?.[index]?.contact ? "failure" : "gray"} className="text-[10px] font-bold uppercase tracking-widest">
                          Customer Contact
                        </Label>
                      </div>
                      <TextInput
                        id={`customers.${index}.contact`}
                        placeholder="Bonnie Green"
                        {...register(`customers.${index}.contact`)}
                        color={errors.customers?.[index]?.contact ? "failure" : "gray"}
                        theme={inputTheme}
                      />
                      {errors.customers?.[index]?.contact && (
                        <HelperText color="failure" className="mt-1 text-xs font-medium">
                          {errors.customers?.[index]?.contact?.message}
                        </HelperText>
                      )}
                    </div>
                    <div>
                      <div className="mb-2 block">
                        <Label htmlFor={`customers.${index}.email`} color={errors.customers?.[index]?.email ? "failure" : "gray"} className="text-[10px] font-bold uppercase tracking-widest">
                          Email
                        </Label>
                      </div>
                      <TextInput
                        id={`customers.${index}.email`}
                        placeholder="Bonnie Green"
                        {...register(`customers.${index}.email`)}
                        color={errors.customers?.[index]?.email ? "failure" : "gray"}
                        theme={inputTheme}
                      />
                      {errors.customers?.[index]?.email && (
                        <HelperText color="failure" className="mt-1 text-xs font-medium">
                          {errors.customers?.[index]?.email?.message}
                        </HelperText>
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="mb-2 block">
                      <Label htmlFor={`customers.${index}.address2`} color={errors.customers?.[index]?.address2 ? "failure" : "gray"} className="text-[10px] font-bold uppercase tracking-widest">
                        Customer Address
                      </Label>
                    </div>
                    <TextInput
                      id={`customers.${index}.address2`}
                      placeholder="Bonnie Green"
                      {...register(`customers.${index}.address2`)}
                      color={errors.customers?.[index]?.address2 ? "failure" : "gray"}
                      theme={inputTheme}
                    />
                    {errors.customers?.[index]?.address2 && (
                      <HelperText color="failure" className="mt-1 text-xs font-medium">
                        {errors.customers?.[index]?.address2?.message}
                      </HelperText>
                    )}
                  </div>

                  <div>
                    <div className="mb-2 block">
                      <Label htmlFor={`customers.${index}.category`} color={errors.customers?.[index]?.category ? "failure" : "gray"} className="text-[10px] font-bold uppercase tracking-widest">
                        Customer Category
                      </Label>
                    </div>
                    <Select id={`customers.${index}.category`} {...register(`customers.${index}.category`)} theme={selectTheme}>
                      <option value="">Select Category</option>
                      <option value="1">Individual</option>
                      <option value="2">Corporate</option>
                    </Select>
                    {errors.customers?.[index]?.category && (
                      <HelperText color="failure" className="mt-1 text-xs font-medium">
                        {errors.customers?.[index]?.category?.message}
                      </HelperText>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <Button 
              size="sm"
              color="none"
              onClick={() => append({ name: "", address1: "", contact: "", email: "", address2: "", category: "" })}
              className="w-full mt-6 bg-brand-primary/10 text-brand-primary dark:bg-brand-primary/20 dark:text-brand-accent hover:bg-brand-primary hover:text-white transition-all duration-300 rounded-sm border border-brand-primary/20 dark:border-brand-accent/20 backdrop-blur-md py-2"
            >
              <HiPlus className="mr-1 h-4 w-4" /> Add New Customer
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCustomer;
