import React, { lazy } from "react";
const DeleteManyModal = lazy(() => import("../modal/DeleteManyModal"));

const ModalProvider: React.FC = () => {
  return (
    <>
      <DeleteManyModal />
    </>
  );
};
export default ModalProvider;
