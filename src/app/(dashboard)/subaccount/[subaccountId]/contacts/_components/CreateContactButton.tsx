"use client";
import GlobalModal from "@/components/drawer/GlobalModal";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import ContactUserForm from "./form/ContactUserForm";

type CreateContactButtonProps = {
  subaccountId: string;
};

const CreateContactButton: React.FC<CreateContactButtonProps> = ({
  subaccountId,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Create Contact</Button>
      <GlobalModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        title="Create Or Update Contact information"
        description="Contacts are like customers. You can assign tickets to contacts and set a value for each contact in the ticket."
      >
        <ContactUserForm subaccountId={subaccountId} modal={true} />
      </GlobalModal>
    </>
  );
};
export default CreateContactButton;
