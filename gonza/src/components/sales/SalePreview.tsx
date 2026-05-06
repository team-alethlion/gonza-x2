import React, { useRef, useState } from "react";
import html2pdf from "html2pdf.js";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "flowbite-react";
import { type NewSaleFormData } from "../../types/sale";
import { generateSaleReceiptMarkdown } from "../../templates/pdf/SaleReceiptTemplate";
import { generateThermalReceiptMarkdown } from "../../templates/pdf/ThermalReceiptTemplate";
import { HiDocumentText, HiTicket } from "react-icons/hi";

interface SalePreviewProps {
  show: boolean;
  onClose: () => void;
  data: NewSaleFormData;
}

const SalePreview: React.FC<SalePreviewProps> = ({ show, onClose, data }) => {
  const receiptRef = useRef<HTMLDivElement>(null);
  const [receiptType, setReceiptType] = useState<"A4" | "Thermal">("A4");

  const handleDownloadPDF = () => {
    const element = receiptRef.current;
    if (!element) return;

    const isThermal = receiptType === "Thermal";

    const opt = {
      margin: isThermal ? [0, 0, 0, 0] : [10, 10, 10, 10],
      filename: `receipt-${receiptType.toLowerCase()}-${new Date().getTime()}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 3,
        useCORS: true,
        letterRendering: true,
        windowWidth: isThermal ? 400 : 1200,
      },
      jsPDF: {
        unit: "mm",
        format: isThermal ? [80, 200] : "a4",
        orientation: "portrait",
      },
    };

    html2pdf().from(element).set(opt).save();
  };

  return (
    <Modal
      show={show}
      onClose={onClose}
      size="4xl"
      theme={{
        content: {
          inner:
            "relative rounded-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/[0.1] shadow-2xl flex flex-col",
        },
      }}>
      <ModalHeader className="border-b border-gray-100/50 dark:border-white/[0.05] p-4">
        <div className="flex items-center justify-between w-full">
          <span className="text-sm font-black  tracking-[0.2em] text-brand-primary dark:text-brand-accent">
            Sale Receipt Preview
          </span>
        </div>
      </ModalHeader>
      <ModalBody className="p-0 bg-gray-100 dark:bg-gray-900 overflow-y-auto max-h-[80vh] flex flex-col items-center">
        {/* Type Switcher */}
        <div className="flex gap-2 p-4 w-full justify-center bg-white/50 dark:bg-black/20 backdrop-blur-sm sticky top-0 z-10 border-b border-gray-200/50 dark:border-white/5">
          <Button
            color="none"
            size="xs"
            onClick={() => setReceiptType("A4")}
            className={`rounded-sm transition-all ${
              receiptType === "A4"
                ? "bg-brand-primary text-white shadow-md"
                : "bg-gray-200 dark:bg-white/10 text-gray-600 dark:text-gray-400"
            }`}>
            <HiDocumentText className="mr-1 h-4 w-4" /> A4 Standard
          </Button>
          <Button
            color="none"
            size="xs"
            onClick={() => setReceiptType("Thermal")}
            className={`rounded-sm transition-all ${
              receiptType === "Thermal"
                ? "bg-brand-primary text-white shadow-md"
                : "bg-gray-200 dark:bg-white/10 text-gray-600 dark:text-gray-400"
            }`}>
            <HiTicket className="mr-1 h-4 w-4" /> Thermal (80mm)
          </Button>
        </div>

        {/* 🚀 Scaling Wrapper */}
        <div className="p-4 sm:p-8 w-full flex justify-center overflow-x-hidden">
          <div
            className="bg-white shadow-2xl origin-top transition-all duration-500 ease-in-out"
            style={{
              width: receiptType === "A4" ? "210mm" : "80mm",
              minHeight: receiptType === "A4" ? "297mm" : "150mm",
              transform: receiptType === "A4" ? "scale(0.65)" : "scale(1.2)",
              marginBottom: receiptType === "A4" ? "-100mm" : "20mm",
              marginTop: receiptType === "Thermal" ? "20px" : "0",
            }}>
            <div
              ref={receiptRef}
              className="prose max-w-none bg-white text-black"
              style={{
                padding: receiptType === "A4" ? "20mm" : "5mm",
                width: receiptType === "A4" ? "210mm" : "80mm",
                minHeight: receiptType === "A4" ? "297mm" : "150mm",
                boxSizing: "border-box",
              }}
              dangerouslySetInnerHTML={{
                __html:
                  receiptType === "A4"
                    ? generateSaleReceiptMarkdown(data)
                    : generateThermalReceiptMarkdown(data),
              }}
            />
          </div>
        </div>
      </ModalBody>
      <ModalFooter className="border-t border-gray-100/50 dark:border-white/[0.05] p-4 flex justify-end gap-3 bg-white dark:bg-gray-900">
        <Button
          color="none"
          size="sm"
          onClick={onClose}
          className="rounded-sm bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-white hover:bg-gray-200">
          Close
        </Button>
        <Button
          color="none"
          size="sm"
          onClick={handleDownloadPDF}
          className="rounded-sm bg-brand-primary text-white hover:bg-brand-primary-dark">
          Download {receiptType} PDF
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default SalePreview;


export default SalePreview;
