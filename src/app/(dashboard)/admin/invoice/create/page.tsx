import Card from "@/app/(dashboard)/_components/containers/Card";
import Heading from "@/components/shared/Heading";
import React from "react";
import CreateForm from "./_components/CreateForm";

const CreateInvoicePage: React.FC = () => {
  return (
    <section className="flex w-full flex-col">
      <Heading title="Create Invoice" subTitle="Create a new invoice" />
      <Card>
        <CreateForm />
      </Card>
    </section>
  );
};
export default CreateInvoicePage;
