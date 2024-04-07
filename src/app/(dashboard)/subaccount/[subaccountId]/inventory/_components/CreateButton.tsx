"use client";
import GlobalModal from "@/components/drawer/GlobalModal";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import React, { useState } from "react";
import InventoryForm from "./InventoryForm";

type CreateButtonProps = {
  subaccountId: string;
  agencyId: string;
};

const CreateButton: React.FC<CreateButtonProps> = ({
  subaccountId,
  agencyId,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <>
      <Button variant={"default"} onClick={() => setIsOpen(true)}>
        <Plus size={16} className="mr-2" />
        Add item
      </Button>
      <GlobalModal
        title="Inventory item"
        description="Create or update item information."
        setIsOpen={setIsOpen}
        isOpen={isOpen}
      >
        <InventoryForm
          agencyId={agencyId}
          subaccountId={subaccountId}
          setIsOpen={setIsOpen}
        />
      </GlobalModal>
    </>
  );
};
export default CreateButton;
