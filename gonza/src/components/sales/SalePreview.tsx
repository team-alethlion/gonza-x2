import React, { useRef } from "react";
import html2pdf from "html2pdf.js";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "flowbite-react";
import type { NewSaleFormData } from "../../types/sale";
import { generateSaleReceiptMarkdown } from "../../templates/pdf/SaleReceiptTemplate";

interface SalePreviewProps {
  show: boolean;
  onClose: () => void;
  data: NewSaleFormData;
}

const SalePreview: React.FC<SalePreviewProps> = ({ show, onClose, data }) => {
  const receiptRef = useRef<HTMLDivElement>(null);

  const handleDownloadPDF = () => {
    const element = receiptRef.current;
    if (!element) return;

    const opt = {
      margin: 10,
      filename: `receipt-${new Date().getTime()}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
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
        <span className="text-sm font-black uppercase tracking-[0.2em] text-brand-primary dark:text-brand-accent">
          Sale Receipt Preview
        </span>
      </ModalHeader>
      <ModalBody className="p-0 bg-gray-50 dark:bg-gray-800 overflow-y-auto max-h-[70vh]">
        <div className="bg-white mx-auto my-8 shadow-lg" style={{ width: "210mm", minHeight: "297mm" }}>
          <div
            ref={receiptRef}
            className="prose max-w-none bg-white"
            style={{ padding: "20mm", width: "210mm", minHeight: "297mm" }}
            dangerouslySetInnerHTML={{
              __html: generateSaleReceiptMarkdown(data),
            }}
          />
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
          Download PDF
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default SalePreview;
