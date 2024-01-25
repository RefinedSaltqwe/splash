import React, { lazy } from "react";
const ServiceDrawer = lazy(() => import("../drawer/ServiceDrawer"));

const DrawerProvider: React.FC = () => {
  return (
    <>
      <ServiceDrawer />
    </>
  );
};
export default DrawerProvider;
