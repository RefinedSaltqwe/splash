import React from "react";
import clsx from "clsx";

interface TagComponentProps {
  title: string;
  colorName: string;
  selectedColor?: (color: string) => void;
  selectedColorValue?: string;
}

const TagComponent: React.FC<TagComponentProps> = ({
  colorName,
  title,
  selectedColor,
  selectedColorValue = "",
}) => {
  return (
    <div
      className={clsx("flex-shrink-0 cursor-pointer rounded-sm p-2 text-xs", {
        "bg-[#57acea]/10 text-[#57acea]": colorName === "BLUE",
        "!bg-[#57acea]": selectedColorValue === "BLUE" && colorName === "BLUE",
        "bg-[#ffac7e]/10 text-[#ffac7e]": colorName === "ORANGE",
        "!bg-[#ffac7e]":
          selectedColorValue === "ORANGE" && colorName === "ORANGE",
        "bg-rose-500/10 text-rose-500": colorName === "ROSE",
        "!bg-rose-500": selectedColorValue === "ROSE" && colorName === "ROSE",
        "bg-emerald-400/10 text-emerald-400": colorName === "GREEN",
        "!bg-emerald-400":
          selectedColorValue === "GREEN" && colorName === "GREEN",
        "bg-purple-400/10 text-purple-400": colorName === "PURPLE",
        "!bg-purple-400":
          selectedColorValue === "PURPLE" && colorName === "PURPLE",
        "border-[1px] border-[#57acea]": colorName === "BLUE" && !title,
        "border-[1px] border-[#ffac7e]": colorName === "ORANGE" && !title,
        "border-[1px] border-rose-500": colorName === "ROSE" && !title,
        "border-[1px] border-emerald-400": colorName === "GREEN" && !title,
        "border-[1px] border-purple-400": colorName === "PURPLE" && !title,
      })}
      key={colorName}
      onClick={() => {
        if (selectedColor) selectedColor(colorName);
      }}
    >
      {title}
    </div>
  );
};

export default TagComponent;
