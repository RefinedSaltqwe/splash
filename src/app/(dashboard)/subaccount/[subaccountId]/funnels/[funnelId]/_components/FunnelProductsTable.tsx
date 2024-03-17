/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type Stripe from "stripe";
import Image from "next/image";
import { type Funnel } from "@prisma/client";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  saveActivityLogsNotification,
  updateFunnelProducts,
} from "@/server/queries";

interface FunnelProductsTableProps {
  defaultData: Funnel;
  products: Stripe.Product[];
}

const FunnelProductsTable: React.FC<FunnelProductsTableProps> = ({
  products,
  defaultData,
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [liveProducts, setLiveProducts] = useState<
    { productId: string; recurring: boolean }[] | []
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  >(JSON.parse(defaultData.liveProducts ?? "[]"));

  const handleSaveProducts = async () => {
    setIsLoading(true);
    const response = await updateFunnelProducts(
      JSON.stringify(liveProducts),
      defaultData.id,
    );
    await saveActivityLogsNotification({
      agencyId: undefined,
      description: `Update funnel products | ${response.name}`,
      subaccountId: defaultData.subAccountId,
    });
    setIsLoading(false);
    router.refresh();
  };

  const handleAddProduct = async (product: Stripe.Product) => {
    const productIdExists = liveProducts.find(
      //@ts-expect-error
      (prod) => prod.productId === product.default_price.id,
    );
    productIdExists
      ? setLiveProducts(
          liveProducts.filter(
            (prod) =>
              prod.productId !==
              //@ts-expect-error
              product.default_price?.id,
          ),
        )
      : setLiveProducts([
          ...liveProducts,
          {
            //@ts-expect-error
            productId: product.default_price.id as string,
            //@ts-expect-error
            recurring: !!product.default_price.recurring,
          },
        ]);
  };
  return (
    <>
      <Table className="rounded-md border-[1px] border-border bg-card">
        <TableHeader className="rounded-md">
          <TableRow>
            <TableHead>Live</TableHead>
            <TableHead>Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Interval</TableHead>
            <TableHead className="text-right">Price</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="truncate font-medium">
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>
                <Input
                  defaultChecked={
                    !!liveProducts.find(
                      //@ts-ignore
                      (prod) => prod.productId === product.default_price.id,
                    )
                  }
                  onChange={() => handleAddProduct(product)}
                  type="checkbox"
                  className="h-4 w-4"
                />
              </TableCell>
              <TableCell>
                <Image
                  alt="product Image"
                  height={60}
                  width={60}
                  src={product.images[0] ?? ""}
                />
              </TableCell>
              <TableCell>{product.name}</TableCell>
              <TableCell>
                {
                  //@ts-ignore
                  product.default_price?.recurring ? "Recurring" : "One Time"
                }
              </TableCell>
              <TableCell className="text-right">
                $
                {
                  //@ts-ignore
                  product.default_price?.unit_amount / 100
                }
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button
        disabled={isLoading}
        onClick={handleSaveProducts}
        className="mt-4"
      >
        Save Products
      </Button>
    </>
  );
};

export default FunnelProductsTable;
