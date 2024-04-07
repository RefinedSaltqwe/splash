"use client";
import { useGenerateTimesheetModal } from "@/stores/useGenerateTimesheetModal";
import React from "react";
import { Button } from "../ui/button";

const GenerateTimesheetButton: React.FC = () => {
  const generateTimesheetModal = useGenerateTimesheetModal();
  return (
    <Button onClick={generateTimesheetModal.onCreate}>
      Generate timesheet
    </Button>
  );
};
export default GenerateTimesheetButton;
