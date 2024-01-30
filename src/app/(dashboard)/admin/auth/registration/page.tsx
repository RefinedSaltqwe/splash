import RegistrationForm from "@/app/(dashboard)/_components/Registration";
import GeneralWrapper from "@/components/shared/GeneralWrapper";
import React from "react";

const RegistrationPage: React.FC = async () => {
  return (
    <div className="h-auto w-full bg-background">
      <GeneralWrapper>
        <RegistrationForm />
      </GeneralWrapper>
    </div>
  );
};
export default RegistrationPage;
