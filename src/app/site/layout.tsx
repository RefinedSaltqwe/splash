import Footer from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import React from "react";

const SiteLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ClerkProvider appearance={{ baseTheme: dark }}>
      <main className="h-auto bg-background">
        <Header />
        {children}
        <Footer />
      </main>
    </ClerkProvider>
  );
};

export default SiteLayout;
