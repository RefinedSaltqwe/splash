import React from "react";

type MarketingLayoutProps = {
  children: React.ReactNode;
};

const MarketingLayout: React.FC<MarketingLayoutProps> = ({ children }) => {
  return <div>{children}</div>;
};
export default MarketingLayout;
