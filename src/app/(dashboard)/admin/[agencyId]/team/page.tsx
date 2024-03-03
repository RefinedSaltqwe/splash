import { authOptions } from "@/server/auth";
import { getServerSession } from "next-auth";
import { redirect, usePathname } from "next/navigation";
import type React from "react";

const page: React.FC = async () => {
  const session = await getServerSession(authOptions);
  const pathname = usePathname();
  if (session) {
    return redirect(`/admin/employees/list`);
  } else {
    return redirect("/admin/auth");
  }
};
export default page;
