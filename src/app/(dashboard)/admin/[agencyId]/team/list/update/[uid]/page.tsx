import Card from "@/app/(dashboard)/_components/containers/Card";
import Heading from "@/components/shared/Heading";
import { getUserById } from "@/server/actions/fetch";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import React from "react";
import InputForm from "../../_components/InputForm";

type UpdateUserProps = {
  params: {
    uid: string;
    agencyId: string;
  };
};

// export async function generateStaticParams({ params }: UpdateUserProps) {
//   const users = await db.user.findMany({
//     where: {
//       agencyId: params.agencyId,
//     },
//   });
//   return users.map(({ id }) => {
//     uid: id;
//   });
// }

const UpdateUser: React.FC<UpdateUserProps> = async ({ params }) => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["user", params.uid],
    queryFn: () => getUserById(params.uid),
  });
  return (
    <section className="flex w-full flex-col">
      <Heading title="Update" subTitle="Update user infomration" />
      <Card>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <InputForm uid={params.uid} />
        </HydrationBoundary>
      </Card>
    </section>
  );
};

export default UpdateUser;
