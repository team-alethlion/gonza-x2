import { Label, Select, Textarea, ToggleSwitch } from "flowbite-react";
import React, { useState } from "react";

const Payment = () => {
  const [switch1, setSwitch1] = useState(false);
  return (
    <div className="border border-gray-200 rounded-sm p-4">
      <span>Payment Information</span>
      <div>
        <Label>Payment Status</Label>
        <Select>
          <option>Paid</option>
          <option>Not Paid</option>
          <option>Quote</option>
          <option>Installment Sale </option>
        </Select>
      </div>
      <div className="border border-gray-200 rounded-sm p-4 mt-4">
        <div className="flex items-center justify-between">
          <span>LInk to Cash Account</span>
          <ToggleSwitch checked={switch1} onChange={setSwitch1} />
        </div>
        <span>Record this payment in a cash account</span>
      </div>

      <div>
        <Label>Sales Source</Label>
        <Select>{/* got from database */}</Select>
      </div>
      <div>
        <Label>Notes</Label>
        <Textarea placeholder="Additional notes about the payment" rows={4} />
      </div>
    </div>
  );
};

export default Payment;
