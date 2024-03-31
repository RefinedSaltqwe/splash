import { z } from "zod";

export const CreateStripeSecret = z.object({
  customerId: z.string(),
  agencyId: z.string(),
  selectedPriceId: z.enum([
    "price_1OsvDQHWcDxTr9jhU2PS17jJ",
    "price_1OsvDQHWcDxTr9jhM8YxUGnA",
    "price_1Oy4C7HWcDxTr9jhGjBTZTnl",
    "price_1Oy5x7HWcDxTr9jhM8bQBPis",
  ]),
});
