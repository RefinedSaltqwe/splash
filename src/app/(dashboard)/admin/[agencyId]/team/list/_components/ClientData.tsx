"use client";
import { getAllUsersInAgency } from "@/server/actions/fetch";
import { type User } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { type ColumnDef } from "@tanstack/react-table";
import { DataTable } from "./DataTable";

interface DataTableInvoiceProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  tempUsers: User[];
  uid: string;
  agencyId: string;
}

export function ClientData<TData, TValue>({
  columns,
  tempUsers,
  uid,
  agencyId,
}: DataTableInvoiceProps<TData, TValue>) {
  const { data: users } = useQuery({
    queryKey: ["getAllUsersInAgency", agencyId],
    queryFn: () => getAllUsersInAgency(agencyId),
    enabled: uid.length > 5,
  });
  return <DataTable columns={columns} data={users as TData[]} users={users} />;
}
