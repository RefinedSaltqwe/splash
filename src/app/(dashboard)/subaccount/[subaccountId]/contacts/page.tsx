import { getSubAccountWithContacts } from "@/server/actions/fetch";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import ClientData from "./_components/ClientData";
import Heading from "@/components/shared/Heading";
import CreateContactButton from "./_components/CreateContactButton";

type ContactPageProps = {
  params: { subaccountId: string };
};

const ContactPage = async ({ params }: ContactPageProps) => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["subaccountWithContact", params.subaccountId],
    queryFn: () => getSubAccountWithContacts(params.subaccountId),
  });
  return (
    <section className="flex w-full flex-col">
      <div className="flex items-center justify-between">
        <Heading title="Contacts" />
        <CreateContactButton subaccountId={params.subaccountId} />
      </div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ClientData subaccountId={params.subaccountId} />
      </HydrationBoundary>
    </section>
  );
};

export default ContactPage;
