"use client";
import Heading from "@/components/shared/Heading";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { getMedia } from "@/server/actions/fetch";
import { useQuery } from "@tanstack/react-query";
import { FolderSearch, Plus } from "lucide-react";
import { lazy, useState } from "react";
import MediaCard from "./MediaCard";

const GlobalModal = lazy(() => import("@/components/modal/GlobalModal"));
const UploadMediaForm = lazy(() => import("./UploadMedia"));

type MediaComponentProps = {
  subaccountId: string;
};

const MediaComponent = ({ subaccountId }: MediaComponentProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { data } = useQuery({
    queryKey: ["media", subaccountId],
    queryFn: () => getMedia(subaccountId),
  });
  return (
    <section className="flex h-full w-full flex-col">
      <div className="flex items-center justify-between">
        <Heading title="Media Bucket" />
        <Button variant={"secondary"} onClick={() => setIsOpen(true)}>
          <span className="sr-only">Upload Button </span>
          <Plus size={16} className="mr-2" />
          {"Upload"}
        </Button>
      </div>
      <Command className="bg-transparent">
        <CommandInput placeholder="Search for file name..." />
        <CommandList className="max-h-full pb-40 ">
          <CommandEmpty className="font-normal">No Media Files</CommandEmpty>
          <CommandGroup heading="Media Files">
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8">
              {data?.Media.map((file) => (
                <CommandItem
                  key={file.id}
                  className="relative rounded-lg !bg-transparent p-0 !font-medium !text-white"
                >
                  <MediaCard file={file} subaccountId={subaccountId} />
                </CommandItem>
              ))}
              {!data?.Media.length && (
                <div className="flex w-full flex-col items-center justify-center">
                  <FolderSearch
                    size={200}
                    className="text-slate-200 dark:text-slate-700"
                  />
                  <p className="font-normal text-muted-foreground">
                    Empty! no files to show.
                  </p>
                </div>
              )}
            </div>
          </CommandGroup>
        </CommandList>
      </Command>
      <GlobalModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        title="Media Information"
        description="Please enter the details for your file"
      >
        <UploadMediaForm subaccountId={subaccountId} setIsOpen={setIsOpen} />
      </GlobalModal>
    </section>
  );
};

export default MediaComponent;
