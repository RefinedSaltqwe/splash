import { DataTableViewOptions } from "@/app/(dashboard)/_components/datatable/DataTableViewOptions";
import Search from "@/app/(dashboard)/_components/datatable/Search";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { type Table } from "@tanstack/react-table";

type DataTableFiltersProps<TData> = {
  table: Table<TData>;
  globalFilterString?: string;
  searchFilter?: (val: string) => void;
  selectPlaceholder: string;
  selectFilterColumm: string;
  selectItems: string[];
};

export function DataTableFilters<TData>({
  table,
  selectPlaceholder,
  selectFilterColumm,
  selectItems,
  searchFilter,
  globalFilterString,
}: DataTableFiltersProps<TData>) {
  return (
    <div className="flex w-full flex-col space-y-2 sm:flex-row sm:justify-between sm:space-x-2 sm:space-y-0">
      {/* Search Filter */}
      <div className="flex flex-1 sm:max-w-[400px]">
        <Search
          searchFilter={searchFilter}
          globalFilterString={globalFilterString}
        />
      </div>
      <div className="flex flex-1 flex-row justify-between space-x-2">
        {/* Role Filter */}
        <div className="flex flex-1 space-y-2 sm:max-w-[200px] sm:space-y-0">
          <Select
            onValueChange={(value) => {
              table
                .getColumn(selectFilterColumm)
                ?.setFilterValue(value === "All" ? "" : value);
            }}
          >
            <SelectTrigger
              className={cn(
                "font-normal ",
                "splash-base-input splash-inputs placeholders-select",
              )}
            >
              <SelectValue placeholder={selectPlaceholder} />
            </SelectTrigger>
            <SelectContent className={cn("bg-drop-downmenu font-normal ")}>
              {selectItems.map((value, index) => (
                <SelectItem key={index} value={value} role="menuitem">
                  {value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {/* Visibility Options */}
        <div className="flex">
          <DataTableViewOptions table={table} />
        </div>
      </div>
    </div>
  );
}
