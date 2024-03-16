import { z } from "zod";

export const CreateStripeSecret = z.object({
  customerId: z.string(),
  agencyId: z.string(),
  selectedPriceId: z.enum([
    "price_1OsvDQHWcDxTr9jhU2PS17jJ",
    "price_1OsvDQHWcDxTr9jhM8YxUGnA",
  ]),
});
