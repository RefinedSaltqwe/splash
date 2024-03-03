/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
"use client";
import SubAccountDrawer from "@/components/drawer/SubaccountDrawer";
import { Button } from "@/components/ui/button";
import { useSubaccountModal } from "@/stores/useSubaccountModal";
import {
  type Agency,
  type AgencySidebarOption,
  type SubAccount,
  type User,
} from "@prisma/client";
import { PlusCircleIcon } from "lucide-react";
import { twMerge } from "tailwind-merge";
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
  className: string;
};

const CreateSubaccountButton = ({ className, id, user }: Props) => {
  const agencyDetails = user.Agency;

  const subaccountModal = useSubaccountModal();

  if (!agencyDetails) return;

  return (
    <>
      <Button
        className={twMerge("flex w-full gap-4", className)}
        onClick={() => {
          subaccountModal.onCreate();
        }}
      >
        <PlusCircleIcon size={15} />
        Create Sub Account
      </Button>
      <SubAccountDrawer>
        <SubAccountRegistrationForm
          agencyDetails={agencyDetails}
          userId={user.id}
          userName={user.name}
        />
      </SubAccountDrawer>
    </>
  );
};

export default CreateSubaccountButton;
