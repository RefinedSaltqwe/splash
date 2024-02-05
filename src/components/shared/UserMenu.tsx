import {
  LogOut,
  Mail,
  MessageSquare,
  Plus,
  PlusCircle,
  UserPlus,
  Users,
} from "lucide-react";
import React from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCurrentUserStore } from "@/stores/useCurrentUser";
import { signOut } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

type UserMenuProps = object;

const UserMenu: React.FC<UserMenuProps> = () => {
  const getUser = useCurrentUserStore();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size={"icon"} className="rounded-full ">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={
                getUser.image
                  ? getUser.image.length > 1
                    ? getUser.image
                    : "https://github.com/shadcn.png"
                  : "https://github.com/shadcn.png"
              }
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="bg-drop-downmenu w-56 px-3 pb-2 pt-3 ">
        <DropdownMenuLabel className="pb-2">My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup className="flex flex-col space-y-1">
          <DropdownMenuItem className="group flex cursor-pointer gap-x-1 rounded-md p-2 py-2 text-sm  leading-6">
            <Users className="mr-2 h-4 w-4" />
            <span>Team</span>
          </DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="group flex cursor-pointer gap-x-1 rounded-md p-2 py-2 text-sm  leading-6">
              <UserPlus className="mr-2 h-4 w-4" />
              <span>Invite users</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent className="bg-drop-downmenu p-2">
                <DropdownMenuItem className="group flex cursor-pointer gap-x-1 rounded-md p-2 py-2 text-sm  leading-6">
                  <Mail className="mr-2 h-4 w-4" />
                  <span>Email</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="group flex cursor-pointer gap-x-1 rounded-md p-2 py-2 text-sm  leading-6">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  <span>Message</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="group flex cursor-pointer gap-x-1 rounded-md p-2 py-2 text-sm  leading-6">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  <span>More...</span>
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          <DropdownMenuItem className="group flex cursor-pointer gap-x-1 rounded-md p-2 py-2 text-sm  leading-6">
            <Plus className="mr-2 h-4 w-4" />
            <span>New Team</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() =>
            signOut({
              callbackUrl: `/admin/auth`,
            })
          }
          className="group flex cursor-pointer gap-x-1 rounded-md p-2 py-2 text-sm  leading-6"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
export default UserMenu;
