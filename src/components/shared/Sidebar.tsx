"use client";
import { sideMenuLinks } from "@/constants";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import Link from "next/link";
import React from "react";
import PrimaryNavItems from "./PrimaryNavItems";
import ScrollableElement from "./ScrollableElement";

type SidebarProps = object;

const teams = [
  { id: 1, name: "Carpentry", href: "#", initial: "C", current: false },
  { id: 2, name: "Electrical", href: "#", initial: "E", current: false },
  { id: 3, name: "Plumbing", href: "#", initial: "P", current: false },
  { id: 4, name: "Mechanical", href: "#", initial: "M", current: false },
];

const Sidebar: React.FC<SidebarProps> = () => {
  return (
    <ScrollableElement>
      <div className="flex-0 flex flex-col items-center">
        <div className="w-full px-7 py-[26px]">
          <h1 className="font-bold text-primary">Purple Yam</h1>
        </div>
      </div>
      <div className="flex flex-1 flex-col ">
        <div className="flex w-full flex-col pb-[26px] pl-6 pr-4">
          {/* ---------START NAV --------- */}
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <PrimaryNavItems title="Overview" data={sideMenuLinks} />
              <li>
                <div className="text-xs font-semibold leading-6 text-slate-400">
                  Departments
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
                  href="#"
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
