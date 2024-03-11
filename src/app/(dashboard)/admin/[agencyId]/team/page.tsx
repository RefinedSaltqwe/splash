import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import type React from "react";

const page: React.FC = async () => {
  const session = await currentUser();
  if (session) {
    return redirect(`/admin/employees/list`);
  } else {
    return redirect("/admin/auth");
  }
};
export default page;
