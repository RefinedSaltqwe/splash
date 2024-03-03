"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { type Service } from "@/types";
import { type ServiceType } from "@prisma/client";
import { Trash2 } from "lucide-react";
import React from "react";

type ServiceInputsProps = {
  serviceTypesData: ServiceType[];
  setServices: React.Dispatch<React.SetStateAction<Service[]>>;
  index: number;
  item: Service;
  servicesCount: number;
};

const ServiceInputs: React.FC<ServiceInputsProps> = ({
  serviceTypesData,
  setServices,
  index,
  item,
  servicesCount,
}) => {
  return (
    <div className="grid grid-cols-9 gap-4">
      <div className="col-span-9 sm:col-span-3">
        <Input
          type="text"
          id="description"
          value={item.description}
          onChange={(e) =>
            setServices((prev) => [
              ...prev.map((item, idx) =>
                index === idx
                  ? {
                      price: item.price,
                      invoiceId: item.invoiceId,
                      serviceTypeId: item.serviceTypeId,
                      description: e.target.value,
                    }
                  : item,
              ),
            ])
          }
          autoComplete="description"
          className={cn(
            "font-normal placeholder:text-gray-400 dark:placeholder:text-gray-600",
            "splash-base-input splash-inputs",
          )}
          placeholder="Description"
        />
      </div>
      <div className="col-span-6 sm:col-span-3">
        <Select
          value={item.serviceTypeId}
          onValueChange={(value: string) =>
            setServices((prev) => [
              ...prev.map((item, idx) =>
                index === idx
                  ? {
                      price: item.price,
                      invoiceId: item.invoiceId,
                      serviceTypeId: value,
                      description: item.description,
                    }
                  : item,
              ),
            ])
          }
          autoComplete="service-name"
        >
          <SelectTrigger
            className={cn(
              "font-normal placeholder:text-gray-400 dark:placeholder:text-gray-600",
              "splash-base-input splash-inputs",
            )}
            aria-placeholder="Service"
          >
            <SelectValue placeholder="Select Service" />
          </SelectTrigger>
          <SelectContent
            className={cn(
              "border-[1px] border-slate-200 bg-card font-normal placeholder:text-gray-400 dark:border-slate-700 dark:placeholder:text-gray-600",
            )}
          >
            {serviceTypesData.map((service) => (
              <SelectItem value={service.id} key={service.id}>
                {service.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="col-span-3 sm:col-span-2">
        <div
          className={cn(
            "flex rounded-md shadow-sm ring-offset-card sm:max-w-md",
            "splash-inputs-within splash-base-input",
          )}
        >
          <span className="flex select-none items-center pl-3 font-bold text-gray-500 sm:text-sm">
            $
          </span>
          <Input
            type="number"
            step="0.01"
            value={item.price}
            onFocus={(e) => e.target.select()}
            onChange={(e) =>
              setServices((prev) => [
                ...prev.map((item, idx) =>
                  index === idx
                    ? {
                        price:
                          e.target.value === ""
                            ? 0
                            : Math.round(
                                (parseFloat(e.target.value) + Number.EPSILON) *
                                  100,
                              ) / 100, //parse from string to flaot, then limit to 2 decimal places
                        invoiceId: item.invoiceId,
                        serviceTypeId: item.serviceTypeId,
                        description: item.description,
                      }
                    : item,
                ),
              ])
            }
            id="price"
            className="block flex-1 border-0 bg-transparent py-1.5 pl-1 font-normal text-foreground placeholder:text-gray-400 focus:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 sm:text-sm sm:leading-6 dark:placeholder:text-gray-600"
            placeholder="Price"
          />
        </div>
      </div>
      <div className="col-span-2 col-start-8 sm:col-span-1">
        <Button
          type="button"
          className="float-right rounded-full hover:!bg-destructive/20"
          size={"icon"}
          variant={"ghost"}
          onClick={() => {
            setServices((prev) => [
              ...prev.filter((item, idx) => index !== idx),
            ]);
          }}
          disabled={servicesCount == 1 && index == 0}
        >
          <span className="sr-only">Delete Service</span>
          <Trash2 className="text-destructive" size={20} />
        </Button>
      </div>
    </div>
  );
};
export default ServiceInputs;
