"use client";
import { cn } from "@/lib/utils";
import { useMobileSidebar } from "@/stores/useMobileSidebar";
import { type NotificationWithUser } from "@/types/stripe";
import { UserButton } from "@clerk/nextjs";
import { type Role } from "@prisma/client";
import { Globe } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { ModeToggle } from "../themeModeToggle";
import { Button } from "../ui/button";
import NotificationMenu from "./NotificationMenu";

type HeaderProps = {
  notifications: NotificationWithUser | [];
  role?: Role;
};

const Header: React.FC<HeaderProps> = ({ notifications, role }) => {
  const onOpen = useMobileSidebar((state) => state.onOpen);

  return (
    <header className="flex h-full w-full items-center bg-background/60 px-2 backdrop-blur md:px-10 dark:bg-background/60">
      <div
        className={cn(
          " flex w-full items-center justify-between",
          // "wrapper mx-auto md:max-w-screen-2xl",
          "py-5",
        )}
      >
        <div className="flex shrink-0 items-center space-x-2">
          <Button
            variant={"ghost"}
            size={"icon"}
            className="flex shrink-0 rounded-full md:hidden "
            onClick={onOpen}
          >
            <Image
              src="/assets/icons/menu.svg"
              alt="menu"
              loading="lazy"
              width={24}
              height={24}
              className="h-[1.2rem] w-[1.2rem] scale-100 dark:invert"
            />
          </Button>
        </div>

        <div className="flex w-full items-center justify-end space-x-2 align-middle md:flex md:w-auto">
          <ModeToggle />
          <NotificationMenu notifications={notifications} role={role} />

          <Button
            className="rounded-full text-foreground"
            variant={"ghost"}
            size={"icon"}
            asChild
          >
            <Link href={"/"}>
              <Globe className="h-5 w-5" />
            </Link>
          </Button>
          {/* {menuItems.map((item) => (
            <Button
              className="text-foreground"
              key={item.label}
              variant={"ghost"}
              size={"default"}
              asChild
            >
              <Link href={item.route}>{item.label}</Link>
            </Button>
          ))} */}
          {/* <UserMenu /> */}
          <div className="pr-2">
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </div>
    </header>
  );
};
export default Header;
