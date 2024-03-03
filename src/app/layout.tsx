import DrawerProvider from "@/components/providers/DrawerProvider";
import ModalProvider from "@/components/providers/ModalProvider";
import QueryProvider from "@/components/providers/QueryProvider";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import "@/styles/globals.css";
import { siteConfig } from "config/site";
import { type Metadata } from "next";
import { Inter } from "next/font/google";
import NextTopLoader from "nextjs-toploader";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: `${siteConfig.name} Innovations`,
  description: siteConfig.description,
  icons: [{ rel: "icon", url: siteConfig.icon, href: siteConfig.icon }],
  other: {
    "theme-color": siteConfig.theme_color,
    "color-scheme": siteConfig.color_scheme,
    "twitter:image": siteConfig.twitter_image,
    "twitter:card": siteConfig.twitter_card,
    "og:url": siteConfig.og_url,
    "og:image": siteConfig.og_image,
    "og:type": siteConfig.og_type,
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen font-sans", inter.variable)}>
        <NextTopLoader
          color="#3c82f6"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0"
          zIndex={1600}
          showAtBottom={false}
        />
        <ThemeProvider
          attribute="class"
          defaultTheme={"light"}
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            {children}
            <Toaster expand={false} richColors={true} position="bottom-right" />
            <DrawerProvider />
            <ModalProvider />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
