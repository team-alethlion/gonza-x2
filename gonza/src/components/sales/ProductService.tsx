import React, { useEffect } from "react";
import {
  Label,
  TextInput,
  Select,
  Button,
  Textarea,
  HR,
  Dropdown,
  HelperText,
} from "flowbite-react";
import { HiTrash, HiPlus, HiRefresh, HiCash } from "react-icons/hi";
import { useFormContext, useFieldArray, useWatch } from "react-hook-form";
import { type NewSaleFormData } from "../../types/sale";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../../db/db";

const ProductService = () => {
  const {
    register,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<NewSaleFormData>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const watchedItems = useWatch({ control, name: "items" });
  const watchedTaxRate = watch("taxRate");

  // 🛡️ Strategic Local Data: Fetch products from Dexie
  const products = useLiveQuery(() => db.products.toArray());

  useEffect(() => {
    let currentSubtotal = 0;
    let currentTotalItems = 0;

    watchedItems.forEach((item, index) => {
      const calculatedItemTotalCost =
        (item.costPerUnit || 0) * (item.quantity || 0);
      if (item.itemTotalCost !== calculatedItemTotalCost) {
        setValue(`items.${index}.itemTotalCost`, calculatedItemTotalCost, {
          shouldDirty: true,
        });
      }

      let itemPrice = (item.pricePerUnit || 0) * (item.quantity || 0);
      if (item.discountType === "%") {
        itemPrice -= itemPrice * ((item.discountValue || 0) / 100);
      } else {
        itemPrice -= item.discountValue || 0;
      }

      currentSubtotal += itemPrice;
      currentTotalItems += Number(item.quantity || 0);
    });

    const currentTaxAmount = currentSubtotal * ((watchedTaxRate || 0) / 100);
    const currentGrandTotal = currentSubtotal + currentTaxAmount;

    // Only update if values have changed to prevent re-render loops
    const currentValues = watch();
    if (currentValues.subtotal !== currentSubtotal)
      setValue("subtotal", currentSubtotal);
    if (currentValues.taxAmount !== currentTaxAmount)
      setValue("taxAmount", currentTaxAmount);
    if (currentValues.grandTotal !== currentGrandTotal)
      setValue("grandTotal", currentGrandTotal);
    if (currentValues.totalItems !== currentTotalItems)
      setValue("totalItems", currentTotalItems);
  }, [watchedItems, watchedTaxRate, setValue]);

  const inputTheme = {
    field: {
      input: {
        base: "block w-full border disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
        colors: {
          failure:
            "bg-red-50/20 dark:bg-red-900/10 border-red-500/50 dark:border-red-500/30 text-red-700 dark:text-red-500 focus:border-red-500 focus:ring-red-500/20 backdrop-blur-sm",
          gray: "bg-white/40 dark:bg-white/[0.05] border-gray-200/50 dark:border-white/[0.1] text-gray-900 dark:text-white focus:border-brand-primary focus:ring-brand-primary/20 backdrop-blur-sm",
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

  const textareaTheme = {
    base: "block w-full border disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 bg-white/40 dark:bg-white/[0.05] border-gray-200/50 dark:border-white/[0.1] text-gray-900 dark:text-white focus:border-brand-primary focus:ring-brand-primary/20 p-2.5 text-sm rounded-sm backdrop-blur-sm",
  };

  return (
    <div className="bg-white/40 dark:bg-white/[0.03] backdrop-blur-md border border-gray-200/50 dark:border-white/[0.05] rounded-sm p-4 shadow-xl mb-6">
      <span className="font-bold text-brand-primary dark:text-brand-accent block mb-4 text-sm font-black  tracking-[0.2em]">
        Items/Services
      </span>

      <div className="space-y-6">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="relative z-10 mt-4 bg-white/30 dark:bg-white/[0.02] border border-gray-200/30 dark:border-white/[0.05] backdrop-blur-sm rounded-sm p-4 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span>Item {index + 1}</span>
              <div className="flex items-center gap-2">
                <Button
                  size="xs"
                  color="none"
                  className="text-xs font-bold text-rose-500 hover:bg-rose-500/10 rounded-sm">
                  Clear
                </Button>
                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="p-1.5 rounded-sm text-rose-500 hover:bg-rose-500/10">
                    <HiTrash className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            <div>
              <div className="mb-2 block">
                <Label
                  htmlFor={`items.${index}.message`}
                  className="text-[10px] font-bold  tracking-widest text-gray-500">
                  Product/Service
                </Label>
              </div>
              <TextInput
                id={`items.${index}.message`}
                placeholder="Type product name or select..."
                {...register(`items.${index}.message`)}
                onChange={(e) => {
                  const val = e.target.value;
                  setValue(`items.${index}.message`, val);

                  // 🚀 Logic: If value matches a datalist entry pattern, extract data
                  if (val.includes(" | ID:")) {
                    const [name, idPart, costPart, pricePart] =
                      val.split(" | ");
                    const id = idPart.replace("ID:", "");
                    const cost = parseFloat(costPart.replace("COST:", ""));
                    const price = parseFloat(pricePart.replace("PRICE:", ""));

                    setValue(`items.${index}.productId`, id);
                    setValue(`items.${index}.productName`, name);
                    setValue(`items.${index}.message`, name);
                    setValue(`items.${index}.costPerUnit`, cost);
                    setValue(`items.${index}.pricePerUnit`, price);
                  }
                }}
                color={errors.items?.[index]?.message ? "failure" : "gray"}
                theme={inputTheme}
                list={`product-list-${index}`}
              />
              <datalist id={`product-list-${index}`}>
                {products?.map((prod) => (
                  <option
                    key={prod.id}
                    value={`${prod.name} | ID:${prod.id} | COST:${prod.cost_price} | PRICE:${prod.selling_price}`}>
                    UGX {new Intl.NumberFormat().format(prod.selling_price)}
                  </option>
                ))}
              </datalist>
              {errors.items?.[index]?.message && (
                <HelperText
                  color="failure"
                  className="mt-1 text-xs font-medium">
                  {errors.items?.[index]?.message?.message}
                </HelperText>
              )}
              <div className="mt-2">
                <TextInput
                  placeholder="Additional text to append to product name (Optional)"
                  {...register(`items.${index}.productAppend`)}
                  theme={inputTheme}
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 mt-4">
              <div className="flex-1 min-w-[120px]">
                <Label
                  htmlFor={`items.${index}.quantity`}
                  color={errors.items?.[index]?.quantity ? "failure" : "gray"}
                  className="text-[10px] font-bold  tracking-widest block mb-1.5">
                  Quantity
                </Label>
                <TextInput
                  id={`items.${index}.quantity`}
                  placeholder="e.g 4"
                  type="number"
                  {...register(`items.${index}.quantity`)}
                  color={errors.items?.[index]?.quantity ? "failure" : "gray"}
                  theme={inputTheme}
                />
                {errors.items?.[index]?.quantity && (
                  <HelperText
                    color="failure"
                    className="mt-1 text-xs font-medium">
                    {errors.items?.[index]?.quantity?.message}
                  </HelperText>
                )}
              </div>
              <div className="flex-1 min-w-[120px]">
                <Label
                  htmlFor={`items.${index}.pricePerUnit`}
                  color={
                    errors.items?.[index]?.pricePerUnit ? "failure" : "gray"
                  }
                  className="text-[10px] font-bold  tracking-widest block mb-1.5">
                  Price per unit
                </Label>
                <TextInput
                  id={`items.${index}.pricePerUnit`}
                  placeholder="e.g 1000"
                  type="number"
                  {...register(`items.${index}.pricePerUnit`)}
                  color={
                    errors.items?.[index]?.pricePerUnit ? "failure" : "gray"
                  }
                  theme={inputTheme}
                />
                {errors.items?.[index]?.pricePerUnit && (
                  <HelperText
                    color="failure"
                    className="mt-1 text-xs font-medium">
                    {errors.items?.[index]?.pricePerUnit?.message}
                  </HelperText>
                )}
              </div>
              <div className="flex-[1.5] min-w-[200px]">
                <Label
                  color={
                    errors.items?.[index]?.discountValue ? "failure" : "gray"
                  }
                  className="text-[10px] font-bold  tracking-widest block mb-1.5">
                  Discount
                </Label>
                <div className="flex items-center gap-2">
                  <div className="w-24">
                    <Select
                      {...register(`items.${index}.discountType`)}
                      theme={selectTheme}>
                      <option value="%">%</option>
                      <option value="UGX">UGX</option>
                    </Select>
                  </div>
                  <div className="flex-1">
                    <TextInput
                      placeholder="e.g 1000"
                      type="number"
                      {...register(`items.${index}.discountValue`)}
                      color={
                        errors.items?.[index]?.discountValue
                          ? "failure"
                          : "gray"
                      }
                      theme={inputTheme}
                    />
                  </div>
                </div>
                {errors.items?.[index]?.discountValue && (
                  <HelperText
                    color="failure"
                    className="mt-1 text-xs font-medium">
                    {errors.items?.[index]?.discountValue?.message}
                  </HelperText>
                )}
              </div>

              <div className="flex items-center justify-between gap-2">
                <span>Cost Info</span>
                <Dropdown
                  inline
                  label={
                    <span className="text-xs font-bold cursor-pointer text-brand-primary dark:text-brand-accent hover:bg-brand-primary/10 dark:hover:bg-brand-accent/10 rounded-sm px-2 py-1">
                      View/Edit
                    </span>
                  }
                  arrowIcon={false}
                  theme={{
                    floating: {
                      base: "z-[100] w-72 rounded-sm border border-gray-200/50 dark:border-white/[0.1] bg-white/95 dark:bg-space-indigo-900/95 backdrop-blur-xl shadow-2xl p-4",
                      content: "space-y-4",
                    },
                  }}>
                  <div
                    className="space-y-4"
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={(e) => e.stopPropagation()}>
                    <div className="text-[10px] font-black  tracking-[0.2em] text-brand-primary dark:text-brand-accent border-b border-brand-primary/10 pb-2">
                      Cost Details (Item {index + 1})
                    </div>
                    <div>
                      <Label className="text-[10px] font-bold  tracking-widest text-gray-500 block mb-1.5">
                        Cost per unit
                      </Label>
                      <TextInput
                        type="number"
                        placeholder="0.00"
                        {...register(`items.${index}.costPerUnit`)}
                        color={
                          errors.items?.[index]?.costPerUnit
                            ? "failure"
                            : "gray"
                        }
                        theme={inputTheme}
                        onClick={(e) => e.stopPropagation()}
                        onKeyDown={(e) => e.stopPropagation()}
                      />
                      {errors.items?.[index]?.costPerUnit && (
                        <HelperText
                          color="failure"
                          className="mt-1 text-xs font-medium">
                          {errors.items?.[index]?.costPerUnit?.message}
                        </HelperText>
                      )}
                    </div>
                    <div className="bg-brand-primary/5 dark:bg-white/[0.03] p-3 rounded-sm border border-brand-primary/10 dark:border-white/[0.05]">
                      <div className="text-[10px] font-bold  tracking-widest text-gray-500">
                        Total Cost (for {watchedItems?.[index]?.quantity || 0}{" "}
                        units)
                      </div>
                      <div className="text-xl font-black text-brand-primary dark:text-brand-accent mt-1">
                        {new Intl.NumberFormat().format(
                          watchedItems?.[index]?.itemTotalCost || 0,
                        )}
                      </div>
                    </div>
                    <div className="text-[11px] font-medium text-gray-500 dark:text-gray-400 italic leading-tight pt-2 border-t border-gray-100/50 dark:border-white/[0.05]">
                      (Costs entered here only apply to this specific sale and
                      do not change the product's base price in inventory.)
                    </div>
                  </div>
                </Dropdown>
              </div>
            </div>
            <HR className="my-4 border-gray-100/50 dark:border-white/[0.05]" />
          </div>
        ))}
      </div>

      <Button
        size="sm"
        color="none"
        onClick={() =>
          append({
            id: Math.random().toString(36).substr(2, 9),
            message: "",
            productAppend: "",
            quantity: 1,
            pricePerUnit: 0,
            discountType: "%",
            discountValue: 0,
            costPerUnit: 0,
            itemTotalCost: 0,
          })
        }
        className="relative z-0 w-full mt-4 bg-brand-primary/10 text-brand-primary dark:bg-brand-primary/20 dark:text-brand-accent hover:bg-brand-primary hover:text-white transition-all duration-300 rounded-sm border border-brand-primary/20 dark:border-brand-accent/20 backdrop-blur-md py-2">
        <HiPlus className="mr-2 h-4 w-4" /> Add Item
      </Button>

      <div className="mt-8 max-w-xs">
        <Label
          htmlFor="tax-rate"
          className="text-xs font-black  tracking-wider mb-2 block text-gray-500">
          Tax Rate (%)
        </Label>
        <TextInput
          id="tax-rate"
          placeholder="e.g 18"
          type="number"
          {...register("taxRate")}
          color={errors.taxRate ? "failure" : "gray"}
          theme={inputTheme}
        />
        {errors.taxRate && (
          <HelperText color="failure" className="mt-1 text-xs font-medium">
            {errors.taxRate.message}
          </HelperText>
        )}
      </div>

      {/* Summary Section - All values from State */}
      <div className="mt-6 space-y-3 bg-white/20 dark:bg-white/[0.02] p-4 rounded-sm border border-gray-100/30 dark:border-white/[0.05]">
        <div className="flex items-center justify-between text-sm">
          <div className="text-gray-500 dark:text-gray-400 font-medium  tracking-tighter text-xs">
            Total Items
          </div>
          <div className="font-bold text-gray-900 dark:text-white">
            {watch("totalItems")}
          </div>
        </div>
        <div className="flex items-center justify-between text-sm">
          <div className="text-gray-500 dark:text-gray-400 font-medium  tracking-tighter text-xs">
            Subtotal
          </div>
          <div className="font-bold text-gray-900 dark:text-white ">
            {new Intl.NumberFormat().format(watch("subtotal"))}
          </div>
        </div>
        <div className="flex items-center justify-between text-sm">
          <div className="text-gray-500 dark:text-gray-400 font-medium  tracking-tighter text-xs">
            Tax ({watch("taxRate")}%)
          </div>
          <div className="font-bold text-red-600 dark:text-red-400">
            {new Intl.NumberFormat().format(watch("taxAmount"))}
          </div>
        </div>
        <HR className="my-2 border-gray-100/50 dark:border-white/[0.05]" />
        <div className="flex items-center justify-between">
          <div className="text-base font-black  tracking-wider text-gray-900 dark:text-white">
            Grand Total
          </div>
          <div className="text-xl font-black text-brand-primary dark:text-brand-accent">
            {new Intl.NumberFormat().format(watch("grandTotal"))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductService;
