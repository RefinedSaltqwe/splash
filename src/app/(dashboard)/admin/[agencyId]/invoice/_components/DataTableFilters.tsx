import { DataTableViewOptions } from "@/app/(dashboard)/_components/datatable/DataTableViewOptions";
import Search from "@/app/(dashboard)/_components/datatable/Search";
import { type Table } from "@tanstack/react-table";

type DataTableFiltersProps<TData> = {
  table: Table<TData>;
  globalFilterString?: string;
  searchFilter?: (val: string) => void;
};

export function DataTableFilters<TData>({
  table,
  searchFilter,
  globalFilterString,
}: DataTableFiltersProps<TData>) {
  return (
    <div className="flex w-full flex-row justify-between space-x-2">
      {/* Search Filter */}
      <div className="flex flex-1 justify-between space-x-2 sm:max-w-[400px]">
        <Search
          placeholder="Search Invoice Number..."
          searchFilter={searchFilter}
          globalFilterString={globalFilterString}
        />
      </div>

      {/* Visibility Options */}
      <div className="flex">
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}
