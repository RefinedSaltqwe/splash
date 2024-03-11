import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { siteConfig } from "config/site";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { ModeToggle } from "../themeModeToggle";

const Navigation: React.FC = async () => {
  return (
    <div className="fixed left-0 right-0 top-0 z-10 flex items-center justify-between bg-background p-4">
      <aside className="flex items-center gap-2">
        <Image
          src={"/assets/images/splash-logo-750.svg"}
          width={40}
          height={40}
          alt="plur logo"
        />
        <span className="text-xl font-bold"> {siteConfig.name}.</span>
      </aside>
      <nav className="absolute left-[50%] top-[50%] hidden translate-x-[-50%] translate-y-[-50%] transform md:block">
        <ul className="flex items-center justify-center gap-8">
          <Link href={"#"}>Pricing</Link>
          <Link href={"#"}>About</Link>
          <Link href={"#"}>Documentation</Link>
          <Link href={"#"}>Features</Link>
        </ul>
      </nav>
      <aside className="flex items-center gap-2">
        <Link
          href={"/admin"}
          className="rounded-md bg-primary p-2 px-4 text-white hover:bg-primary/80"
        >
          <SignedIn>Dashboard</SignedIn>
          <SignedOut>Login</SignedOut>
        </Link>
        <UserButton />
        <ModeToggle />
      </aside>
    </div>
  );
};
export default Navigation;
