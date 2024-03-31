"use client";
import { cn } from "@/lib/utils";
import React from "react";
import { motion } from "framer-motion";

type HeaderSectionProps = {
  subHeader?: string;
  header?: string;
  description?: string;
  classNames?: string;
};

const HeaderSection: React.FC<HeaderSectionProps> = ({
  subHeader,
  header,
  description,
  classNames,
}) => {
  return (
    <div className="bg-background py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 75 }}
          transition={{ duration: 0.3 }}
          className="mx-auto w-full lg:mx-0"
        >
          <p className="text-base font-semibold leading-7 text-primary">
            {subHeader}
          </p>
          <h2 className="mt-2 text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
            {header}
          </h2>
          <p
            className={cn(
              "mt-6 text-lg leading-8 text-muted-foreground",
              classNames,
            )}
          >
            {description}
          </p>
        </motion.div>
      </div>
    </div>
  );
};
export default HeaderSection;
