import React from "react";
import SignInForm from "../_components/SignInForm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";
import { redirect } from "next/navigation";

type AdminAuthPageProps = object;

const AdminAuthPage: React.FC<AdminAuthPageProps> = async () => {
  const session = await getServerSession(authOptions);

  if (session) {
    return redirect("/admin/dashboard");
  }
  return <SignInForm />;
};
export default AdminAuthPage;
