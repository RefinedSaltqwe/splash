import React from "react";
import SignInForm from "../_components/SignInForm";

type AdminAuthPageProps = object;

const AdminAuthPage: React.FC<AdminAuthPageProps> = async () => {
  return <SignInForm />;
};
export default AdminAuthPage;
