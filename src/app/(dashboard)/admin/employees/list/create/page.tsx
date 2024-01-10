import Card from "@/app/(dashboard)/_components/containers/Card";
import React from "react";
import CreateForm from "./_components/CreateForm";
import Heading from "@/components/shared/Heading";

type CreateUserProps = object;

const CreateUser: React.FC<CreateUserProps> = () => {
  return (
    <div className="flex w-full flex-col">
      <Heading title="Create" subTitle="Create a new user" />
      <Card>
        <CreateForm />
      </Card>
    </div>
  );
};

export default CreateUser;
