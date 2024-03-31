// import { CallToAction } from "@/components/site/CallToAction";
import ExtraFeatures from "@/components/site/ExtraFeatures";
import HeaderSection from "@/components/site/HeaderSection";
import Hero from "@/components/site/Hero";
import dynamic from "next/dynamic";
import React from "react";

const CallToAction = dynamic(() => import("@/components/site/CallToAction"));
const Pricing = dynamic(() => import("@/components/site/Pricing"));
const PrimaryFeatures = dynamic(
  () => import("@/components/site/PrimaryFeatures"),
);
const SecondaryFeatures = dynamic(
  () => import("@/components/site/SecondaryFeatures"),
);

type SitePageProps = {
  sitePage?: string;
};

const SitePage: React.FC<SitePageProps> = async () => {
  return (
    <div className="flex h-full w-full flex-col">
      <Hero />
      <HeaderSection
        subHeader="WHY SPLASH INNOVATIONS?"
        description="Splash Innovations is the all-in-one platform for running your SaaS business. Payments, subscriptions, global tax compliance, fraud prevention, multi-currency support, failed payment recovery, PayPal integration and more. We make running your software business easy peasy."
        classNames="text-5xl text-foreground"
      />
      <PrimaryFeatures />
      <SecondaryFeatures />
      <CallToAction />
      <ExtraFeatures />
      <Pricing />
    </div>
  );
};
export default SitePage;
