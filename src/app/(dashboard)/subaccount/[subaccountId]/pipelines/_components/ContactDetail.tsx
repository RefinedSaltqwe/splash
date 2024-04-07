import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { type TicketWithTags } from "@/types/stripe";
import { Contact2 } from "lucide-react";
import React from "react";

type ContactDetailProps = {
  ticket: TicketWithTags[0];
};

const ContactDetail: React.FC<ContactDetailProps> = ({ ticket }) => {
  return (
    <div className="flex justify-between space-x-4">
      <Avatar>
        <AvatarImage />
        <AvatarFallback className="bg-primary text-white">
          {ticket.Customer?.name.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="space-y-1">
        <h4 className="text-sm font-semibold">{ticket.Customer?.name}</h4>
        <p className="text-sm text-muted-foreground">
          {ticket.Customer?.email}
        </p>
        <div className="flex items-center pt-2">
          <Contact2 className="mr-2 h-4 w-4 opacity-70" />
          <span className="text-xs text-muted-foreground">
            Joined {ticket.Customer?.createdAt.toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
};
export default ContactDetail;
