"use client";
import React, { useCallback, useState } from "react";
import { AlertDescription } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import Image from "next/image";
import Link from "next/link";
import DeleteSubAccountButton from "./DeleteSubAccountButton";
import CreateSubaccountButton from "./CreateSubAccountButton";
import { useQuery } from "@tanstack/react-query";
import { getAuthUserDetails } from "@/server/actions/fetch";

type ClienDataProps = {
  agencyId: string;
};
const ClientData: React.FC<ClienDataProps> = ({ agencyId }) => {
  const { data: user } = useQuery({
    queryKey: ["getAuthUserDetails"],
    queryFn: () => getAuthUserDetails(),
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const dialogOpen = useCallback(
    (open: boolean) => {
      setIsDialogOpen(open);
    },
    [isDialogOpen],
  );
  if (!user) return;

  return (
    <AlertDialog open={isDialogOpen} onOpenChange={dialogOpen}>
      <div className="flex w-full flex-col">
        <CreateSubaccountButton
          user={user}
          id={agencyId}
          className="m-6 w-[200px] self-end"
        />
        <Command className="h-full rounded-lg bg-transparent">
          <CommandInput placeholder="Search Account..." />
          <CommandList>
            <CommandEmpty>No Results Found.</CommandEmpty>
            <CommandGroup heading="Sub Accounts">
              {!!user.Agency?.SubAccount.length ? (
                user.Agency.SubAccount.map((subaccount) => (
                  <CommandItem
                    key={subaccount!.id}
                    className="my-2 h-32 cursor-pointer rounded-lg border-[1px] border-border !bg-background p-4 text-primary transition-all hover:!bg-background"
                  >
                    <Link
                      href={`/subaccount/${subaccount!.id}`}
                      className="flex h-full w-full gap-4"
                    >
                      <div className="relative w-32">
                        <Image
                          src={subaccount!.subAccountLogo}
                          alt="subaccount logo"
                          fill
                          className="rounded-md bg-muted/50 object-contain p-4"
                        />
                      </div>
                      <div className="flex flex-col justify-between">
                        <div className="flex flex-col">
                          {subaccount!.name}
                          <span className="text-xs text-muted-foreground">
                            {subaccount!.address}
                          </span>
                        </div>
                      </div>
                    </Link>
                    <AlertDialogTrigger asChild>
                      <Button
                        size={"sm"}
                        variant={"destructive"}
                        className="w-20 !text-white hover:bg-red-600 hover:text-white"
                      >
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-left">
                          Are your absolutely sure
                        </AlertDialogTitle>
                        <AlertDescription className="text-left">
                          This action cannot be undon. This will delete the
                          subaccount and all data related to the subaccount.
                        </AlertDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter className="flex items-center">
                        <AlertDialogCancel>Close</AlertDialogCancel>
                        <AlertDialogAction className="bg-destructive hover:bg-destructive">
                          <DeleteSubAccountButton
                            dialogOpen={dialogOpen}
                            subaccountId={subaccount!.id}
                          />
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </CommandItem>
                ))
              ) : (
                <div className="p-4 text-center text-muted-foreground">
                  No Sub accounts
                </div>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </div>
    </AlertDialog>
  );
};
export default ClientData;
