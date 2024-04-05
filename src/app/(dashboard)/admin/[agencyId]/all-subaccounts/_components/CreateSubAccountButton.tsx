/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
"use client";
import SubAccountDrawer from "@/components/drawer/SubaccountDrawer";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSubaccountModal } from "@/stores/useSubaccountModal";
import {
  type Agency,
  type AgencySidebarOption,
  type SubAccount,
  type User,
} from "@prisma/client";
import SubAccountRegistrationForm from "../../_components/form/SubAccountRegistrationForm";

type Props = {
  user: User & {
    Agency:
      | (
          | Agency
          | (null & {
              SubAccount: SubAccount[];
              SideBarOption: AgencySidebarOption[];
            })
        )
      | null;
  };
  id?: string;
  className?: string;
};

const CreateSubaccountButton = ({ className, id, user }: Props) => {
  const agencyDetails = user.Agency;

  const subaccountModal = useSubaccountModal();

  if (!agencyDetails) return;

  return (
    <div className="flex w-full">
      <Button
        className={cn("flex w-full", className)}
        onClick={() => {
          subaccountModal.onCreate();
        }}
      >
        Create Sub Account
      </Button>
      <SubAccountDrawer>
        <SubAccountRegistrationForm
          agencyDetails={agencyDetails}
          userId={user.id}
          userName={user.name}
        />
      </SubAccountDrawer>
    </div>
  );
};

export default CreateSubaccountButton;
