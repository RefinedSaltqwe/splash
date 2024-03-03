import { type Customer } from "@prisma/client";
import { create } from "zustand";

type CustomerListStore = {
  customers: Customer[];
  customer: Customer;
  setCustomer: (data: Customer) => void;
  setCustomers: (data: Customer[]) => void;
  addCustomers: (data: Customer[]) => void;
  removeCustomer: (id: string) => void;
};

export const useCustomerList = create<CustomerListStore>((set) => ({
  customers: [],
  customer: {
    id: "",
    name: "",
    companyName: "",
    address: "",
    email: "",
    phoneNumber: "",
    agencyId: "",
    createdAt: new Date(),
  },
  setCustomer: (data: Customer) => {
    set(() => ({
      customer: data,
    }));
  },
  setCustomers: (data: Customer[]) => {
    set(() => ({
      customers: data,
    }));
  },
  addCustomers: (data: Customer[]) => {
    set((prev) => ({
      customers: [...prev.customers, ...data],
    }));
  },
  removeCustomer: (id: string) => {
    set((prev) => ({
      customers: [...prev.customers.filter((person) => person.id !== id)],
    }));
  },
}));
