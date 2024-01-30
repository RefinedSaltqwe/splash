import React from "react";

type GeneralWrapperProps = {
  children: React.ReactNode;
};

const GeneralWrapper: React.FC<GeneralWrapperProps> = ({ children }) => {
  return (
    <div className="w-full">
      <div className="flex flex-1 justify-center px-2 pb-16 pt-10 md:px-10">
        <div className="flex w-full gap-4 md:max-w-screen-2xl"> {children}</div>
      </div>
    </div>
  );
};
export default GeneralWrapper;
