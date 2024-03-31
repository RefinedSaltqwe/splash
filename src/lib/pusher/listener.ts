import { env } from "@/env";
import Pusher from "pusher";

const pusher = new Pusher({
  appId: env.PUSHER_APP_ID,
  key: env.NEXT_PUBLIC_PUSHER_KEY,
  secret: env.PUSHER_SECRET,
  cluster: "us3",
  useTLS: true,
});

export default pusher;
