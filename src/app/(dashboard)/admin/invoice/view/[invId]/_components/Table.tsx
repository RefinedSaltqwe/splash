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
import { subTotalPlusShippingMinusDiscount, taxValue } from "@/lib/utils";
import { type InvoiceWithService } from "@/types/prisma";

type TableInvoiceProps = {
  data: InvoiceWithService;
};

export function TableInvoice({ data }: TableInvoiceProps) {
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
        {data.services.map((service) => (
          <TableRow
            key={service.id}
            className="border-slate-200 dark:border-slate-700"
          >
            <TableCell>
              <div className="flex flex-col">
                <span className="w-[200px] font-semibold">
                  {service.serviceTypeId}
                </span>
                <span className="font-normal text-muted-foreground">
                  {service.description}
                </span>
              </div>
            </TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell className="pr-0 text-right font-normal">
              {`$${service.price}`}
            </TableCell>
          </TableRow>
        ))}
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
            {`$${data.subTotal}`}
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
            {`$${data.shipping}`}
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
            {`-$${data.discount}`}
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
            {taxValue(
              subTotalPlusShippingMinusDiscount(
                data.subTotal,
                data.shipping,
                data.discount,
              ),
              data.tax,
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
            {`-$${data.payment}`}
          </td>
        </TableRow>
        <TableRow>
          <TableHead
            scope="row"
            className="pt-4 font-bold text-foreground sm:hidden"
          >
            Total
          </TableHead>
          <TableHead
            scope="row"
            colSpan={3}
            className="hidden pt-4 text-right font-bold text-foreground sm:table-cell"
          >
            Total
          </TableHead>
          <TableCell className="pb-0 pl-8 pr-0 pt-4 text-right font-bold tabular-nums text-foreground">
            {`$${data.total}`}
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
