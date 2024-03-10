"use client";
import CreateSubaccountButton from "@/app/(dashboard)/admin/[agencyId]/all-subaccounts/_components/CreateSubAccountButton";
import { cn } from "@/lib/utils";
import { getAuthUserDetails } from "@/server/actions/fetch";
import { useQuery } from "@tanstack/react-query";
import { ChevronsUpDown, Compass, Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { AspectRatio } from "../ui/aspect-ratio";
import { Button } from "../ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import PrimaryNavItems from "./PrimaryNavItems";
import ScrollableElement from "./ScrollableElement";
import { useCurrentUserStore } from "@/stores/useCurrentUser";

type SidebarProps = {
  defaultOpen?: boolean;
  id?: string;
  type?: "agency" | "subaccount";
};

const teams = [
  { id: 1, name: "Carpentry", href: "#", initial: "C", current: false },
  { id: 2, name: "Electrical", href: "#", initial: "E", current: false },
  { id: 3, name: "Plumbing", href: "#", initial: "P", current: false },
  { id: 4, name: "Mechanical", href: "#", initial: "M", current: false },
];

const Sidebar: React.FC<SidebarProps> = ({ id, type, defaultOpen = true }) => {
  const { data: user } = useQuery({
    queryKey: ["getAuthUserDetails"],
    queryFn: () => getAuthUserDetails(),
  });

  const agencyId = useCurrentUserStore((state) => state.agencyId);
  const subaccountId = useCurrentUserStore((state) => state.subaccountId);

  if (!user) return null;

  if (!user.Agency) return;
  const details =
    type === "agency"
      ? user?.Agency
      : user?.Agency.SubAccount.find((subaccount) => subaccount?.id === id);

  const isWhiteLabeledAgency = user.Agency.whiteLabel;
  if (!details) return;

  let sideBarLogo = user.Agency.agencyLogo || "/assets/images/plura-logo.svg";

  if (!isWhiteLabeledAgency) {
    if (type === "subaccount") {
      sideBarLogo =
        user?.Agency.SubAccount.find((subaccount) => subaccount?.id === id)
          ?.subAccountLogo ?? user.Agency.agencyLogo;
    }
  }

  const subaccountSideOptions =
    user.Agency.SubAccount.find((subaccount) => subaccount?.id === id)
      ?.SidebarOption ?? [];

  const agencySideOptions = user.Agency.SidebarOption || [];

  const subAccounts = user.Agency.SubAccount.filter((subaccount) =>
    user.Permissions.find(
      (permission) =>
        permission.subAccountId === subaccount?.id && permission.access,
    ),
  );

  return (
    <ScrollableElement>
      <div className="flex-0 flex flex-col items-center">
        <div className="flex w-full flex-col items-start justify-start pl-6 pr-4 pt-[26px]">
          <AspectRatio ratio={16 / 4}>
            <Image
              src={sideBarLogo}
              alt="Sidebar Logo"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="rounded-md object-contain"
            />
          </AspectRatio>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                className="my-4 flex w-full items-center justify-between py-8 hover:!bg-muted-foreground/5"
                variant="ghost"
              >
                <div className="flex items-center gap-2 text-left">
                  <Compass className="h-6 w-6 shrink-0 text-muted-foreground" />
                  <div className="flex w-[150px] flex-col">
                    <span className="overflow-hidden text-ellipsis whitespace-nowrap">
                      {details.name}
                    </span>
                    <span className="overflow-hidden text-ellipsis whitespace-nowrap text-muted-foreground">
                      {details.address}
                    </span>
                  </div>
                </div>
                <div>
                  <ChevronsUpDown size={16} className="text-muted-foreground" />
                </div>
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="h-100 bg-drop-downmenu z-[200] mt-4 w-80"
              role="dialog"
            >
              <Command className="rounded-lg bg-background/5 backdrop-blur">
                <CommandInput placeholder="Search Accounts..." />
                <CommandList className="pb-16 ">
                  <CommandEmpty> No results found</CommandEmpty>
                  {(user?.role === "AGENCY_OWNER" ||
                    user?.role === "AGENCY_ADMIN" ||
                    user?.role === "SUPER_ADMIN") &&
                    user?.Agency && (
                      <CommandGroup heading="Agency">
                        <CommandItem className="broder-[1px] my-2 cursor-pointer rounded-md border-border !bg-transparent p-2 text-primary transition-all hover:!bg-muted-foreground/5">
                          <Link
                            href={`/admin/${user?.Agency?.id}`}
                            className="flex h-full w-full gap-4"
                          >
                            <div className="relative w-16">
                              <Image
                                src={user?.Agency?.agencyLogo}
                                alt="Agency Logo"
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                className="rounded-md object-contain"
                              />
                            </div>
                            <div className="flex flex-1 flex-col text-foreground">
                              {user?.Agency?.name}
                              <span className="text-muted-foreground">
                                {user?.Agency?.address}
                              </span>
                            </div>
                          </Link>
                        </CommandItem>
                      </CommandGroup>
                    )}
                  <CommandGroup heading="Accounts">
                    {!!subAccounts
                      ? subAccounts.map((subaccount) => (
                          <CommandItem key={subaccount!.id}>
                            {defaultOpen ? (
                              <Link
                                href={`/subaccount/${subaccount!.id}`}
                                className="flex h-full w-full gap-4"
                              >
                                <div className="relative w-16">
                                  <Image
                                    src={subaccount!.subAccountLogo}
                                    alt="subaccount! Logo"
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    className="rounded-md object-contain"
                                  />
                                </div>
                                <div className="flex flex-1 flex-col">
                                  {subaccount!.name}
                                  <span className="text-muted-foreground">
                                    {subaccount!.address}
                                  </span>
                                </div>
                              </Link>
                            ) : (
                              <Link
                                href={`/subaccount/${subaccount!.id}`}
                                className="flex h-full w-full gap-4"
                              >
                                <div className="relative w-16">
                                  <Image
                                    src={subaccount!.subAccountLogo}
                                    alt="subaccount Logo"
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    className="rounded-md object-contain"
                                  />
                                </div>
                                <div className="flex flex-1 flex-col">
                                  {subaccount!.name}
                                  <span className="text-muted-foreground">
                                    {subaccount!.address}
                                  </span>
                                </div>
                              </Link>
                            )}
                          </CommandItem>
                        ))
                      : "No Accounts"}
                  </CommandGroup>
                </CommandList>
                {(user?.role === "AGENCY_OWNER" ||
                  user?.role === "AGENCY_ADMIN" ||
                  user?.role === "SUPER_ADMIN") && (
                  <CreateSubaccountButton
                    user={user}
                    className="m-6 w-[200px] self-center"
                  />
                )}
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div className="flex flex-1 flex-col ">
        <div className="flex w-full flex-col pb-[26px] pl-6 pr-4">
          {/* ---------START NAV --------- */}
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <PrimaryNavItems
                title="Overview"
                type={type}
                agencySideOptions={agencySideOptions}
                subaccountSideOptions={subaccountSideOptions}
              />
              <li>
                <div className="text-xs font-semibold leading-6 text-slate-400">
                  Sub-accounts
                </div>
                <ul role="list" className="-mx-2 mt-2 space-y-1">
                  {teams.map((team) => (
                    <li key={team.name}>
                      <Link
                        href={team.href}
                        className={cn(
                          team.current
                            ? "bg-primary/5 text-primary"
                            : "text-muted-foreground hover:bg-muted-foreground/5",
                          "group flex gap-x-3 rounded-md p-3 text-sm font-semibold leading-6",
                        )}
                      >
                        <span
                          className={cn(
                            team.current
                              ? "border-primary text-primary"
                              : "border-border text-muted-foreground group-hover:border-primary",
                            "flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border bg-white text-[0.625rem] font-medium dark:bg-background",
                          )}
                        >
                          {team.initial}
                        </span>
                        <span className="truncate">{team.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
              <li className="mt-auto">
                <Link
                  href={
                    type === "agency"
                      ? `/admin/${agencyId}/settings`
                      : `/subaccount/${subaccountId}/settings`
                  }
                  className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-muted-foreground hover:text-primary"
                >
                  <Menu
                    className="h-6 w-6 shrink-0 text-slate-400 group-hover:text-primary"
                    aria-hidden="true"
                  />
                  Settings
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </ScrollableElement>
  );
};
export default Sidebar;
