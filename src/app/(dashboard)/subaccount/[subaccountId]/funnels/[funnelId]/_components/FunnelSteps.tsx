"use client";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { type FunnelPage } from "@prisma/client";
import { Check, ExternalLink, LucideEdit } from "lucide-react";
import { useState } from "react";

import FunnelPagePlaceholder from "@/components/icons/funnel-page-placeholder";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import Link from "next/link";

import GlobalModal from "@/components/drawer/GlobalModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useDragAndDropFunnels from "@/hooks/useDragAndDropFunnels";
import { type FunnelsForSubAccount } from "@/types/stripe";
import FunnelStepCard from "./FunnelStepCard";
import CreateFunnelPage from "./forms/CreateFunnelPage";

type FunnelStepsProps = {
  funnel: FunnelsForSubAccount;
  subaccountId: string;
  pages: FunnelPage[];
  funnelId: string;
};

const FunnelSteps = ({
  funnel,
  funnelId,
  pages,
  subaccountId,
}: FunnelStepsProps) => {
  const [clickedPage, setClickedPage] = useState<FunnelPage | undefined>(
    pages[0],
  );
  const [pagesState, setPagesState] = useState(pages);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { onDragEnd, onDragStart } = useDragAndDropFunnels(
    subaccountId,
    funnelId,
    pagesState,
    setPagesState,
  );
  return (
    <section className="flex w-full flex-col">
      <div className="flex flex-col border-[1px] lg:!flex-row ">
        <aside className="flex flex-[0.3] flex-col  justify-between bg-background p-6 ">
          <ScrollArea className="h-full ">
            <div className="flex items-center gap-4">
              <Check />
              Funnel Steps
            </div>
            {pagesState.length ? (
              <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
                <Droppable
                  droppableId="funnels"
                  direction="vertical"
                  key="funnels"
                >
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                      {pagesState.map((page, idx) => (
                        <div
                          className="relative"
                          key={page.id}
                          onClick={() => setClickedPage(page)}
                        >
                          <FunnelStepCard
                            funnelPage={page}
                            index={idx}
                            key={page.id}
                            activePage={page.id === clickedPage?.id}
                          />
                          {provided.placeholder}
                        </div>
                      ))}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            ) : (
              <div className="py-6 text-center text-muted-foreground">
                No Pages
              </div>
            )}
          </ScrollArea>
          <Button className="mt-4 w-full" onClick={() => setIsOpen(true)}>
            Create New Steps
          </Button>
        </aside>
        <aside className="flex-[0.7] bg-muted p-4 ">
          {!!pagesState.length ? (
            <Card className="flex h-full flex-col justify-between">
              <CardHeader>
                <p className="text-sm text-muted-foreground">Page name</p>
                <CardTitle>{clickedPage?.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="w-full overflow-clip rounded-lg border-2  sm:w-80">
                  <Link
                    href={`/subaccount/${subaccountId}/funnels/${funnelId}/editor/${clickedPage?.id}`}
                    className="group relative"
                  >
                    <div className="w-full cursor-pointer group-hover:opacity-30">
                      <FunnelPagePlaceholder />
                    </div>
                    <LucideEdit
                      size={50}
                      className="transofrm absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 !text-muted-foreground opacity-0 transition-all duration-100 group-hover:opacity-100"
                    />
                  </Link>

                  <Link
                    target="_blank"
                    href={`${process.env.NEXT_PUBLIC_SCHEME}${funnel.subDomainName}.${process.env.NEXT_PUBLIC_DOMAIN}/${clickedPage?.pathName}`}
                    className="group flex items-center justify-start gap-2 p-2 transition-colors duration-200 hover:text-primary"
                  >
                    <ExternalLink size={15} />
                    <div className="w-64 overflow-hidden overflow-ellipsis font-normal text-muted-foreground">
                      {process.env.NEXT_PUBLIC_SCHEME}
                      {funnel.subDomainName}.{process.env.NEXT_PUBLIC_DOMAIN}/
                      {clickedPage?.pathName}
                    </div>
                  </Link>
                </div>
                <CreateFunnelPage
                  pagesState={pagesState}
                  setClickedPage={setClickedPage}
                  setPagesState={setPagesState}
                  subaccountId={subaccountId}
                  defaultData={clickedPage}
                  funnelId={funnelId}
                  order={clickedPage?.order ?? 0}
                />
              </CardContent>
            </Card>
          ) : (
            <div className="flex h-[600px] items-center justify-center text-muted-foreground">
              Create a page to view page settings.
            </div>
          )}
        </aside>
      </div>
      <GlobalModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        title="Manage Your Plan"
        description="You can change your plan at any time from the billings settings"
      >
        <CreateFunnelPage
          pagesState={pagesState}
          setClickedPage={setClickedPage}
          setPagesState={setPagesState}
          setIsOpen={setIsOpen}
          subaccountId={subaccountId}
          funnelId={funnelId}
          order={pagesState.length}
        />
      </GlobalModal>
    </section>
  );
};

export default FunnelSteps;
