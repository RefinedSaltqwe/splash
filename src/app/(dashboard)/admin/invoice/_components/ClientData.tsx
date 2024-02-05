"use client";
import { getInvoices } from "@/server/actions/fetch";
import { type Customer } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { type ColumnDef } from "@tanstack/react-table";
import { DataTable } from "./DataTable";

interface DataTableInvoiceProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  customersData: Customer[];
  tempData: {
    id: string;
    status: string;
    payment: number;
    total: number;
    shipping: number;
    tax: number;
    subTotal: number;
    discount: number;
    customerId: string;
    createdAt: Date;
    dueDate: Date;
  }[];
}

export function ClientData<TData, TValue>({
  columns,
  customersData,
  tempData,
}: DataTableInvoiceProps<TData, TValue>) {
  const { data: invoices } = useQuery({
    queryKey: ["invoices"],
    queryFn: () => getInvoices(),
  });
  return (
    <DataTable
      columns={columns}
      data={invoices as TData[]}
      invoice={invoices ? invoices : tempData}
      customersData={customersData}
    />
  );
}
