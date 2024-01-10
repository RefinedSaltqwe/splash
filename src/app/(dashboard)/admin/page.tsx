import { authOptions } from "@/server/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

type AdminPageProps = object;

const AdminPage: React.FC<AdminPageProps> = async () => {
  const session = await getServerSession(authOptions);
  if (session) {
    return redirect("/admin/dashboard");
  } else {
    return redirect("/admin/auth");
  }
};
export default AdminPage;
