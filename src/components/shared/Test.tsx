"use server";
import { authOptions } from "@/server/auth";
import { getServerSession } from "next-auth";
import React from "react";

type TestProps = object;

const Test: React.FC<TestProps> = async () => {
  const session = await getServerSession(authOptions);
  if (!session) {
    return;
  }
  console.log(session);
  return <div>Have a good coding</div>;
};
export default Test;
