import type { NewSaleFormData } from "../../types/sale";

export const generateThermalReceiptMarkdown = (data: NewSaleFormData) => {
  const {
    customers = [],
    items = [],
    subtotal = 0,
    taxAmount = 0,
    grandTotal = 0,
    taxRate = 0,
    paymentStatus = "Paid",
    date = new Date(),
    receiptOptions = { includePayment: true },
  } = data;

  const formattedDate = new Date(date).toLocaleString("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return `
<div style="width: 302px; font-family: 'Courier New', Courier, monospace; font-size: 12px; color: black; background: white; padding: 15px; box-sizing: border-box; margin: 0 auto;">
  <div style="text-align: center; margin-bottom: 10px;">
    <h2 style="margin: 0; font-size: 18px; text-transform: uppercase;">${
      receiptOptions.includePayment ? "SALE RECEIPT" : "SALE INVOICE"
    }</h2>
    <p style="margin: 5px 0; font-size: 10px;">Quality & Efficiency</p>
    <div style="border-top: 1px dashed #000; margin: 10px 0;"></div>
  </div>

  <div style="margin-bottom: 10px;">
    <p style="margin: 2px 0;"><strong>Date:</strong> ${formattedDate}</p>
    ${
      receiptOptions.includePayment
        ? `<p style="margin: 2px 0;"><strong>Status:</strong> ${paymentStatus.toUpperCase()}</p>`
        : ""
    }
    ${customers.length > 0 ? `<p style="margin: 2px 0;"><strong>Customer:</strong> ${customers[0].name}</p>` : ""}
  </div>

  <div style="border-top: 1px dashed #000; margin: 10px 0;"></div>

  <table style="width: 100%; border-collapse: collapse;">
    <thead>
      <tr style="border-bottom: 1px dashed #000;">
        <th style="text-align: left; padding: 5px 0;">Item</th>
        <th style="text-align: center; padding: 5px 0;">Qty</th>
        <th style="text-align: right; padding: 5px 0;">Total</th>
      </tr>
    </thead>
    <tbody>
      ${items
        .map((item) => {
          const lineTotal = item.pricePerUnit * item.quantity;
          const finalTotal =
            item.discountType === "%"
              ? lineTotal - lineTotal * (item.discountValue / 100)
              : lineTotal - item.discountValue;

          return `
          <tr>
            <td style="padding: 5px 0; font-size: 11px;">
              ${item.message}
              ${item.productAppend ? `<br/><span style="font-size: 9px;">(${item.productAppend})</span>` : ""}
            </td>
            <td style="text-align: center; padding: 5px 0;">${item.quantity}</td>
            <td style="text-align: right; padding: 5px 0;">${new Intl.NumberFormat().format(finalTotal)}</td>
          </tr>
        `;
        })
        .join("")}
    </tbody>
  </table>

  <div style="border-top: 1px dashed #000; margin: 10px 0;"></div>

  <div style="display: flex; justify-content: space-between; margin: 5px 0;">
    <span>Subtotal:</span>
    <span>${new Intl.NumberFormat().format(subtotal)}</span>
  </div>
  <div style="display: flex; justify-content: space-between; margin: 5px 0;">
    <span>Tax (${taxRate}%):</span>
    <span>${new Intl.NumberFormat().format(taxAmount)}</span>
  </div>
  <div style="display: flex; justify-content: space-between; margin: 10px 0; font-weight: bold; font-size: 14px;">
    <span>TOTAL:</span>
    <span>UGX ${new Intl.NumberFormat().format(grandTotal)}</span>
  </div>

  <div style="border-top: 1px dashed #000; margin: 10px 0;"></div>

  <div style="text-align: center; margin-top: 20px;">
    <p style="margin: 0; font-size: 10px;">Thank you for your visit!</p>
    <p style="margin: 5px 0; font-size: 9px;">www.gonzasystems.com</p>
    <div style="margin-top: 10px;">
       <img src="https://api.qrserver.com/v1/create-qr-code/?size=60x60&data=https://gonzasystems.com" width="60" height="60" />
    </div>
  </div>
</div>
`;
};
