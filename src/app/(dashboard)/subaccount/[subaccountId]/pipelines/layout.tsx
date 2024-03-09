import React from "react";

const PipelinesLayout = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex w-full flex-col">{children}</div>;
};

export default PipelinesLayout;
