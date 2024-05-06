/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { useEditor } from "@/components/providers/EditorProvider";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { getFunnelPages } from "@/server/queries";
import { useQuery } from "@tanstack/react-query";
import React from "react";

type Hero1CustomInputProps = {
  funnelId: string;
};

const opacity = [
  {
    name: "100",
    value: "opacity-100",
  },
  {
    name: "75",
    value: "opacity-75",
  },
  {
    name: "50",
    value: "opacity-50",
  },
  {
    name: "25",
    value: "opacity-25",
  },
  {
    name: "10",
    value: "opacity-10",
  },
  {
    name: "5",
    value: "opacity-5",
  },
  {
    name: "0",
    value: "opacity-0",
  },
];
const positions = [
  "center",
  "top-center",
  "bottom-center",
  "center-left",
  "top-left",
  "bottom-left",
  "center-right",
  "top-right",
  "bottom-right",
];

const Hero1CustomInput: React.FC<Hero1CustomInputProps> = ({ funnelId }) => {
  const { state, dispatch } = useEditor();
  const { data: funnelPagesData } = useQuery({
    queryKey: ["funnelPages", funnelId],
    queryFn: () => getFunnelPages(funnelId),
  });

  `{env.NEXT_PUBLIC_SCHEME}
                      {funnel.subDomainName}.{env.NEXT_PUBLIC_DOMAIN_NO_WWW}/
                      {clickedPage?.pathName}`;

  const handleChangeCustomValues = (e: any) => {
    const settingProperty = e.target.id;
    const value = e.target.value;
    const styleObject = {
      [settingProperty]: value,
    };

    if (Array.isArray(state.editor.selectedElement.content)) {
      return;
    }
    dispatch({
      type: "UPDATE_ELEMENT",
      payload: {
        elementDetails: {
          ...state.editor.selectedElement,
          content: {
            ...state.editor.selectedElement.content,
            hero1: {
              ...state.editor.selectedElement.content.hero1!,
              ...styleObject,
            },
          },
        },
      },
    });
  };

  return (
    <>
      {!Array.isArray(state.editor.selectedElement.content) && (
        <div className="flex flex-col gap-2">
          <div className="flex w-full flex-col">
            <label
              htmlFor="backgroundHref"
              className="block text-sm font-medium leading-6 text-foreground"
            >{`Background Image (Link)`}</label>
            <Input
              id="backgroundHref"
              placeholder="https:domain.example.com/pathname"
              onChange={handleChangeCustomValues}
              value={
                state.editor.selectedElement.content.hero1?.backgroundHref ?? ""
              }
              className={cn(
                "font-normal placeholder:text-gray-400 dark:placeholder:text-gray-600",
                "splash-base-input splash-inputs",
              )}
            />
          </div>
          <div className="flex w-full flex-col">
            <label
              htmlFor="opacity"
              className="block text-sm font-medium leading-6 text-foreground"
            >{`Background Image Opacity`}</label>
            <Select
              value={
                state.editor.selectedElement.content.hero1?.opacity ??
                "opacity-100"
              }
              onValueChange={(value) => {
                const e = {
                  target: {
                    id: "opacity",
                    value,
                  },
                };
                handleChangeCustomValues(e);
              }}
            >
              <SelectTrigger
                id="opacity"
                className={cn(
                  "font-normal placeholder:text-gray-400 dark:placeholder:text-gray-600",
                  "splash-base-input splash-inputs",
                )}
                aria-placeholder="Opacity"
              >
                <SelectValue placeholder="Opacity" />
              </SelectTrigger>
              <SelectContent
                className={cn(
                  "border-[1px] border-slate-200 bg-card font-normal placeholder:text-gray-400 dark:border-slate-700 dark:placeholder:text-gray-600",
                )}
              >
                {opacity.map((item) => (
                  <SelectItem
                    key={item.value}
                    value={item.value}
                    className="hover:!bg-muted-foreground/5"
                  >
                    {item.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex w-full flex-col">
            <label
              htmlFor="position"
              className="block text-sm font-medium leading-6 text-foreground"
            >{`Header Position`}</label>
            <Select
              value={
                state.editor.selectedElement.content.hero1?.position ?? "center"
              }
              onValueChange={(value) => {
                const e = {
                  target: {
                    id: "position",
                    value,
                  },
                };
                handleChangeCustomValues(e);
              }}
            >
              <SelectTrigger
                id="position"
                className={cn(
                  "font-normal placeholder:text-gray-400 dark:placeholder:text-gray-600",
                  "splash-base-input splash-inputs",
                )}
                aria-placeholder="Position"
              >
                <SelectValue placeholder="Position" />
              </SelectTrigger>
              <SelectContent
                className={cn(
                  "border-[1px] border-slate-200 bg-card font-normal placeholder:text-gray-400 dark:border-slate-700 dark:placeholder:text-gray-600",
                )}
              >
                {positions.map((item) => (
                  <SelectItem
                    key={item}
                    value={item}
                    className="hover:!bg-muted-foreground/5"
                  >
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex w-full flex-col">
            <label
              htmlFor="Title Font Size"
              className="block text-sm font-medium leading-6 text-foreground"
            >{`Title Font Size`}</label>
            <Slider defaultValue={[11]} min={11} max={48} step={1} />
          </div>
        </div>
      )}
    </>
  );
};
export default Hero1CustomInput;
