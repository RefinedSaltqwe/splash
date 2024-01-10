"use client";
import { useCurrentUserStore } from "@/stores/useCurrentUser";
import { type Session } from "next-auth";
import React, { useEffect } from "react";

type ClientWrapperProps = {
  children: React.ReactNode;
  session?: Session | null;
};

const ClientWrapper: React.FC<ClientWrapperProps> = ({ children, session }) => {
  const setUser = useCurrentUserStore();
  useEffect(() => {
    setUser.setUser(
      session?.user.id,
      session?.user.name,
      session?.user.image,
      session?.user.email,
    );
  }, [session]);
  return <div className="h-full">{children}</div>;
};
export default ClientWrapper;
