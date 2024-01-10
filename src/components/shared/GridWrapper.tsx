import React from "react";

type GridWrapperProps = {
  children: React.ReactNode;
};

const GridWrapper: React.FC<GridWrapperProps> = ({ children }) => {
  return <div className="mb-6 grid w-full grid-cols-12 gap-6">{children}</div>;
};
export default GridWrapper;
