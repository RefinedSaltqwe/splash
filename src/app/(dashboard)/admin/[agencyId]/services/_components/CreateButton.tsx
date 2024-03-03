"use client";
import { Button } from "@/components/ui/button";
import { useServiceModal } from "@/stores/useServiceModal";
import { Plus } from "lucide-react";
import React from "react";

const CreateButton: React.FC = () => {
  const serviceModal = useServiceModal();

  return (
    <Button variant={"secondary"} onClick={serviceModal.onCreate}>
      <Plus size={16} className="mr-2" />
      Create Service
    </Button>
  );
};
export default CreateButton;
