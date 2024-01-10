import React from "react";

type EdgeCardProps = {
  children: React.ReactNode;
};

const EdgeCard: React.FC<EdgeCardProps> = ({ children }) => {
  return (
    <div className="overflow-hidden bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">{children}</div>
    </div>
  );
};
export default EdgeCard;
