"use client";

import { usePathname } from "next/navigation";

const useGetPathname = () => {
  const pathname = usePathname();
  const getPathname = () => {
    return pathname;
  };
  return { getPathname };
};

export default useGetPathname;
