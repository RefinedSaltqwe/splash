"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Tab } from "@headlessui/react";
import clsx from "clsx";

import backgroundImage from "../../../public/assets/images/background-features.jpg";
import screenshotExpenses from "../../../public/assets/images/expenses.png";
import screenshotPayroll from "../../../public/assets/images/payroll.png";
import screenshotReporting from "../../../public/assets/images/reporting.png";
import screenshotVatReturns from "../../../public/assets/images/vat-returns.png";
import { Container } from "../shared/Containers";
import { motion } from "framer-motion";

const features = [
  {
    title: "Time Tracking",
    description:
      "Whether you need detailed reports on work hours or streamlined holiday tracking with calendar integration, Splash Innovations offers a comprehensive solution for managing employee time, leave, and absences with ease.",
    image: screenshotPayroll,
  },
  {
    title: "Invoice",
    description:
      "All of your invoice organized into one place, as long as you don't mind typing in the data by hand.",
    image: screenshotExpenses,
  },
  {
    title: "Funnel",
    description:
      "Elevate your online business with our streamlined sales funnel feature. From initial interest to final purchase, we optimize conversions and maximize revenue effortlessly.",
    image: screenshotVatReturns,
  },
  {
    title: "Pipeline",
    description:
      "Splash Innovations offers an intuitive Kanban board feature, empowering you to visualize tasks, track progress, and streamline workflow effortlessly. With drag-and-drop functionality and customizable columns, you can organize projects efficiently and boost productivity. ",
    image: screenshotReporting,
  },
];

export default function PrimaryFeatures() {
  const [tabOrientation, setTabOrientation] = useState<
    "horizontal" | "vertical"
  >("horizontal");

  useEffect(() => {
    const lgMediaQuery = window.matchMedia("(min-width: 1024px)");

    function onMediaQueryChange({ matches }: { matches: boolean }) {
      setTabOrientation(matches ? "vertical" : "horizontal");
    }

    onMediaQueryChange(lgMediaQuery);
    lgMediaQuery.addEventListener("change", onMediaQueryChange);

    return () => {
      lgMediaQuery.removeEventListener("change", onMediaQueryChange);
    };
  }, []);

  return (
    <section
      id="features"
      aria-label="Features for running your books"
      className="relative overflow-hidden bg-blue-600 pb-28 pt-20 sm:py-32"
    >
      <Image
        className="absolute left-1/2 top-1/2 max-w-none translate-x-[-44%] translate-y-[-42%]"
        src={backgroundImage}
        alt=""
        width={2245}
        height={1636}
        unoptimized
      />
      <Container className="relative">
        <div className="max-w-2xl md:mx-auto md:text-center xl:max-w-none">
          <h2 className="font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Everything you need to run your business.
          </h2>
          <p className="mt-6 text-lg tracking-tight text-blue-100">
            {`Well everything you need if you aren’t that picky about minor
            details like tax compliance.`}
          </p>
        </div>
        <Tab.Group
          as="div"
          className="mt-16 grid grid-cols-1 items-center gap-y-2 pt-10 sm:gap-y-6 md:mt-20 lg:grid-cols-12 lg:pt-0"
          vertical={tabOrientation === "vertical"}
        >
          {({ selectedIndex }) => (
            <>
              <div className="-mx-4 flex overflow-x-auto pb-4 sm:mx-0 sm:overflow-visible sm:pb-0 lg:col-span-5">
                <Tab.List className="relative z-10 flex gap-x-4 whitespace-nowrap px-4 sm:mx-auto sm:px-0 lg:mx-0 lg:block lg:gap-x-0 lg:gap-y-1 lg:whitespace-normal">
                  {features.map((feature, featureIndex) => (
                    <motion.div
                      viewport={{ once: true }}
                      whileInView={{ opacity: 1, y: 0 }}
                      initial={{ opacity: 0, y: 75 }}
                      transition={{ duration: 0.3, delay: 0.3 * featureIndex }}
                      key={feature.title}
                      className={clsx(
                        "group relative rounded-full px-4 py-1 lg:rounded-l-xl lg:rounded-r-none lg:p-6",
                        selectedIndex === featureIndex
                          ? "bg-white lg:bg-white/10 lg:ring-1 lg:ring-inset lg:ring-white/10"
                          : "hover:bg-white/10 lg:hover:bg-white/5",
                      )}
                    >
                      <h3>
                        <Tab
                          className={clsx(
                            "font-display ui-not-focus-visible:outline-none text-lg",
                            selectedIndex === featureIndex
                              ? "text-blue-600 lg:text-white"
                              : "text-blue-100 hover:text-white lg:text-white",
                          )}
                        >
                          <span className="absolute inset-0 rounded-full lg:rounded-l-xl lg:rounded-r-none" />
                          {feature.title}
                        </Tab>
                      </h3>
                      <p
                        className={clsx(
                          "mt-2 hidden text-sm lg:block",
                          selectedIndex === featureIndex
                            ? "text-white"
                            : "text-blue-100 group-hover:text-white",
                        )}
                      >
                        {feature.description}
                      </p>
                    </motion.div>
                  ))}
                </Tab.List>
              </div>

              <motion.div
                viewport={{ once: true }}
                whileInView={{ opacity: 1, x: 0 }}
                initial={{ opacity: 0, x: 75 }}
                transition={{ duration: 0.5 }}
              >
                <Tab.Panels className="lg:col-span-7">
                  {features.map((feature) => (
                    <Tab.Panel key={feature.title} unmount={false}>
                      <div className="relative sm:px-6 lg:hidden">
                        <div className="absolute -inset-x-4 bottom-[-4.25rem] top-[-6.5rem] bg-white/10 ring-1 ring-inset ring-white/10 sm:inset-x-0 sm:rounded-t-xl" />
                        <p className="relative mx-auto max-w-2xl text-base text-white sm:text-center">
                          {feature.description}
                        </p>
                      </div>
                      <div className="mt-10 w-[45rem] overflow-hidden rounded-xl bg-slate-50 shadow-xl shadow-blue-900/20 sm:w-auto lg:mt-0 lg:w-[67.8125rem]">
                        <Image
                          className="w-full"
                          src={feature.image}
                          alt=""
                          priority
                          sizes="(min-width: 1024px) 67.8125rem, (min-width: 640px) 100vw, 45rem"
                        />
                      </div>
                    </Tab.Panel>
                  ))}
                </Tab.Panels>
              </motion.div>
            </>
          )}
        </Tab.Group>
      </Container>
    </section>
  );
}
