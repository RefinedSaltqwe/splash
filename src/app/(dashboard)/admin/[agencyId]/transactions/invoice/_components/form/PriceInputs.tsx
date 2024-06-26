import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { type Payment } from "@prisma/client";
import { PlusSquare } from "lucide-react";
import React, { useState } from "react";
import { v4 } from "uuid";

type PriceInputsProps = {
  setPayments: React.Dispatch<React.SetStateAction<Payment[]>>;
  payments: Payment[];
  addCalculatedPrice: (price: {
    payment: number;
    shipping: number;
    discount: number;
    tax: number;
  }) => void;
  calculatedPrice: {
    payment: number;
    shipping: number;
    discount: number;
    tax: number;
  };
};

const PriceInputs: React.FC<PriceInputsProps> = ({
  addCalculatedPrice,
  calculatedPrice,
  setPayments,
  payments,
}) => {
  const [payment, setPayment] = useState<number>(0);

  const addPayment = (value: number) => {
    if (value !== 0) {
      setPayments((prev) => [
        ...prev,
        {
          id: `new-${v4()}`,
          value: Number(value),
          createdAt: new Date(),
          agencyId: "",
          invoiceId: "",
        },
      ]);
      let totalPayments = 0;

      payments.forEach((val) => {
        totalPayments += val.value;
      });

      totalPayments += Number(value);

      addCalculatedPrice({
        payment:
          totalPayments === 0
            ? 0
            : Math.round((totalPayments + Number.EPSILON) * 100) / 100,
        shipping: calculatedPrice.shipping,
        discount: calculatedPrice.discount,
        tax: calculatedPrice.tax,
      });
      setPayment(0);
    }
  };
  return (
    <div className="col-span-full grid grid-cols-2 items-center justify-center gap-4 px-3 py-2 sm:col-span-9 sm:col-start-4 lg:grid-cols-4">
      <div className="space-y-2">
        <Label
          htmlFor="shipping"
          className="block text-sm font-medium leading-6 text-foreground"
        >
          Travel Expense
        </Label>
        <div
          className={cn(
            "flex rounded-md py-0.5 shadow-sm ring-offset-card sm:max-w-md",
            "splash-inputs-within splash-base-input",
          )}
        >
          <span className="flex select-none items-center pl-3 font-bold text-gray-500 sm:text-sm">
            $
          </span>
          <Input
            type="number"
            id="shipping"
            step="0.01"
            value={calculatedPrice.shipping}
            onFocus={(e) => e.target.select()}
            onChange={(e) =>
              addCalculatedPrice({
                payment: calculatedPrice.payment,
                shipping:
                  e.target.value === ""
                    ? 0
                    : Math.round(
                        (parseFloat(e.target.value) + Number.EPSILON) * 100,
                      ) / 100,
                discount: calculatedPrice.discount,
                tax: calculatedPrice.tax,
              })
            }
            className="block flex-1 border-0 bg-transparent py-1.5 pl-1 font-normal text-foreground placeholder:text-gray-400 focus:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 sm:text-sm sm:leading-6 dark:placeholder:text-gray-600"
            placeholder="Shipping"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label
          htmlFor="shipping"
          className="block text-sm font-medium leading-6 text-foreground"
        >
          Discount
        </Label>
        <div
          className={cn(
            "flex rounded-md py-0.5 shadow-sm ring-offset-card sm:max-w-md",
            "splash-inputs-within splash-base-input",
          )}
        >
          <span className="flex select-none items-center pl-3 font-bold text-gray-500 sm:text-sm">
            $
          </span>
          <Input
            type="number"
            id="discount"
            step="0.01"
            value={calculatedPrice.discount}
            onFocus={(e) => e.target.select()}
            onChange={(e) =>
              addCalculatedPrice({
                payment: calculatedPrice.payment,
                shipping: calculatedPrice.shipping,
                discount:
                  e.target.value === ""
                    ? 0
                    : Math.round(
                        (parseFloat(e.target.value) + Number.EPSILON) * 100,
                      ) / 100,
                tax: calculatedPrice.tax,
              })
            }
            className="block flex-1 border-0 bg-transparent py-1.5 pl-1 font-normal text-foreground placeholder:text-gray-400 focus:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 sm:text-sm sm:leading-6 dark:placeholder:text-gray-600"
            placeholder="Discount"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="shipping"
          className="block text-sm font-medium leading-6 text-foreground"
        >
          Tax
        </Label>
        <div
          className={cn(
            "flex rounded-md py-0.5 shadow-sm ring-offset-card sm:max-w-md",
            "splash-inputs-within splash-base-input",
          )}
        >
          <span className="flex select-none items-center pl-3 font-bold text-gray-500 sm:text-sm">
            %
          </span>
          <Input
            type="number"
            id="tax"
            step="0.01"
            value={calculatedPrice.tax}
            onFocus={(e) => e.target.select()}
            onChange={(e) =>
              addCalculatedPrice({
                payment: calculatedPrice.payment,
                shipping: calculatedPrice.shipping,
                discount: calculatedPrice.discount,
                tax:
                  e.target.value === ""
                    ? 0
                    : Math.round(
                        (parseFloat(e.target.value) + Number.EPSILON) * 100,
                      ) / 100,
              })
            }
            className="block flex-1 border-0 bg-transparent py-1.5 pl-1 font-normal text-foreground placeholder:text-gray-400 focus:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 sm:text-sm sm:leading-6 dark:placeholder:text-gray-600"
            placeholder="Tax"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label
          htmlFor="payment"
          className="block text-sm font-medium leading-6 text-foreground"
        >
          Payment
        </Label>
        <div
          className={cn(
            "flex rounded-md py-0.5 shadow-sm ring-offset-card sm:max-w-md",
            "splash-inputs-within splash-base-input",
          )}
        >
          <span className="flex select-none items-center pl-3 font-bold text-gray-500 sm:text-sm">
            $
          </span>
          <Input
            type="number"
            id="payment"
            step="0.01"
            value={payment}
            onFocus={(e) => e.target.select()}
            onChange={(e) => setPayment(Number(e.target.value))}
            className="block flex-1 border-0 bg-transparent py-1.5 pl-1 font-normal text-foreground placeholder:text-gray-400 focus:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 sm:text-sm sm:leading-6 dark:placeholder:text-gray-600"
            placeholder="0.00"
          />
          <Button
            variant={"ghost"}
            type="button"
            onClick={() => addPayment(payment)}
          >
            <span className="sr-only">Add Partial Payment</span>
            <PlusSquare size={18} className="text-muted-foreground" />
          </Button>
        </div>
      </div>
    </div>
  );
};
export default PriceInputs;
