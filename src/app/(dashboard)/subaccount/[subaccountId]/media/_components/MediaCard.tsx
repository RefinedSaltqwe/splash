"use client";
import Loader from "@/components/shared/Loader";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAction } from "@/hooks/useAction";
import { deleteMedia } from "@/server/actions/delete-media";
import { type Media } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { Copy, MoreHorizontal, Trash } from "lucide-react";
import Image from "next/image";
import { lazy, useState } from "react";
import { toast } from "sonner";

const GlobalModal = lazy(() => import("@/components/drawer/GlobalModal"));
type MediaCardProps = { file: Media; subaccountId: string };

const MediaCard = ({ file, subaccountId }: MediaCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const { execute: executeDeleteMedia, isLoading: deletingMedia } = useAction(
    deleteMedia,
    {
      onSuccess: (data) => {
        toast.success(`${data.name} has been deleted.`);
        void queryClient.invalidateQueries({
          queryKey: ["media", subaccountId],
        });
      },
      onError: (error) => {
        toast.error(error);
      },
      onComplete: () => {
        setIsOpen(false);
      },
    },
  );

  return (
    <div className="flex w-full flex-col">
      <DropdownMenu>
        <article className="splash-border-color w-full rounded-2xl border bg-card">
          <div className="relative h-40 w-full">
            <Image
              src={file.link}
              alt="preview image"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="rounded-2xl object-cover"
            />
          </div>
          <p className="h-0 w-0 opacity-0">{file.name}</p>
          <div className="relative p-4">
            <p className="text-muted-foreground">
              {file.createdAt.toDateString()}
            </p>
            <p>{file.name}</p>
            <div className="absolute right-4 top-4 cursor-pointer p-[1px] ">
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size={"icon"}
                  className="rounded-full hover:!bg-muted-foreground/20"
                >
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal size={20} />
                </Button>
              </DropdownMenuTrigger>
            </div>
          </div>

          <DropdownMenuContent align="end" className="bg-drop-downmenu">
            <DropdownMenuLabel>Menu</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="flex gap-2"
              onClick={() => {
                void navigator.clipboard.writeText(file.link);
                toast.success("Copied To Clipboard");
              }}
            >
              <Copy size={15} /> Copy Image Link
            </DropdownMenuItem>
            <DropdownMenuItem
              className="flex gap-2 text-red-500 hover:!bg-red-500/20 hover:!text-red-500"
              onClick={() => setIsOpen(true)}
            >
              <Trash size={15} /> Delete File
            </DropdownMenuItem>
          </DropdownMenuContent>
        </article>
      </DropdownMenu>
      <GlobalModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        title="Are you absolutely sure?"
        description="Are you sure you want to delete this file? All subaccount using this
            file will no longer have access to it!"
      >
        <div className="flex w-full justify-end gap-x-4">
          <Button
            type="button"
            variant={"ghost"}
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant={"destructive"}
            onClick={() =>
              void executeDeleteMedia({ id: file.id, subaccountId })
            }
          >
            <span className="sr-only">Delete</span>
            {deletingMedia ? (
              <Loader classNames="h-4 w-4 border-2 border-slate-200/40 animate-[spin_.5s_linear_infinite] brightness-100 saturate-200 border-r-transparent" />
            ) : (
              "Delete"
            )}
          </Button>
        </div>
      </GlobalModal>
    </div>
  );
};

export default MediaCard;
