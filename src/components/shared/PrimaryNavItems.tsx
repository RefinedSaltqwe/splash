"use client";
import { type SideMenuLinks } from "@/constants";
import { cn } from "@/lib/utils";
import { Disclosure } from "@headlessui/react";
import { ChevronRightIcon, Dot } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

type PrimaryNavItemsProps = {
  title: string;
  data: SideMenuLinks[];
};

const PrimaryNavItems: React.FC<PrimaryNavItemsProps> = ({ title, data }) => {
  const pathname = usePathname();

  return (
    <li>
      <div className="text-xs font-semibold leading-6 text-slate-400">
        {title}
      </div>
      <ul role="list" className="-mx-2 space-y-1">
        {data.map((item) => {
          return (
            <li key={item.name} className="rounded-lg">
              {item.children.length === 0 ? (
                <Link
                  href={item.href}
                  className={cn(
                    pathname.includes(item.href)
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted-foreground/5",
                    "group flex gap-x-3 rounded-md p-3 text-sm font-semibold leading-6",
                  )}
                >
                  <item.icon
                    className={cn(
                      item.href === pathname
                        ? "text-primary"
                        : "text-muted-foreground",
                      "h-6 w-6 shrink-0",
                    )}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              ) : (
                <Disclosure as="div" defaultOpen={pathname.includes(item.href)}>
                  {({ open }) => (
                    <>
                      <Disclosure.Button
                        className={cn(
                          pathname.includes(item.href)
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:bg-muted-foreground/5",
                          "flex w-full items-center justify-between gap-x-3 rounded-md p-3 text-left text-sm font-semibold leading-6",
                        )}
                      >
                        <span className="flex gap-x-3">
                          <item.icon aria-hidden="true" />
                          {item.name}
                        </span>
                        <ChevronRightIcon
                          className={cn(
                            open
                              ? item.href === pathname
                                ? "rotate-90 text-primary"
                                : "rotate-90"
                              : item.href === pathname
                                ? "text-primary"
                                : "text-muted-foreground",
                            "h-5 w-5 shrink-0",
                          )}
                          aria-hidden="true"
                        />
                      </Disclosure.Button>
                      <Disclosure.Panel as="ul">
                        {item.children.map((subItem) => {
                          return (
                            <li key={subItem.name} className="my-1">
                              <Link
                                href={subItem.href}
                                className={cn(
                                  pathname.includes(subItem.href)
                                    ? "text-primary hover:bg-muted-foreground/5"
                                    : "text-muted-foreground hover:bg-muted-foreground/5",
                                  "flex items-center rounded-md p-3 text-sm font-medium leading-6",
                                )}
                              >
                                <span className="flex gap-x-3">
                                  <Dot
                                    height={24}
                                    width={24}
                                    className={cn(
                                      pathname.includes(subItem.href)
                                        ? "scale-[2] text-primary transition-transform delay-0 duration-200 ease-in-out"
                                        : "scale-[1] text-muted-foreground/50 transition-transform delay-0 duration-200 ease-in-out",
                                    )}
                                  />
                                  <span
                                    className={cn(
                                      pathname.includes(subItem.href)
                                        ? "text-foreground"
                                        : "text-muted-foreground",
                                    )}
                                  >
                                    {subItem.name}
                                  </span>
                                </span>
                              </Link>
                            </li>
                          );
                        })}
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>
              )}
            </li>
          );
        })}
      </ul>
    </li>
  );
};
export default PrimaryNavItems;
