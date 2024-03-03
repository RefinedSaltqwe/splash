"use client";
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/nextjs";
import React from "react";
import { dark } from "@clerk/themes";
import { useReadLocalStorage } from "usehooks-ts";

type LayoutClientProps = {
  agencyId: string;
  children: React.ReactNode;
};

const LayoutClient: React.FC<LayoutClientProps> = ({ agencyId, children }) => {
  const mode = useReadLocalStorage("splash-theme-mode-state");
  return (
    <ClerkProvider
      appearance={{
        baseTheme: mode === "dark" ? dark : undefined,
      }}
    >
      <SignedOut>
        <div className="flex h-screen flex-col bg-background">{children}</div>
      </SignedOut>
      <SignedIn>
        {!agencyId ? (
          <div className="flex h-auto w-full flex-col items-center justify-center bg-background p-10">
            {children}
          </div>
        ) : (
          <div className="dash flex h-full flex-col">{children}</div>
        )}
      </SignedIn>
    </ClerkProvider>
  );
};
export default LayoutClient;
