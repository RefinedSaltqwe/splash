import React from "react";

type BasicCardProps = {
  children: React.ReactNode;
};

const BasicCard: React.FC<BasicCardProps> = ({ children }) => {
  return (
    <div className="overflow-hidden rounded-lg bg-white shadow">
      <div className="px-4 py-5 sm:p-6">{children}</div>
    </div>
  );
};
export default BasicCard;
