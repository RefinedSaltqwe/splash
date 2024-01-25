"use client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

type ClientButtonLinkProps = {
  href: string;
  buttonName: string;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | "card_outline"
    | null
    | undefined;
};

const ClientButtonLink: React.FC<ClientButtonLinkProps> = ({
  href,
  variant = "default",
  buttonName,
}) => {
  const router = useRouter();
  return (
    <div className="mb-5">
      <Button onClick={() => router.push(href)} variant={variant}>
        <span className="sr-only">Link Button </span>
        <Plus size={16} className="mr-2" />
        {buttonName}
      </Button>
    </div>
  );
};
export default ClientButtonLink;
