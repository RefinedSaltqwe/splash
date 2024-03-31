"use client";
import { Cloud, Lock, Server } from "lucide-react";

import Image from "next/image";
import { motion } from "framer-motion";

const features = [
  {
    name: "Push to deploy.",
    description:
      "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores impedit perferendis suscipit eaque, iste dolor cupiditate blanditiis ratione.",
    icon: Cloud,
  },
  {
    name: "SSL certificates.",
    description:
      "Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo.",
    icon: Lock,
  },
  {
    name: "Database backups.",
    description:
      "Ac tincidunt sapien vehicula erat auctor pellentesque rhoncus. Et magna sit morbi lobortis.",
    icon: Server,
  },
];

export default function ExtraFeatures() {
  return (
    <div className="overflow-hidden bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          <div className="lg:ml-auto lg:pl-4 lg:pt-4">
            <div className="lg:max-w-lg">
              <motion.h2
                viewport={{ once: true }}
                whileInView={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 75 }}
                transition={{ duration: 0.3 }}
                className="text-base font-semibold leading-7 text-primary"
              >
                Deploy faster
              </motion.h2>
              <motion.p
                viewport={{ once: true }}
                whileInView={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 75 }}
                transition={{ duration: 0.3, delay: 0.3 }}
                className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
              >
                A better workflow
              </motion.p>
              <motion.p
                viewport={{ once: true }}
                whileInView={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 75 }}
                transition={{ duration: 0.3, delay: 0.6 }}
                className="mt-6 text-lg leading-8 text-gray-600"
              >
                Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                Maiores impedit perferendis suscipit eaque, iste dolor
                cupiditate blanditiis ratione.
              </motion.p>
              <motion.dl
                viewport={{ once: true }}
                whileInView={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 75 }}
                transition={{ duration: 0.3, delay: 0.9 }}
                className="mt-10 max-w-xl space-y-8 text-base leading-7 text-gray-600 lg:max-w-none"
              >
                {features.map((feature) => (
                  <div key={feature.name} className="relative pl-9">
                    <dt className="inline font-semibold text-gray-900">
                      <feature.icon
                        className="absolute left-1 top-1 h-5 w-5 text-indigo-600"
                        aria-hidden="true"
                      />
                      {feature.name}
                    </dt>{" "}
                    <dd className="inline">{feature.description}</dd>
                  </div>
                ))}
              </motion.dl>
            </div>
          </div>
          <motion.div
            viewport={{ once: true }}
            whileInView={{ opacity: 1, x: 0 }}
            initial={{ opacity: 0, x: -75 }}
            transition={{ duration: 0.5 }}
            className="flex items-start justify-end lg:order-first"
          >
            <Image
              src="https://tailwindui.com/img/component-images/dark-project-app-screenshot.png"
              alt="Product screenshot"
              className="w-[48rem] max-w-none rounded-xl shadow-xl ring-1 ring-gray-400/10 sm:w-[57rem]"
              width={2432}
              height={1442}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
