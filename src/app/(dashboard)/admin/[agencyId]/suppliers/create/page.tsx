import Card from "@/app/(dashboard)/_components/containers/Card";
import Heading from "@/components/shared/Heading";
import React from "react";
import InputForm from "../_components/InputForm";

type CreateSupplierPageProps = {
  params: {
    agencyId: string;
  };
};

const CreateSupplierPage: React.FC<CreateSupplierPageProps> = ({ params }) => {
  return (
    <section className="flex w-full flex-col">
      <Heading title="Create" subTitle="Create a new supplier" />
      <Card>
        <InputForm type="create" agencyId={params.agencyId} />
      </Card>
    </section>
  );
};

export default CreateSupplierPage;
