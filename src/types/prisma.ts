import { type Invoice, type Service } from "@prisma/client";

export type InvoiceWithService = Invoice & { services: Service[] };
