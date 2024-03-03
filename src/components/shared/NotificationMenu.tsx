"use client";

import { type NotificationWithUser } from "@/types/stripe";
import { type Role } from "@prisma/client";
import { Bell } from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Card } from "../ui/card";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Switch } from "../ui/switch";

type Props = {
  notifications: NotificationWithUser | [];
  role?: Role;
  subAccountId?: string;
};

const NotificationMenu = ({ notifications, subAccountId, role }: Props) => {
  const [allNotifications, setAllNotifications] = useState(notifications);
  const [showAll, setShowAll] = useState(true);

  const handleClick = () => {
    if (!showAll) {
      setAllNotifications(notifications);
    } else {
      if (notifications?.length !== 0) {
        setAllNotifications(
          notifications?.filter(
            (item) => item?.subAccountId === subAccountId,
          ) ?? [],
        );
      }
    }
    setShowAll((prev) => !prev);
  };

  return (
    <>
      <Sheet>
        <SheetTrigger>
          <div className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-accent hover:text-accent-foreground">
            <Bell className="h-5 w-5" />
          </div>
        </SheetTrigger>
        <SheetContent className="mr-4 mt-4 gap-4 overflow-scroll pr-4">
          <SheetHeader className="text-left">
            <SheetTitle>Notifications</SheetTitle>
          </SheetHeader>
          {(role === "AGENCY_ADMIN" || role === "AGENCY_OWNER") && (
            <Card className="flex items-center justify-between p-4">
              Current Subaccount
              <Switch onCheckedChange={handleClick} />
            </Card>
          )}
          {allNotifications?.map((notification) => (
            <div
              key={notification.id}
              className="mb-2 flex flex-col gap-y-2 text-ellipsis"
            >
              <div className="flex gap-2">
                <Avatar>
                  <AvatarImage
                    src={notification.User.image}
                    alt="Profile Picture"
                  />
                  <AvatarFallback className="bg-primary">
                    {notification.User.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <p>
                    <span className="font-bold">
                      {notification.notification.split("|")[0]}
                    </span>
                    <span className="text-muted-foreground">
                      {notification.notification.split("|")[1]}
                    </span>
                    <span className="font-bold">
                      {notification.notification.split("|")[2]}
                    </span>
                  </p>
                  <small className="text-xs text-muted-foreground">
                    {new Date(notification.createdAt).toLocaleDateString()}
                  </small>
                </div>
              </div>
            </div>
          ))}
          {allNotifications?.length === 0 && (
            <div className="mb-4 flex items-center justify-center text-muted-foreground">
              You have no notifications
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};

export default NotificationMenu;
