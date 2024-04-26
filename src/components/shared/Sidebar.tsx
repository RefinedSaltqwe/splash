"use client";
import CreateSubaccountButton from "@/app/(dashboard)/admin/[agencyId]/all-subaccounts/_components/CreateSubAccountButton";
import { getAuthUserDetails } from "@/server/actions/fetch";
import { useCurrentUserStore } from "@/stores/useCurrentUser";
import { type SideMenuLinks } from "@/types";
import { type $Enums } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { ChevronRightIcon, ChevronsUpDown, Compass, Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import GlobalModal from "../drawer/GlobalModal";
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
import PrimaryNavItems from "./PrimaryNavItems";
import ScrollableElement from "./ScrollableElement";

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

  const [isOpen, setIsOpen] = useState<boolean>(false);

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

  const agencySideOptions: SideMenuLinks[] = [
    {
      name: "Dashboard",
      icon: "dashboard",
      href: `/admin/${id}`,
      order: 1,
      children: null,
    },
    {
      name: "Analytics",
      href: `/admin/${id}/analytics`,
      icon: "analytics",
      order: 2,
      children: null,
    },
    {
      name: "Services",
      href: `/admin/${id}/services`,
      icon: "services",
      order: 3,
      children: null,
    },
    {
      name: "Expense",
      href: `/admin/${id}/expense`,
      icon: "expense",
      order: 4,
      children: [
        {
          name: "Overview",
          href: `/admin/${id}/expense/overview`,
          order: 1,
        },
        {
          name: "Transactions",
          href: `/admin/${id}/expense/transactions`,
          order: 2,
        },
        {
          name: "Bills",
          href: `/admin/${id}/expense/bills`,
          order: 3,
        },
        {
          name: "Suppliers",
          href: `/admin/${id}/expense/suppliers`,
          order: 4,
        },
      ],
    },
    {
      name: "Team",
      href: `/admin/${id}/team`,
      icon: "shield",
      order: 5,
      children: [
        {
          name: "List",
          href: `/admin/${id}/team/list`,
          order: 1,
        },
        {
          name: "Timesheet",
          href: `/admin/${id}/team/time-sheet`,
          order: 2,
        },
        {
          name: "Schedule",
          href: `/admin/${id}/team/schedule`,
          order: 3,
        },
        {
          name: "Requests",
          href: `/admin/${id}/team/requests`,
          order: 3,
        },
      ],
    },
    {
      name: "Transactions",
      href: `/admin/${id}/transactions`,
      icon: "invoice",
      order: 5,
      children: [
        {
          name: "Quotes",
          href: `/admin/${id}/transactions/quotes`,
          order: 1,
        },
        {
          name: "Invoice",
          href: `/admin/${id}/transactions/invoice`,
          order: 2,
        },
      ],
    },
    {
      name: "Inventory",
      href: `/admin/${id}/inventory`,
      icon: "inventory",
      order: 6,
      children: null,
    },
    {
      name: "Customers",
      href: `/admin/${id}/customers`,
      icon: "customers",
      order: 7,
      children: null,
    },
    {
      name: "Suppliers",
      href: `/admin/${id}/suppliers`,
      icon: "suppliers",
      order: 8,
      children: null,
    },
    // {
    //   name: "Invoice",
    //   href: `/admin/${id}/invoice`,
    //   icon: "invoice",
    //   order: 9,
    //   children: null,
    // },
    {
      name: "Launchpad",
      icon: "clipboardIcon",
      href: `/admin/${id}/launchpad`,
      order: 10,
      children: null,
    },
    {
      name: "Subaccounts",
      icon: "person",
      href: `/admin/${id}/all-subaccounts`,
      order: 11,
      children: null,
    },
    {
      name: "Billing",
      icon: "payment",
      href: `/admin/${id}/billing`,
      order: 12,
      children: null,
    },
  ];

  const subaccountSidebarOptions = [
    {
      name: "Dashboard",
      icon: "dashboard" as $Enums.Icon,
      href: `/subaccount/${id}`,
      order: 1,
    },
    {
      name: "Launchpad",
      icon: "clipboardIcon" as $Enums.Icon,
      href: `/subaccount/${id}/launchpad`,
      order: 2,
    },
    {
      name: "Funnels",
      icon: "pipelines" as $Enums.Icon,
      href: `/subaccount/${id}/funnels`,
      order: 3,
    },
    {
      name: "Media",
      icon: "database" as $Enums.Icon,
      href: `/subaccount/${id}/media`,
      order: 4,
    },
    {
      name: "Automations",
      icon: "chip" as $Enums.Icon,
      href: `/subaccount/${id}/automations`,
      order: 5,
    },
    {
      name: "Pipelines",
      icon: "flag" as $Enums.Icon,
      href: `/subaccount/${id}/pipelines`,
      order: 6,
    },
    {
      name: "Contacts",
      icon: "person" as $Enums.Icon,
      href: `/subaccount/${id}/contacts`,
      order: 7,
    },
    {
      name: "Inventory",
      icon: "inventory" as $Enums.Icon,
      href: `/subaccount/${id}/inventory`,
      order: 8,
    },
  ];

  const subAccounts = user.Agency.SubAccount.filter((subaccount) =>
    user.Permissions.find(
      (permission) =>
        permission.subAccountId === subaccount?.id && permission.access,
    ),
  );

  return (
    <>
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
            <Button
              className="my-4 flex w-full items-center justify-between py-8 hover:!bg-muted-foreground/5"
              variant="ghost"
              onClick={() => setIsOpen(true)}
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
                  subaccountSideOptions={subaccountSidebarOptions}
                />
                {/* <li>
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
              </li> */}
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
      <GlobalModal isOpen={isOpen} setIsOpen={setIsOpen}>
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
                      <div className="flex py-3">
                        <ChevronRightIcon
                          className="h-5 w-5 flex-none self-end text-muted-foreground"
                          aria-hidden="true"
                        />
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
                          <div className="flex py-3">
                            <ChevronRightIcon
                              className="h-5 w-5 flex-none self-end text-muted-foreground"
                              aria-hidden="true"
                            />
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
                          <div className="flex py-3">
                            <ChevronRightIcon
                              className="h-5 w-5 flex-none self-end text-muted-foreground"
                              aria-hidden="true"
                            />
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
            <CreateSubaccountButton user={user} />
          )}
        </Command>
      </GlobalModal>
    </>
  );
};
export default Sidebar;
