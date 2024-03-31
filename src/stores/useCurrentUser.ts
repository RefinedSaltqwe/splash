import { type PricesList, type TicketWithTags } from "@/types/stripe";
import {
  type Agency,
  type Contact,
  type Plan,
  type User,
} from "@prisma/client";
import { create } from "zustand";

export type Data = {
  user?: User;
  agency?: Agency;
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
  ticketData?: TicketWithTags[0] | undefined;
  contactData?: Contact | undefined;
  plansData?:
    | {
        defaultPriceId: Plan | null;
        plans: PricesList["data"];
      }
    | undefined;
  setUserData: (user: User | undefined) => void;
  setAgencyData: (agency: Agency | undefined) => void;
  setTicketData: (ticket: TicketWithTags[0] | undefined) => void;
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
  setTicketData: (ticket: TicketWithTags[0] | undefined) =>
    set(() => ({
      ticketData: ticket,
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
