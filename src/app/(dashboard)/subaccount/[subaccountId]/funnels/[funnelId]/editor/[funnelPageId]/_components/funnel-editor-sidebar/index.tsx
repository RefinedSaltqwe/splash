"use client";
import { useEditor } from "@/components/providers/editor/EditorProvider";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import clsx from "clsx";
import TabList from "./tabs";
import SettingsTab from "./tabs/SettingsTab";
import MediaBucketTab from "./tabs/MediaBucketTab";
import ComponentsTab from "./tabs/components-tab";
import ScrollableElement from "@/components/shared/ScrollableElement";

type Props = {
  subaccountId: string;
};

const FunnelEditorSidebar = ({ subaccountId }: Props) => {
  const { state } = useEditor();

  return (
    <Sheet open={true} modal={false}>
      <Tabs className="w-full " defaultValue="Settings">
        <SheetContent
          showX={false}
          side="right"
          className={clsx(
            "z-[52] mt-[97px] w-16 overflow-hidden bg-background p-0 shadow-none transition-all focus:border-none dark:bg-card",
            { hidden: state.editor.previewMode },
          )}
        >
          <TabList />
        </SheetContent>
        <SheetContent
          showX={false}
          side="right"
          className={clsx(
            "z-[51] mr-16 mt-[97px] h-full w-80 overflow-hidden bg-background p-0 shadow-none transition-all dark:bg-card",
            { hidden: state.editor.previewMode },
          )}
        >
          <ScrollableElement
            className="splash-border-color grid h-full gap-4 border-l border-r !bg-transparent pb-36 pl-[6px]"
            offsetRight="mr-0"
            paddingRight={false}
          >
            <TabsContent value="Settings">
              <SheetHeader className="p-6 text-left">
                <SheetTitle>Styles</SheetTitle>
                <SheetDescription>
                  Show your creativity! You can customize every component as you
                  like.
                </SheetDescription>
              </SheetHeader>
              <SettingsTab />
            </TabsContent>
            <TabsContent value="Media">
              <MediaBucketTab
                overflowEnabled={false}
                subaccountId={subaccountId}
                className={"grid-cols-1 sm:grid-cols-1 lg:grid-cols-1"}
              />
            </TabsContent>
            <TabsContent value="Components">
              <SheetHeader className="p-6 text-left ">
                <SheetTitle>Components</SheetTitle>
                <SheetDescription>
                  You can drag and drop components on the canvas
                </SheetDescription>
              </SheetHeader>
              <ComponentsTab />
            </TabsContent>
          </ScrollableElement>
        </SheetContent>
      </Tabs>
    </Sheet>
  );
};

export default FunnelEditorSidebar;
