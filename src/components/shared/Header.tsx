import { headerLinks } from "@/constants";
import { useMobileSidebar } from "@/stores/useMobileSidebar";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { ModeToggle } from "../themeModeToggle";
import { Button } from "../ui/button";
import UserMenu from "./UserMenu";
import { cn } from "@/lib/utils";

type HeaderProps = object;

const Header: React.FC<HeaderProps> = () => {
  const onOpen = useMobileSidebar((state) => state.onOpen);
  const menuItems = headerLinks;

  return (
    <header className="flex h-full w-full items-center bg-background/60 px-10 backdrop-blur dark:bg-background/60">
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
              width={24}
              height={24}
              className="h-[1.2rem] w-[1.2rem] scale-100 dark:invert"
            />
          </Button>
        </div>

        <div className="flex w-full items-center justify-end space-x-2 align-middle md:flex md:w-auto">
          <ModeToggle />
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
          <UserMenu />
        </div>
      </div>
    </header>
  );
};
export default Header;
