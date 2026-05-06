import type { NewSaleFormData } from "../../types/sale";

export const generateSaleReceiptMarkdown = (data: NewSaleFormData) => {
  const {
    customers = [],
    items = [],
    subtotal = 0,
    taxAmount = 0,
    grandTotal = 0,
    taxRate = 0,
    paymentStatus = "Paid",
    saleSource = "",
    date = new Date(),
  } = data;

  const formattedDate = new Date(date).toLocaleDateString("en-GB", {
    dateStyle: "full",
  });

  return `
<div style="font-family: sans-serif; color: #333; max-width: 800px; margin: auto; padding: 20px;">

  <!-- Header Section -->
  <div style="text-align: center; border-bottom: 2px solid #eee; padding-bottom: 20px; margin-bottom: 30px;">
    <h1 style="margin: 0; font-size: 28px; letter-spacing: 2px; color: #000;">SALE RECEIPT</h1>
    <p style="margin: 5px 0; color: #666; font-size: 14px;">Gonza Systems - Professional Billing</p>
    <p style="margin: 5px 0; font-weight: bold;">${formattedDate}</p>
  </div>

  <!-- Client & Info -->
  <div style="display: flex; justify-content: space-between; margin-bottom: 40px;">
    <div style="width: 60%;">
      <h3 style="font-size: 12px; font-weight: 800; text-transform: ; color: #888; margin-bottom: 10px; border-bottom: 1px solid #eee; padding-bottom: 5px;">Client Information</h3>
      ${customers
        .map(
          (c, i) => `
        <div style="margin-bottom: 15px;">
          <p style="margin: 0; font-weight: bold; font-size: 16px;">${
            c.name || "N/A"
          }</p>
          <p style="margin: 2px 0; font-size: 13px;">${c.address1 || ""}${
            c.address2 ? ", " + c.address2 : ""
          }</p>
          <p style="margin: 2px 0; font-size: 13px;">${c.contact || "N/A"} | ${
            c.email || "N/A"
          }</p>
        </div>
      `,
        )
        .join("")}
    </div>
    <div style="width: 35%; text-align: right;">
       <h3 style="font-size: 12px; font-weight: 800; text-transform: ; color: #888; margin-bottom: 10px; border-bottom: 1px solid #eee; padding-bottom: 5px;">Receipt Details</h3>
       <p style="margin: 0; font-size: 13px;"><strong>Status:</strong> ${paymentStatus.toUpperCase()}</p>
       ${saleSource ? `<p style="margin: 5px 0; font-size: 13px;"><strong>Source:</strong> ${saleSource}</p>` : ""}
       <p style="margin: 5px 0; font-size: 13px;"><strong>Currency:</strong> UGX</p>
    </div>
  </div>

  <!-- Items Table -->
  <table style="width: 100%; border-collapse: collapse; margin-bottom: 40px;">
    <thead>
      <tr style="background-color: #f9fafb; border-bottom: 2px solid #eee;">
        <th style="text-align: left; padding: 12px 8px; font-size: 12px; text-transform: ;">Description</th>
        <th style="text-align: center; padding: 12px 8px; font-size: 12px; text-transform: ;">Qty</th>
        <th style="text-align: right; padding: 12px 8px; font-size: 12px; text-transform: ;">Unit Price</th>
        <th style="text-align: right; padding: 12px 8px; font-size: 12px; text-transform: ;">Discount</th>
        <th style="text-align: right; padding: 12px 8px; font-size: 12px; text-transform: ;">Total</th>
      </tr>
    </thead>
    <tbody>
      ${items
        .map((item) => {
          const discountLabel =
            item.discountType === "%"
              ? `${item.discountValue}%`
              : `${new Intl.NumberFormat().format(item.discountValue)}`;
          const lineTotal = item.pricePerUnit * item.quantity;
          const finalTotal =
            item.discountType === "%"
              ? lineTotal - lineTotal * (item.discountValue / 100)
              : lineTotal - item.discountValue;

          return `
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 12px 8px; vertical-align: top;">
              <div style="font-weight: bold; font-size: 14px;">${
                item.message
              }</div>
              ${
                item.productAppend
                  ? `<div style="font-size: 11px; color: #666; margin-top: 2px;">${item.productAppend}</div>`
                  : ""
              }
            </td>
            <td style="text-align: center; padding: 12px 8px; font-size: 14px;">${
              item.quantity
            }</td>
            <td style="text-align: right; padding: 12px 8px; font-size: 14px;">${new Intl.NumberFormat().format(
              item.pricePerUnit,
            )}</td>
            <td style="text-align: right; padding: 12px 8px; font-size: 14px; color: #dc2626;">${discountLabel}</td>
            <td style="text-align: right; padding: 12px 8px; font-weight: bold; font-size: 14px;">${new Intl.NumberFormat().format(
              finalTotal,
            )}</td>
          </tr>
        `;
        })
        .join("")}
    </tbody>
  </table>

  <!-- Summary Table (More reliable than flex for PDF capture) -->
  <table style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="width: 60%;"></td>
      <td style="width: 40%;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; border-bottom: 1px solid #eee; color: #666; font-size: 14px;">Subtotal</td>
            <td style="padding: 8px 0; border-bottom: 1px solid #eee; text-align: right; font-weight: bold;">UGX ${new Intl.NumberFormat().format(
              subtotal,
            )}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; border-bottom: 1px solid #eee; color: #666; font-size: 14px;">Tax (${taxRate}%)</td>
            <td style="padding: 8px 0; border-bottom: 1px solid #eee; text-align: right; font-weight: bold;">UGX ${new Intl.NumberFormat().format(
              taxAmount,
            )}</td>
          </tr>
          <tr style="background-color: #f9fafb;">
            <td style="padding: 15px; font-size: 16px; font-weight: 800; text-transform: ;">Grand Total</td>
            <td style="padding: 15px; font-size: 20px; font-weight: 900; text-align: right; color: #000;">UGX ${new Intl.NumberFormat().format(
              grandTotal,
            )}</td>
          </tr>
        </table>
      </td>
    </tr>
  </table>

  <!-- Footer -->
  <div style="margin-top: 60px; text-align: center; border-top: 1px solid #eee; pt-20px;">
    <p style="font-size: 12px; color: #999; margin-bottom: 5px;">Thank you for your business!</p>
    <p style="font-size: 10px; color: #ccc; text-transform: ; letter-spacing: 1px;">Generated by Gonza Systems</p>
  </div>

</div>
`;
};
