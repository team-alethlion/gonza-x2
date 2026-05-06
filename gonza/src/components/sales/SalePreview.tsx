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
      margin: 0,
      filename: `receipt-${receiptType.toLowerCase()}-${new Date().getTime()}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        letterRendering: true,
        windowWidth: isThermal ? 302 : 794,
      },
      jsPDF: {
        unit: "mm",
        format: isThermal ? [80, Math.max(200, (element.offsetHeight * 25.4) / 96 + 20)] : "a4",
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
            "relative rounded-sm bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-200 dark:border-white/[0.1] shadow-2xl flex flex-col",
        },
      }}>
      <ModalHeader className="border-b border-gray-100/50 dark:border-white/[0.05] p-4">
        <div className="flex items-center justify-between w-full pr-8">
          <span className="text-sm font-black uppercase tracking-[0.2em] text-brand-primary dark:text-brand-accent">
            Receipt Preview
          </span>
          
          <div className="flex p-1 bg-gray-100/50 dark:bg-black/40 rounded-sm border border-gray-200/50 dark:border-white/5">
            <button
              onClick={() => setReceiptType("A4")}
              className={`px-3 py-1 text-[10px] font-bold transition-all rounded-sm uppercase tracking-wider ${
                receiptType === "A4"
                  ? "bg-brand-primary text-white shadow-sm"
                  : "text-gray-500 dark:text-gray-400 hover:text-brand-primary dark:hover:text-brand-accent"
              }`}>
              Standard A4
            </button>
            <button
              onClick={() => setReceiptType("Thermal")}
              className={`px-3 py-1 text-[10px] font-bold transition-all rounded-sm uppercase tracking-wider ${
                receiptType === "Thermal"
                  ? "bg-brand-primary text-white shadow-sm"
                  : "text-gray-500 dark:text-gray-400 hover:text-brand-primary dark:hover:text-brand-accent"
              }`}>
              Thermal 80mm
            </button>
          </div>
        </div>
      </ModalHeader>
      <ModalBody className="p-0 bg-gray-100/30 dark:bg-black/20 overflow-y-auto max-h-[80vh] flex flex-col items-center">
        {/* 🚀 Scaling Wrapper */}
        <div className="p-4 sm:p-8 w-full flex justify-center overflow-x-hidden">
          <div
            className={`${
              receiptType === "A4"
                ? "bg-white shadow-2xl"
                : "bg-transparent shadow-none"
            } origin-top transition-all duration-500 ease-in-out`}
            style={{
              width: receiptType === "A4" ? "210mm" : "302px",
              minHeight: receiptType === "A4" ? "297mm" : "auto",
              transform: receiptType === "A4" ? "scale(0.65)" : "scale(1.1)",
              marginBottom: receiptType === "A4" ? "-100mm" : "20mm",
              marginTop: receiptType === "Thermal" ? "10px" : "0",
            }}>
            <div
              ref={receiptRef}
              className={`${
                receiptType === "A4" ? "prose max-w-none bg-white" : ""
              } text-black`}
              style={{
                padding: receiptType === "A4" ? "20mm" : "0",
                width: receiptType === "A4" ? "210mm" : "302px",
                minHeight: receiptType === "A4" ? "297mm" : "auto",
                boxSizing: "border-box",
                backgroundColor: "white",
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
      <ModalFooter className="border-t border-gray-100/50 dark:border-white/[0.05] p-4 flex justify-end gap-3 bg-white/50 dark:bg-gray-900/50 backdrop-blur-md">
        <Button
          color="none"
          size="sm"
          onClick={onClose}
          className="rounded-sm bg-gray-100/50 dark:bg-white/5 text-gray-700 dark:text-white hover:bg-gray-200 transition-all">
          Close
        </Button>
        <Button
          color="none"
          size="sm"
          onClick={handleDownloadPDF}
          className="rounded-sm bg-brand-primary text-white hover:bg-brand-primary-dark transition-all shadow-lg hover:shadow-brand-primary/20">
          Download {receiptType}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default SalePreview;
