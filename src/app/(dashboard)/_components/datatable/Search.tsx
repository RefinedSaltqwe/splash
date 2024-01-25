import { Input } from "@/components/ui/input";
import React, { memo } from "react";

type SearchProps = {
  globalFilterString?: string;
  searchFilter?: (val: string) => void;
  placeholder?: string;
};

const Search: React.FC<SearchProps> = ({
  searchFilter,
  globalFilterString,
  placeholder,
}) => {
  return (
    <Input
      placeholder={placeholder ? placeholder : "Search..."}
      value={globalFilterString}
      onChange={(event) => searchFilter && searchFilter(event.target.value)}
      className="splash-base-input splash-inputs flex flex-1 placeholder:text-gray-400 dark:placeholder:text-gray-600"
    />
  );
};
export default memo(Search);
