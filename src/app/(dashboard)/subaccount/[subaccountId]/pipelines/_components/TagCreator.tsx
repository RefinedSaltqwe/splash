"use client";
import { type Tag } from "@prisma/client";
import { PlusCircleIcon, TrashIcon, X } from "lucide-react";
import { useEffect, useState } from "react";

import GlobalModal from "@/components/modal/GlobalModal";
import Loader from "@/components/shared/Loader";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useAction } from "@/hooks/useAction";
import { createTag } from "@/server/actions/create-tag";
import { getTagsForSubaccount } from "@/server/actions/fetch";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import TagComponent from "./TagComponent";

type Props = {
  subAccountId: string;
  getSelectedTags: (tags: Tag[]) => void;
  defaultTags?: Tag[];
};

const TagColors = ["BLUE", "ORANGE", "ROSE", "PURPLE", "GREEN"] as const;
export type TagColor = (typeof TagColors)[number];

const TagCreator = ({ getSelectedTags, subAccountId, defaultTags }: Props) => {
  const [selectedTags, setSelectedTags] = useState<Tag[]>(defaultTags ?? []);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [tags, setTags] = useState<Tag[]>([]);
  const [value, setValue] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const queryClient = useQueryClient();
  const { data: getTags } = useQuery({
    queryKey: ["TagsForSubaccount", subAccountId],
    queryFn: () => getTagsForSubaccount(subAccountId),
    enabled: !!subAccountId,
  });

  const { execute: executeCreateTag } = useAction(createTag, {
    onSuccess: (data) => {
      toast.success(`New tag created: ${data.name}`);
      setTags((prev) => [...prev, data]);
      setValue("");
      setSelectedColor("");
      void queryClient.invalidateQueries({
        queryKey: ["TagsForSubaccount", data.subAccountId],
      });
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  useEffect(() => {
    getSelectedTags(selectedTags);
  }, [selectedTags]);

  useEffect(() => {
    setTags(getTags?.Tags ?? []);
  }, [getTags]);

  const handleDeleteSelection = (tagId: string) => {
    setSelectedTags(selectedTags.filter((tag) => tag.id !== tagId));
  };

  const handleAddTag = async () => {
    if (!value) {
      toast.error("Tags need to have a name");
      return;
    }
    if (!selectedColor) {
      toast.error("Please Select a color");
      return;
    }
    const tagData: Tag = {
      color: selectedColor,
      createdAt: new Date(),
      id: "",
      name: value,
      subAccountId,
      updatedAt: new Date(),
    };

    void executeCreateTag(tagData);
  };

  const handleAddSelections = (tag: Tag) => {
    if (selectedTags.every((t) => t.id !== tag.id)) {
      setSelectedTags((prev) => [...prev, tag]);
    }
  };
  const handleDeleteTag = async (tagId: string) => {
    // setTags(tags.filter((tag) => tag.id !== tagId));
    // try {
    //   const response = await deleteTag(tagId);
    //   toast({
    //     title: "Deleted tag",
    //     description: "The tag is deleted from your subaccount.",
    //   });
    //   await saveActivityLogsNotification({
    //     agencyId: undefined,
    //     description: `Deleted a tag | ${response?.name}`,
    //     subaccountId: subAccountId,
    //   });
    //   router.refresh();
    // } catch (error) {
    //   toast({
    //     variant: "destructive",
    //     title: "Could not delete tag",
    //   });
    // }
  };

  return (
    <div className="flex w-full flex-col">
      <Command className="bg-transparent">
        {!!selectedTags.length && (
          <div className="flex flex-wrap gap-2 rounded-md border-2 border-border bg-background p-2">
            {selectedTags.map((tag) => (
              <div key={tag.id} className="flex items-center">
                <TagComponent title={tag.name} colorName={tag.color} />
                <X
                  size={14}
                  className="cursor-pointer text-muted-foreground"
                  onClick={() => handleDeleteSelection(tag.id)}
                />
              </div>
            ))}
          </div>
        )}
        <div className="my-2 flex items-center gap-2">
          {TagColors.map((colorName) => (
            <TagComponent
              key={colorName}
              selectedColorValue={selectedColor}
              selectedColor={setSelectedColor}
              title=""
              colorName={colorName}
            />
          ))}
        </div>
        <div className="relative">
          <CommandInput
            placeholder="Search for tag..."
            value={value}
            onValueChange={setValue}
          />
          <PlusCircleIcon
            onClick={handleAddTag}
            size={20}
            className="absolute right-2 top-1/2 -translate-y-1/2 transform cursor-pointer text-muted-foreground transition-all hover:text-primary"
          />
        </div>
        <CommandList>
          <CommandSeparator />
          <CommandGroup heading="Tags">
            {tags.map((tag) => (
              <CommandItem
                key={tag.id}
                className="flex cursor-pointer items-center justify-between !bg-transparent !font-light hover:!bg-secondary"
              >
                <div onClick={() => handleAddSelections(tag)}>
                  <TagComponent title={tag.name} colorName={tag.color} />
                </div>
                <Button type="button" variant={"destructive"}>
                  <TrashIcon
                    size={16}
                    className="cursor-pointer text-muted-foreground transition-all  hover:text-rose-400"
                  />
                </Button>

                <GlobalModal
                  isOpen={isOpen}
                  setIsOpen={setIsOpen}
                  title="Are you absolutely sure?"
                  description="This action cannot be undone. This will permanently delete
                      your the tag and remove it from our servers."
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
                      onClick={() => handleDeleteTag(tag.id)}
                    >
                      <span className="sr-only">Delete</span>
                      {false ? (
                        <Loader classNames="h-4 w-4 border-2 border-slate-200/40 animate-[spin_.5s_linear_infinite] brightness-100 saturate-200 border-r-transparent" />
                      ) : (
                        "Delete"
                      )}
                    </Button>
                  </div>
                </GlobalModal>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandEmpty>No results found.</CommandEmpty>
        </CommandList>
      </Command>
    </div>
  );
};

export default TagCreator;
