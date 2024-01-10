import Card from "@/app/(dashboard)/_components/containers/Card";
import React from "react";
import Heading from "@/components/shared/Heading";
import UpdateForm from "../_components/UpdateForm";

type UpdateUserProps = {
  params: {
    uid: string;
  };
};

const UpdateUser: React.FC<UpdateUserProps> = ({ params }) => {
  return (
    <div className="flex w-full flex-col">
      <Heading title="Update" subTitle="Update user infomration" />
      <Card>
        <UpdateForm uid={params.uid} />
      </Card>
    </div>
  );
};

export default UpdateUser;
