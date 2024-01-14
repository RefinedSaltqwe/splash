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

const invoices = [
  {
    invoice: "INV001",
    paymentStatus: "Paid",
    totalAmount: "$250.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV002",
    paymentStatus: "Pending",
    totalAmount: "$150.00",
    paymentMethod: "PayPal",
  },
];

export function TableInvoice() {
  return (
    <Table>
      <TableCaption className="font-normal">
        We appreciate your business. Should you need us to add VAT or extra
        notes let us know!
      </TableCaption>
      <TableHeader>
        <TableRow className="w-full border-slate-500">
          <TableHead className="w-full ">Projects</TableHead>
          <TableHead className="w-full "></TableHead>
          <TableHead className="w-full "></TableHead>
          <TableHead className="pr-0 text-right">Total</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((invoice) => (
          <TableRow
            key={invoice.invoice}
            className="border-slate-200 dark:border-slate-700"
          >
            <TableCell>
              <div className="flex flex-col">
                <span className="w-[200px] font-semibold">Project Name</span>
                <span className="font-normal text-muted-foreground">
                  A very long long description.
                </span>
              </div>
            </TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell className="pr-0 text-right font-normal">
              {invoice.totalAmount}
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
            $100
          </TableCell>
        </TableRow>
        <TableRow>
          <TableHead
            scope="row"
            className="pt-4 font-normal text-muted-foreground sm:hidden"
          >
            {`Tax (11%)`}
          </TableHead>
          <TableHead
            scope="row"
            colSpan={3}
            className="hidden pt-4 text-right font-normal text-muted-foreground sm:table-cell"
          >
            {`Tax (11%)`}
          </TableHead>
          <td className="pb-0 pl-8 pr-0 pt-4 text-right font-normal tabular-nums text-foreground">
            $20
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
            $120
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
