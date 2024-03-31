"use client";
import Pusher from "pusher-js";
import { env } from "@/env";

export const pusher = new Pusher(env.NEXT_PUBLIC_PUSHER_KEY, {
  cluster: "us3",
});
