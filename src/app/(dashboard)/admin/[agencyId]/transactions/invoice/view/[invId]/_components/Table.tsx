"use client";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  formatPrice,
  subTotalPlusShippingMinusDiscount,
  taxValue,
  totalValueWithTax,
} from "@/lib/utils";
import { getServiceTypes } from "@/server/actions/fetch";
import { useCurrentUserStore } from "@/stores/useCurrentUser";
import { type InvoiceWithServiceAndPayment } from "@/types/prisma";
import { useQuery } from "@tanstack/react-query";

type TableInvoiceProps = {
  data: InvoiceWithServiceAndPayment;
};

export function TableInvoice({ data }: TableInvoiceProps) {
  const agencyId = useCurrentUserStore((state) => state.agencyId);
  const { data: serviceTypesData } = useQuery({
    queryFn: () => getServiceTypes(agencyId ?? ""),
    queryKey: ["serviceTypes", agencyId ?? ""],
  });
  return (
    <Table>
      <TableCaption className="font-normal">
        We appreciate your business. Should you need us to add VAT or extra
        notes let us know!
      </TableCaption>
      <TableHeader>
        <TableRow className="w-full border-slate-500">
          <TableHead className="w-full ">Services</TableHead>
          <TableHead className="w-full "></TableHead>
          <TableHead className="w-full "></TableHead>
          <TableHead className="pr-0 text-right">Price</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.services.map((service) => {
          const extract = serviceTypesData?.filter(
            (serviceItem) => serviceItem.id === service.serviceTypeId,
          );
          const item = extract ? extract[0]?.name : "No name";

          return (
            <TableRow
              key={service.id}
              className="border-slate-200 dark:border-slate-700"
            >
              <TableCell>
                <div className="flex flex-col">
                  <span className="w-[200px] font-semibold">{item}</span>
                  <span className="font-normal text-muted-foreground">
                    {service.description}
                  </span>
                </div>
              </TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell className="pr-0 text-right font-normal">
                {`${formatPrice(String(service.price))}`}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
      <TableFooter className="border-slate-200 bg-transparent dark:border-slate-700">
        <TableRow>
          <TableHead
            scope="row"
            className="px-0 pb-0 pt-6 font-normal text-muted-foreground sm:hidden"
          >
            Subtotal
          </TableHead>
          <TableHead
            scope="row"
            colSpan={3}
            className="hidden pt-4 text-right font-normal text-muted-foreground sm:table-cell"
          >
            Subtotal
          </TableHead>
          <TableCell className="pb-0 pl-8 pr-0 pt-4 text-right font-normal tabular-nums text-foreground">
            {`${formatPrice(String(data.subTotal))}`}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableHead
            scope="row"
            className="px-0 pb-0 pt-6 font-normal text-muted-foreground sm:hidden"
          >
            Shipping
          </TableHead>
          <TableHead
            scope="row"
            colSpan={3}
            className="hidden pt-4 text-right font-normal text-muted-foreground sm:table-cell"
          >
            Shipping
          </TableHead>
          <TableCell className="pb-0 pl-8 pr-0 pt-4 text-right font-normal tabular-nums text-foreground">
            {`${formatPrice(String(data.shipping))}`}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableHead
            scope="row"
            className="px-0 pb-0 pt-6 font-normal text-muted-foreground sm:hidden"
          >
            Discount
          </TableHead>
          <TableHead
            scope="row"
            colSpan={3}
            className="hidden pt-4 text-right font-normal text-muted-foreground sm:table-cell"
          >
            Discount
          </TableHead>
          <TableCell className="pb-0 pl-8 pr-0 pt-4 text-right font-normal tabular-nums text-destructive">
            {`-${formatPrice(String(data.discount))}`}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableHead
            scope="row"
            className="pt-4 font-normal text-muted-foreground sm:hidden"
          >
            {`Tax (${data.tax}%)`}
          </TableHead>
          <TableHead
            scope="row"
            colSpan={3}
            className="hidden pt-4 text-right font-normal text-muted-foreground sm:table-cell"
          >
            {`Tax (${data.tax}%)`}
          </TableHead>
          <td className="pb-0 pl-8 pr-0 pt-4 text-right font-normal tabular-nums text-foreground">
            {formatPrice(
              String(
                taxValue(
                  subTotalPlusShippingMinusDiscount(
                    data.subTotal,
                    data.shipping,
                    data.discount,
                  ),
                  data.tax,
                ),
              ),
            )}
          </td>
        </TableRow>
        <TableRow>
          <TableHead
            scope="row"
            className="pt-4 font-normal text-muted-foreground sm:hidden"
          >
            {`Total`}
          </TableHead>
          <TableHead
            scope="row"
            colSpan={3}
            className="hidden pt-4 text-right font-normal text-muted-foreground sm:table-cell"
          >
            {`Total`}
          </TableHead>
          <td className="pb-0 pl-8 pr-0 pt-4 text-right font-normal tabular-nums text-foreground">
            {formatPrice(
              String(
                totalValueWithTax(
                  data.subTotal,
                  data.shipping,
                  data.discount,
                  data.tax,
                ),
              ),
            )}
          </td>
        </TableRow>
        <TableRow>
          <TableHead
            scope="row"
            className="pt-4 font-normal text-muted-foreground sm:hidden"
          >
            Payment
          </TableHead>
          <TableHead
            scope="row"
            colSpan={3}
            className="hidden pt-4 text-right font-normal text-muted-foreground sm:table-cell"
          >
            Payment
          </TableHead>
          <td className="pb-0 pl-8 pr-0 pt-4 text-right font-normal tabular-nums text-destructive">
            {`-${formatPrice(String(data.payment))}`}
          </td>
        </TableRow>
        <TableRow>
          <TableHead
            scope="row"
            className="pt-4 font-bold text-foreground sm:hidden"
          >
            Balance
          </TableHead>
          <TableHead
            scope="row"
            colSpan={3}
            className="hidden pt-4 text-right font-bold text-foreground sm:table-cell"
          >
            Balance
          </TableHead>
          <TableCell className="pb-0 pl-8 pr-0 pt-4 text-right font-bold tabular-nums text-foreground">
            {`${formatPrice(String(data.total))}`}
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
