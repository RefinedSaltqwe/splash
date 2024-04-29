import { type InventoryListBySubaccountIdAndSupplierMaterialsUsed } from "@/types/prisma";
import { type PricesList, type TicketWithTags } from "@/types/stripe";
import {
  type SubAccount,
  type Agency,
  type Contact,
  type Plan,
  type User,
} from "@prisma/client";
import { create } from "zustand";

export type Data = {
  user?: User;
  agency?: Agency;
  subaccount?: SubAccount;
  ticket?: TicketWithTags[0];
  contact?: Contact;
  plans?: {
    defaultPriceId: Plan;
    plans: PricesList["data"];
  };
};

type CurrentUserStore = {
  id?: string | null | undefined;
  agencyId?: string | null | undefined;
  name?: string | null | undefined;
  image?: string | null | undefined;
  email?: string | null | undefined;
  role: string | null | undefined;
  subaccountId?: string | null | undefined;
  userData?: User | undefined;
  agencyData?: Agency | undefined;
  subaccountData?: SubAccount | null | undefined;
  ticketData?: TicketWithTags[0] | undefined;
  inventoryItemData: InventoryListBySubaccountIdAndSupplierMaterialsUsed[] | [];
  contactData?: Contact | undefined;
  plansData?:
    | {
        defaultPriceId: Plan | null;
        plans: PricesList["data"];
      }
    | undefined;
  setUserData: (user: User | undefined) => void;
  setAgencyData: (agency: Agency | undefined) => void;
  setSubaccountData: (subaccount: SubAccount | null | undefined) => void;
  setTicketData: (ticket: TicketWithTags[0] | undefined) => void;
  setInventoryItemData: (
    item: InventoryListBySubaccountIdAndSupplierMaterialsUsed,
    type: "create" | "update",
  ) => void;
  setInventoryItemsData: (
    item: InventoryListBySubaccountIdAndSupplierMaterialsUsed[],
  ) => void;
  setContactData: (contact: Contact | undefined) => void;
  setPlansData: (
    defaultPriceId: Plan | null,
    plans: PricesList["data"],
  ) => void;
  setUser: (
    id: string | null | undefined,
    agencyId: string | null | undefined,
    name: string | null | undefined,
    image: string | null | undefined,
    email: string | null | undefined,
    role: string | null | undefined,
    subaccountId: string | null | undefined,
  ) => void;
};

export const useCurrentUserStore = create<CurrentUserStore>((set) => ({
  id: "",
  agencyId: "",
  name: "",
  image: "",
  email: "",
  role: "",
  subaccountId: "",
  userData: undefined,
  agencyData: undefined,
  ticketData: undefined,
  inventoryItemData: [],
  contactData: undefined,
  plansData: {
    defaultPriceId: "price_1OsvDQHWcDxTr9jhU2PS17jJ",
    plans: [],
  },
  setUserData: (user: User | undefined) =>
    set(() => ({
      userData: user,
    })),
  setAgencyData: (agency: Agency | undefined) =>
    set(() => ({
      agencyData: agency,
    })),
  setSubaccountData: (subaccount: SubAccount | null | undefined) =>
    set(() => ({
      subaccountData: subaccount,
    })),
  setTicketData: (ticket: TicketWithTags[0] | undefined) =>
    set(() => ({
      ticketData: ticket,
    })),
  setInventoryItemData: (
    item1: InventoryListBySubaccountIdAndSupplierMaterialsUsed,
    type: "create" | "update",
  ) =>
    set((state) => ({
      inventoryItemData:
        type === "update"
          ? state.inventoryItemData.map((item2) =>
              item2.id === item1.id ? item1 : item2,
            )
          : [item1, ...state.inventoryItemData],
    })),
  setInventoryItemsData: (
    items: InventoryListBySubaccountIdAndSupplierMaterialsUsed[],
  ) =>
    set(() => ({
      inventoryItemData: items,
    })),
  setContactData: (contact: Contact | undefined) =>
    set(() => ({
      contactData: contact,
    })),
  setPlansData: (defaultPriceId: Plan | null, plans: PricesList["data"]) =>
    set(() => ({
      plansData: {
        defaultPriceId,
        plans,
      },
    })),
  setUser: (
    id: string | null | undefined,
    agencyId: string | null | undefined,
    name?: string | null | undefined,
    image?: string | null | undefined,
    email?: string | null | undefined,
    role?: string | null | undefined,
    subaccountId?: string | null | undefined,
  ) => set({ id, agencyId, name, image, email, role, subaccountId }),
}));
