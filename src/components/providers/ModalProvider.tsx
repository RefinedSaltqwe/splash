import React from "react";
import DeleteCustomerModal from "../modal/DeleteCustomerModal";
import DeleteCustomersModal from "../modal/DeleteCustomersModal";
import DeleteInvoicePrompt from "@/app/(dashboard)/admin/invoice/_components/modal/DeleteInvoicePrompt";

const ModalProvider: React.FC = () => {
  return (
    <>
      <DeleteInvoicePrompt />
      <DeleteCustomerModal />
      <DeleteCustomersModal />
    </>
  );
};
export default ModalProvider;
