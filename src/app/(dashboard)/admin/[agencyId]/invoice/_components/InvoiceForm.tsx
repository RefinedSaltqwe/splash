"use client";
import Loader from "@/components/shared/Loader";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useAction } from "@/hooks/useAction";
import {
  cn,
  convertInvoiceStatus,
  statusGenerator,
  subTotalPlusShippingMinusDiscount,
  taxValue,
  totalValueWithTax,
} from "@/lib/utils";
import { createInvoice } from "@/server/actions/create-invoice";
import { CreateInvoice } from "@/server/actions/create-invoice/schema";
import {
  getCustomer,
  getInvoiceWithServices,
  getServiceTypes,
} from "@/server/actions/fetch";
import { updateInvoice } from "@/server/actions/update-invoice";
import { useAddInvoiceReceiverModal } from "@/stores/useAddInvoiceReceiverModal";
import { useCurrentUserStore } from "@/stores/useCurrentUser";
import { type Service } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { type Customer } from "@prisma/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { addDays, format } from "date-fns";
import { CalendarIcon, Pencil, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { type z } from "zod";
import FinalDetails from "./form/FinalDetails";
import PriceInputs from "./form/PriceInputs";
import Receiver from "./form/Receiver";
import ServiceInputs from "./form/ServiceInputs";

type InvoiceFormProps = {
  type: "create" | "update";
  invId?: string;
  agencyId: string;
};

const InvoiceForm: React.FC<InvoiceFormProps> = ({ type, invId, agencyId }) => {
  const { data: invoiceData } = useQuery({
    queryKey: ["invoice", invId],
    queryFn: () => getInvoiceWithServices(invId!),
    enabled: type === "update" && !!invId,
  });

  const { data: customerData } = useQuery({
    queryKey: ["customer", invId],
    queryFn: () => getCustomer(invoiceData!.customerId),
    enabled: !!invoiceData, //? Dependent to invoiceData
  });

  const { data: serviceTypesData } = useQuery({
    queryKey: ["serviceTypes"],
    queryFn: () => getServiceTypes(agencyId),
  });

  const user = useCurrentUserStore();

  const initialServiceValues = {
    price: 0,
    invoiceId: "",
    serviceTypeId: "",
    description: "",
  };

  const initialInvoiceValues =
    invoiceData && type === "update"
      ? {
          ...invoiceData,
        }
      : {
          id: "",
          customerId: "",
          status: "",
          shipping: 0,
          tax: 0,
          payment: 0,
          discount: 0,
          subTotal: 0,
          total: 0,
          agencyId,
          services: [initialServiceValues],
        };

  const router = useRouter();
  const queryClient = useQueryClient();
  const onOpen = useAddInvoiceReceiverModal();
  const [services, setServices] = useState<Service[]>([initialServiceValues]);
  const [dueDate, setDueDate] = useState<Date>();
  const [receiver, setReceiver] = useState<Customer>();
  const [calculatedPrice, setCalculatedPrice] = useState({
    payment: invoiceData?.payment ? invoiceData.payment : 0,
    shipping: invoiceData?.shipping ? invoiceData.shipping : 0,
    discount: invoiceData?.discount ? invoiceData.discount : 0,
    tax: invoiceData?.tax ? invoiceData.tax : 0,
  });

  const form = useForm<z.infer<typeof CreateInvoice>>({
    resolver: zodResolver(CreateInvoice),
    defaultValues: initialInvoiceValues,
  });

  const addReceiver = useCallback(
    (person: Customer) => {
      setReceiver(person);
    },
    [receiver],
  );

  const addCalculatedPrice = useCallback(
    (price: {
      payment: number;
      shipping: number;
      discount: number;
      tax: number;
    }) => {
      setCalculatedPrice(price);
    },
    [calculatedPrice],
  );

  // Expensive Calculation
  const subTotal = useMemo(() => {
    let val = 0;
    services.forEach((item) => {
      val += item.price;
    });
    return val;
  }, [services]);

  // Expensive Calculation
  const total = useMemo(() => {
    let total = 0;
    let addTaxes = 0;
    const minusPayment = calculatedPrice.payment;

    addTaxes = taxValue(
      subTotalPlusShippingMinusDiscount(
        subTotal,
        calculatedPrice.shipping,
        calculatedPrice.discount,
      ),
      calculatedPrice.tax,
    );
    total =
      subTotalPlusShippingMinusDiscount(
        subTotal,
        calculatedPrice.shipping,
        calculatedPrice.discount,
      ) +
      addTaxes -
      minusPayment;
    return Math.round((total + Number.EPSILON) * 100) / 100;
  }, [
    subTotal,
    calculatedPrice.shipping,
    calculatedPrice.discount,
    calculatedPrice.tax,
    calculatedPrice.payment,
  ]);

  useEffect(() => {
    if (type === "update") {
      addReceiver(customerData!);
      setServices(invoiceData!.services);
    }
  }, [customerData]);

  const { execute: executeCreateInvoice, isLoading: isLoadingCreate } =
    useAction(createInvoice, {
      onSuccess: (data) => {
        toast.success(
          `New invoice for ${
            receiver?.companyName !== "N/A"
              ? receiver?.companyName
              : receiver?.name
          } has been created.`,
          {
            duration: 2000,
          },
        );
        void queryClient.invalidateQueries({
          queryKey: ["invoices"],
        });
        router.push(`/admin/${data.agencyId}/invoice`);
      },
      onError: (error) => {
        toast.error(error, {
          duration: 5000,
        });
      },
      onComplete: () => {
        toast.loading("Redirecting", {
          duration: 10000,
        });
      },
    });

  const { execute: executeUpdateInvoice, isLoading: isLoadingUpdate } =
    useAction(updateInvoice, {
      onSuccess: (data) => {
        toast.success(`${data.id} updated:`, {
          description: `Invoice for ${
            receiver?.companyName !== "N/A"
              ? receiver?.companyName
              : receiver?.name
          } has been updated successfully.`,
          duration: 2000,
        });
        void queryClient.invalidateQueries({
          queryKey: ["invoice", invId],
        });
        void queryClient.invalidateQueries({
          queryKey: ["invoices"],
        });
        router.push(`/admin/${data.agencyId}/invoice`);
      },
      onError: (error) => {
        toast.error(error, {
          duration: 5000,
        });
      },
      onComplete: () => {
        toast.loading("Redirecting", {
          duration: 10000,
        });
      },
    });

  function onSubmit(values: z.infer<typeof CreateInvoice>) {
    let proceed = 0;
    if (!receiver) {
      toast.error("Error: Receiver is required.", {
        // description: "Choose receiver",
        duration: 5000,
      });
      onOpen.onOpen();
      return;
    }
    services.forEach((item) => {
      if (item.serviceTypeId == "") {
        toast.error("Error: Service title is required.", {
          duration: 5000,
        });
        proceed++;
        return;
      }
    });

    const mainValues = {
      customerId: receiver.id,
      status: statusGenerator(
        calculatedPrice.payment,
        totalValueWithTax(
          subTotal,
          calculatedPrice.shipping,
          calculatedPrice.discount,
          calculatedPrice.tax,
        ),
        dueDate ? dueDate : new Date(),
      )!,
      dueDate: values.dueDate,
      shipping: calculatedPrice.shipping,
      tax: calculatedPrice.tax,
      payment: calculatedPrice.payment,
      discount: calculatedPrice.discount,
      subTotal: subTotal,
      total: total,
      agencyId,
    };

    if (type === "create" && proceed == 0) {
      void executeCreateInvoice({
        id: "",
        ...mainValues,
        services: [...services],
      });
    } else if (type === "update" && proceed == 0) {
      void executeUpdateInvoice({
        id: invoiceData!.id,
        ...mainValues,
        services: [...services],
        createdAt: invoiceData!.createdAt,
      });
    }
  }

  return (
    <section className="flex w-full flex-col space-y-10">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
          {/* First Section */}
          <div
            className={cn(
              "flex w-full flex-col space-y-6",
              "lg:flex-row lg:space-x-6 lg:space-y-0",
            )}
          >
            {/* Left Content */}
            <div className="flex flex-1 flex-row">
              <div className="flex flex-1 flex-col space-y-3">
                <span className="text-base text-muted-foreground">From:</span>
                <div className="flex w-full flex-col space-y-2 text-start font-normal text-foreground">
                  <span>{user.name}</span>
                  <span>
                    19034 Verna Unions Apt. 164 - Honolulu, RI / 87535
                  </span>
                  <span>639 999 9934</span>
                </div>
              </div>
              <div className="flex flex-row items-start">
                <Button
                  size={"icon"}
                  variant={"ghost"}
                  className="rounded-full"
                >
                  <Pencil className="text-muted-foreground" size={20} />
                </Button>
              </div>
            </div>
            <Separator
              role="separator"
              orientation="vertical"
              className="hidden lg:flex"
            />
            <Separator role="separator" className="flex lg:hidden" />
            {/* Right Content */}
            <Receiver addReceiver={addReceiver} receiver={receiver} />
          </div>
          <div className="my-3 flex w-full flex-row rounded-lg bg-muted-foreground/5 px-5 py-3">
            <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
              <div className="flex flex-1 flex-col space-y-2">
                <Label
                  htmlFor="status"
                  className="block text-sm font-medium leading-6 text-foreground"
                >
                  Status
                </Label>
                <div className="splash-base-input splash-inputs justify-center rounded-md px-3 py-[7px]">
                  <span className="text-muted-foreground">
                    {convertInvoiceStatus(
                      statusGenerator(
                        calculatedPrice.payment,
                        totalValueWithTax(
                          subTotal,
                          calculatedPrice.shipping,
                          calculatedPrice.discount,
                          calculatedPrice.tax,
                        ),
                        dueDate ? dueDate : new Date(),
                      )!,
                    )}
                  </span>
                </div>
              </div>
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => {
                  if (field.value) {
                    setTimeout(() => {
                      setDueDate(field.value);
                    }, 1000);
                  }
                  return (
                    <FormItem className="">
                      <FormLabel
                        htmlFor="dueDate"
                        className="block text-sm font-medium leading-6 text-foreground"
                      >
                        Due Date
                      </FormLabel>
                      <Popover>
                        <PopoverTrigger asChild id="dueDate">
                          <FormControl
                            className={cn(
                              "font-normal placeholder:text-gray-400 dark:placeholder:text-gray-600",
                              "splash-base-input splash-inputs",
                            )}
                          >
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent
                          className="flex w-auto flex-col space-y-2 p-2"
                          align="center"
                        >
                          <Select
                            onValueChange={(value) => {
                              field.onChange(
                                addDays(new Date(), parseInt(value)),
                              );
                            }}
                          >
                            <SelectTrigger
                              className={cn(
                                "font-normal placeholder:text-gray-400 dark:placeholder:text-gray-600",
                                "splash-base-input splash-inputs",
                              )}
                              aria-placeholder="date"
                            >
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent
                              position="popper"
                              className={cn(
                                "border-[1px] border-slate-200 bg-card font-normal placeholder:text-gray-400 dark:border-slate-700 dark:placeholder:text-gray-600",
                              )}
                            >
                              <SelectItem
                                value="0"
                                className="hover:!bg-muted-foreground/5"
                              >
                                Today
                              </SelectItem>
                              <SelectItem
                                value="1"
                                className="hover:!bg-muted-foreground/5"
                              >
                                Tomorrow
                              </SelectItem>
                              <SelectItem
                                value="3"
                                className="hover:!bg-muted-foreground/5"
                              >
                                In 3 days
                              </SelectItem>
                              <SelectItem
                                value="7"
                                className="hover:!bg-muted-foreground/5"
                              >
                                In a week
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <div className="rounded-md">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              // disabled={(date) => date < new Date()}
                              initialFocus
                            />
                          </div>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </div>
          </div>
          <div className="flex w-full flex-col space-y-3 ">
            <div className="flex flex-1 flex-row">
              <span>Details</span>
            </div>
            <div className="flex w-full flex-col space-y-3">
              {services.map((item, index) => {
                return (
                  <div key={index}>
                    <ServiceInputs
                      serviceTypesData={serviceTypesData!}
                      setServices={setServices}
                      index={index}
                      item={item}
                      servicesCount={services.length}
                    />
                    <Separator className="m-0 my-3 w-full bg-slate-200 p-0 dark:bg-slate-700" />
                  </div>
                );
              })}
            </div>
          </div>
          <div className="flex w-full flex-row">
            <Button
              type="button"
              variant={"card_outline"}
              className="!border-primary !text-primary hover:no-underline"
              onClick={() =>
                setServices((prev) => [...prev, initialServiceValues])
              }
            >
              <span className="sr-only">Add Item</span>
              <Plus size={18} className="ml-[-4px] mr-1" />
              Add Item
            </Button>
          </div>
          <div className="grid grid-cols-12 space-y-3">
            <PriceInputs
              addCalculatedPrice={addCalculatedPrice}
              calculatedPrice={calculatedPrice}
            />
            <div className="col-span-full grid grid-cols-2 items-center justify-center gap-4 px-3 py-2 sm:col-span-4 sm:col-start-9">
              <FinalDetails title="Subtotal" value={subTotal} />
              <FinalDetails
                title="Travel Expense"
                value={calculatedPrice.shipping}
              />
              <FinalDetails
                title="Discount"
                value={calculatedPrice.discount}
                childClassNames="text-destructive"
                isMinus={true}
              />
              <FinalDetails
                title={`Tax (%${calculatedPrice.tax})`}
                value={taxValue(
                  subTotalPlusShippingMinusDiscount(
                    subTotal,
                    calculatedPrice.shipping,
                    calculatedPrice.discount,
                  ),
                  calculatedPrice.tax,
                )}
              />
              <FinalDetails
                title="Total"
                value={totalValueWithTax(
                  subTotal,
                  calculatedPrice.shipping,
                  calculatedPrice.discount,
                  calculatedPrice.tax,
                )}
              />
              <FinalDetails
                title="Payment"
                value={calculatedPrice.payment}
                childClassNames="text-destructive"
                isMinus={true}
              />
              <FinalDetails
                title="Balance"
                parentClassNames="text-foreground font-semibold"
                childClassNames="text-foreground font-semibold"
                value={total}
              />
            </div>
          </div>
          <div className="mt-4 flex w-full flex-row justify-end">
            <div className="flex min-w-24 flex-row gap-4">
              <Button
                type="button"
                variant={"card_outline"}
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="w-full"
                disabled={type === "create" ? isLoadingCreate : isLoadingUpdate}
              >
                {type == "create" ? (
                  isLoadingCreate ? (
                    <Loader classNames="h-4 w-4 border-2 border-slate-200/40 animate-[spin_.5s_linear_infinite] brightness-100 saturate-200 border-r-transparent" />
                  ) : (
                    "Create"
                  )
                ) : isLoadingUpdate ? (
                  <Loader classNames="h-4 w-4 border-2 border-slate-200/40 animate-[spin_.5s_linear_infinite] brightness-100 saturate-200 border-r-transparent" />
                ) : (
                  "Update"
                )}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </section>
  );
};
export default InvoiceForm;
