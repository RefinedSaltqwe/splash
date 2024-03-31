"use client";

import { Popover, Transition } from "@headlessui/react";
import clsx from "clsx";
import { siteConfig } from "config/site";
import Link from "next/link";
import { Fragment } from "react";

import { SignedIn, SignedOut } from "@clerk/nextjs";
import Image from "next/image";
import { ModeToggle } from "../themeModeToggle";
import { Button } from "../ui/button";
import { redirect } from "next/navigation";

function MobileNavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Popover.Button as={Link} href={href} className="block w-full p-2">
      {children}
    </Popover.Button>
  );
}

const menuItems = [
  {
    label: "Features",
    route: "#features",
  },
  {
    label: "Testimonials",
    route: "#testimonials",
  },
  {
    label: "Pricing",
    route: "#pricing",
  },
];

function MobileNavIcon({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden="true"
      className="h-3.5 w-3.5 overflow-visible stroke-foreground"
      fill="none"
      strokeWidth={2}
      strokeLinecap="round"
    >
      <path
        d="M0 1H14M0 7H14M0 13H14"
        className={clsx(
          "origin-center transition",
          open && "scale-90 opacity-0",
        )}
      />
      <path
        d="M2 2L12 12M12 2L2 12"
        className={clsx(
          "origin-center transition",
          !open && "scale-90 opacity-0",
        )}
      />
    </svg>
  );
}

function MobileNavigation() {
  return (
    <Popover>
      <Popover.Button
        className="ui-not-focus-visible:outline-none relative z-10 flex h-8 w-8 items-center justify-center"
        aria-label="Toggle Navigation"
      >
        {({ open }) => <MobileNavIcon open={open} />}
      </Popover.Button>
      <Transition.Root>
        <Transition.Child
          as={Fragment}
          enter="duration-150 ease-out"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="duration-150 ease-in"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Popover.Overlay className="fixed inset-0 bg-slate-300/50" />
        </Transition.Child>
        <Transition.Child
          as={Fragment}
          enter="duration-150 ease-out"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="duration-100 ease-in"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <Popover.Panel
            as="div"
            className="absolute inset-x-0 top-full mt-4 flex origin-top flex-col rounded-2xl bg-white p-4 text-lg tracking-tight text-foreground shadow-xl ring-1 ring-foreground dark:bg-card"
          >
            {menuItems.map((item) => (
              <MobileNavLink key={item.label} href={item.route}>
                {item.label}
              </MobileNavLink>
            ))}
            <SignedOut>
              <hr className="m-2 border-slate-300/40" />
              <MobileNavLink href="/admin">Sign in</MobileNavLink>
            </SignedOut>
          </Popover.Panel>
        </Transition.Child>
      </Transition.Root>
    </Popover>
  );
}

export function Header() {
  return (
    <header className="w-full py-2">
      <div className="z-10 mx-auto flex max-w-7xl items-center justify-between p-4 px-4 sm:px-6 lg:px-8">
        <nav className="relative z-50 flex w-full justify-between">
          <div className="flex items-center md:gap-x-12">
            <Link href="#" aria-label="Home">
              <aside className="flex items-center gap-2">
                <Image
                  src={"/assets/images/splash-logo-750.svg"}
                  width={40}
                  height={40}
                  alt="plur logo"
                />
                <span className="text-xl font-bold"> {siteConfig.name}.</span>
              </aside>
            </Link>
            <div className="hidden md:flex md:gap-x-6">
              {menuItems.map((item) => (
                <Button
                  className="text-foreground"
                  key={item.label}
                  variant={"ghost"}
                  size={"default"}
                  asChild
                >
                  <Link href={item.route}>{item.label}</Link>
                </Button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-x-5 md:gap-x-8">
            <ModeToggle />
            <SignedIn>
              <Link
                href={"/admin"}
                className="rounded-md bg-primary p-2 px-4 text-white hover:bg-primary/80"
              >
                Dashboard
              </Link>
            </SignedIn>
            <SignedOut>
              <Button
                className="hidden text-foreground md:block"
                variant={"ghost"}
                size={"default"}
                asChild
              >
                <Link href="/admin">Sign in</Link>
              </Button>
              <Button onClick={() => redirect("/admin")} color="blue">
                <span>
                  Get started <span className="hidden lg:inline">today</span>
                </span>
              </Button>
            </SignedOut>

            <div className="-mr-1 md:hidden">
              <MobileNavigation />
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
