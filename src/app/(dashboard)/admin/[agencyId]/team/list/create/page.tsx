import Heading from "@/components/shared/Heading";
import React from "react";
import SendInvitationComponent from "./_components/SendInvitation";
import Card from "@/app/(dashboard)/_components/containers/Card";

type CreateUserProps = {
  params: {
    agencyId: string;
  };
};

const CreateUser: React.FC<CreateUserProps> = ({ params }) => {
  return (
    <section className="flex w-full flex-col">
      <Heading
        title="Invitation"
        subTitle="An invitation will be sent to the user. Users who already have an invitation sent out to their email, will not receive another invitation."
      />
      <Card>
        <SendInvitationComponent agencyId={params.agencyId} />
      </Card>
    </section>
  );
};

export default CreateUser;
