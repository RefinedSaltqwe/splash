/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { useEditor } from "@/components/providers/EditorProvider";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import React from "react";

type Hero1CustomInputProps = object;

const Hero1CustomInput: React.FC<Hero1CustomInputProps> = () => {
  const { state, dispatch } = useEditor();

  const handleChangeCustomValues = (e: any) => {
    const settingProperty = e.target.id;
    const value = e.target.value;
    const styleObject = {
      [settingProperty]: value,
    };

    dispatch({
      type: "UPDATE_ELEMENT",
      payload: {
        elementDetails: {
          ...state.editor.selectedElement,
          content: {
            ...state.editor.selectedElement.content,
            ...styleObject,
          },
        },
      },
    });
  };

  return (
    <>
      {!Array.isArray(state.editor.selectedElement.content) && (
        <div className="flex flex-col gap-2">
          <p className="text-muted-foreground">{`Background Image (Link)`}</p>
          <Input
            id="href"
            placeholder="https:domain.example.com/pathname"
            onChange={handleChangeCustomValues}
            value={state.editor.selectedElement.content.href ?? ""}
            className={cn(
              "font-normal placeholder:text-gray-400 dark:placeholder:text-gray-600",
              "splash-base-input splash-inputs",
            )}
          />
        </div>
      )}
    </>
  );
};
export default Hero1CustomInput;
