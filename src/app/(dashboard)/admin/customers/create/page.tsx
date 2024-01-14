import Card from "@/app/(dashboard)/_components/containers/Card";
import React from "react";
import Heading from "@/components/shared/Heading";
import CreateForm from "./_components/CreateForm";

type CreateUserProps = object;

const CreateUser: React.FC<CreateUserProps> = () => {
  return (
    <section className="flex w-full flex-col">
      <Heading title="Create" subTitle="Create a new customer" />
      <Card>
        <CreateForm />
      </Card>
    </section>
  );
};

export default CreateUser;
