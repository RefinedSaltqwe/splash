"use client";
import GlobalModal from "@/components/drawer/GlobalModal";
import React, { useState } from "react";
import SendInvitationComponent from "../create/_components/SendInvitation";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

type SendInvitationButtonProps = {
  agencyId: string;
};

const SendInvitationButton: React.FC<SendInvitationButtonProps> = ({
  agencyId,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <div>
      <Button variant={"default"} onClick={() => setIsOpen(true)}>
        <span className="sr-only">Link Button </span>
        <Plus size={16} className="mr-2" />
        Invite User
      </Button>
      <GlobalModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        title="Invitation"
        description="An invitation will be sent to the user. Users who already have an invitation sent out to their email, will not receive another invitation."
      >
        <SendInvitationComponent setIsOpen={setIsOpen} agencyId={agencyId} />
      </GlobalModal>
    </div>
  );
};
export default SendInvitationButton;
