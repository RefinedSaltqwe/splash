import React from "react";

type DashboardWrapperProps = {
  children: React.ReactNode;
};

const DashboardWrapper: React.FC<DashboardWrapperProps> = ({ children }) => {
  return (
    <div className="w-full pl-0 md:pl-72">
      <div className="flex flex-1 justify-center px-10 pb-16 pt-24">
        <div className="flex w-full md:max-w-screen-2xl"> {children}</div>
      </div>
    </div>
  );
};
export default DashboardWrapper;
