import React from "react";

type CardHeadingProps = {
  title: string;
  subTitle?: string;
};

const CardHeading: React.FC<CardHeadingProps> = ({ title, subTitle }) => {
  return (
    <div className="mb-3 flex w-full flex-col gap-y-1">
      <h1 className="text-xl font-bold text-foreground">{title}</h1>
      <span className="text-sm font-normal text-muted-foreground">
        {subTitle}
      </span>
    </div>
  );
};
export default CardHeading;
