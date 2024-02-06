import Card from "@/app/(dashboard)/_components/containers/Card";
import Heading from "@/components/shared/Heading";
import React from "react";
import InputForm from "../_components/InputForm";

type CreateSupplierPageProps = object;

const CreateSupplierPage: React.FC<CreateSupplierPageProps> = () => {
  return (
    <section className="flex w-full flex-col">
      <Heading title="Create" subTitle="Create a new supplier" />
      <Card>
        <InputForm type="create" />
      </Card>
    </section>
  );
};

export default CreateSupplierPage;
