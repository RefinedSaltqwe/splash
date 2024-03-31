"use client";
import Image from "next/image";
import backgroundImage from "../../../public/assets/images/background-call-to-action.jpg";
import { Container } from "../shared/Containers";
import { Button } from "../ui/button";
import { redirect } from "next/navigation";
import { motion } from "framer-motion";

export default function CallToAction() {
  return (
    <motion.section
      viewport={{ once: true }}
      whileInView={{ opacity: 1 }}
      initial={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      id="get-started-today"
      className="relative overflow-hidden bg-primary py-32"
    >
      <Image
        className="absolute left-1/2 top-1/2 max-w-none -translate-x-1/2 -translate-y-1/2"
        src={backgroundImage}
        alt=""
        width={2347}
        height={1244}
        unoptimized
      />
      <Container className="relative">
        <div className="mx-auto max-w-lg text-center">
          <h2 className="mx-auto max-w-4xl text-center text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Get started today
          </h2>

          <p className="mt-4 text-lg tracking-tight text-white">
            {`It’s time to take control of your business. Buy our software so you can
            feel like you’re doing something productive.`}
          </p>
          <Button
            onClick={() => redirect("/admin")}
            color="white"
            className="mt-10 bg-white text-black hover:bg-white hover:text-black"
            variant={"secondary"}
          >
            Try for free
          </Button>
        </div>
      </Container>
    </motion.section>
  );
}
