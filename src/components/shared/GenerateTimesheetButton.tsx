"use client";
import { CalendarPlus, Plus } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useGenerateTimesheetModal } from "@/stores/useGenerateTimesheetModal";

const GenerateTimesheetButton: React.FC = () => {
  const generateTimesheetModal = useGenerateTimesheetModal();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <CalendarPlus className="h-5 w-5" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-drop-downmenu">
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={generateTimesheetModal.onCreate}
        >
          <Plus className="mr-2 h-[1.2rem] w-[1.2rem]" />
          Timesheet
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
export default GenerateTimesheetButton;
