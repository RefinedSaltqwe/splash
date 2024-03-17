import Search from "@/app/(dashboard)/_components/datatable/Search";

type DataTableFiltersProps = {
  globalFilterString?: string;
  searchFilter?: (val: string) => void;
};

export function DataTableFilters({
  searchFilter,
  globalFilterString,
}: DataTableFiltersProps) {
  return (
    <div className="flex w-full flex-row justify-between space-x-2">
      {/* Search Filter */}
      <div className="flex flex-1 justify-between space-x-2 sm:max-w-[400px]">
        <Search
          placeholder="Search funnel name"
          searchFilter={searchFilter}
          globalFilterString={globalFilterString}
        />
      </div>
    </div>
  );
}
