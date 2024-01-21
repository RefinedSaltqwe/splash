import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import React from "react";

type PriceInputsProps = {
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
}) => {
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
            value={calculatedPrice.payment}
            onFocus={(e) => e.target.select()}
            onChange={(e) =>
              addCalculatedPrice({
                payment:
                  e.target.value === ""
                    ? 0
                    : Math.round(
                        (parseFloat(e.target.value) + Number.EPSILON) * 100,
                      ) / 100,
                shipping: calculatedPrice.shipping,
                discount: calculatedPrice.discount,
                tax: calculatedPrice.tax,
              })
            }
            className="block flex-1 border-0 bg-transparent py-1.5 pl-1 font-normal text-foreground placeholder:text-gray-400 focus:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 sm:text-sm sm:leading-6 dark:placeholder:text-gray-600"
            placeholder="Shipping"
          />
        </div>
      </div>
    </div>
  );
};
export default PriceInputs;
