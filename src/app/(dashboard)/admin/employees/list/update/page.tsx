import Card from "@/app/(dashboard)/_components/containers/Card";
import React from "react";
import Heading from "@/components/shared/Heading";

type UpdateUserProps = object;

const UpdateUser: React.FC<UpdateUserProps> = () => {
  return (
    <section className="flex w-full flex-col">
      <Heading title="Create" subTitle="Create a new user" />
      <Card>Update</Card>
    </section>
  );
};

export default UpdateUser;
