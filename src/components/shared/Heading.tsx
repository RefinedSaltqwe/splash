import React from "react";

type HeadingProps = {
  title: string;
  subTitle?: string;
};

const Heading: React.FC<HeadingProps> = ({ title, subTitle }) => {
  return (
    <div className="mb-5 flex w-full flex-col gap-y-1 py-3">
      <h1 className="text-2xl font-bold text-foreground">{title}</h1>
      <span className="text-normal font-normal text-muted-foreground">
        {subTitle}
      </span>
    </div>
  );
};
export default Heading;
