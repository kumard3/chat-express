import { LogOut, MoreHorizontal, SquarePen } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { Skeleton } from "../ui/skeleton";

interface SidebarProps {
  isCollapsed: boolean;
  links?: User[];
  startChat: (user: User) => void;
  isMobile: boolean;
  isLoading: boolean;
  selectedUser: User | null;
}

interface User {
  id: string;
  username: string;
}
export function Sidebar({
  links,
  isCollapsed,
  startChat,
  selectedUser,
  isLoading,
}: SidebarProps) {
  return (
    <div
      data-collapsed={isCollapsed}
      className="group relative flex h-full flex-col justify-between gap-4 p-2 data-[collapsed=true]:p-2"
    >
      {!isCollapsed && (
        <div className="flex items-center justify-between p-2">
          <div className="flex items-center gap-2 text-2xl">
            <p className="font-medium">Chats</p>
          </div>

          <div>
            <button
              className={cn(
                buttonVariants({ variant: "ghost", size: "icon" }),
                "h-9 w-9",
              )}
            >
              <MoreHorizontal size={20} />
            </button>

            <button
              className={cn(
                buttonVariants({ variant: "ghost", size: "icon" }),
                "h-9 w-9",
              )}
            >
              <SquarePen size={20} />
            </button>
          </div>
        </div>
      )}
      {isLoading && <LoadingUI />}

      {!isLoading && links?.length === 0 && (
        <div className="flex items-center justify-center gap-4">
          <p>No chats available</p>
        </div>
      )}
      <nav className="flex h-full flex-col gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
        {links?.map((link, index) =>
          isCollapsed ? (
            <TooltipProvider key={index}>
              <Tooltip key={index} delayDuration={0}>
                <TooltipTrigger asChild>
                  <div
                    onClick={() => startChat(link)}
                    className={cn(
                      buttonVariants({
                        variant: selectedUser ? "grey" : "ghost",
                        size: "icon",
                      }),
                      "h-11 w-11 border-b md:h-16 md:w-16",
                      selectedUser?.id === link.id &&
                        "dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white",
                    )}
                  >
                    <Avatar className="flex items-center justify-center">
                      <AvatarImage
                        src={link.username}
                        alt={link.username}
                        width={6}
                        height={6}
                        className="h-10 w-10"
                      />
                      <AvatarFallback>
                        {link.username.charAt(0)}
                      </AvatarFallback>
                    </Avatar>{" "}
                    <span className="sr-only">
                      {link.username.charAt(0)}
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent
                  side="right"
                  className="flex items-center gap-4"
                >
                  {link.username}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <div
              onClick={() => startChat(link)}
              key={index}
              className={cn(
                buttonVariants({
                  variant: selectedUser ? "grey" : "ghost",
                  size: "xl",
                }),
                selectedUser?.id === link.id &&
                  "shrink dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white",
                "justify-start gap-4",
              )}
            >
              <Avatar className="flex items-center justify-center">
                <AvatarImage
                  src={link.username}
                  alt={link.username}
                  width={6}
                  height={6}
                  className="h-10 w-10"
                />
                <AvatarFallback>
                  {link.username.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex max-w-28 flex-col">
                <span>{link.username}</span>
              </div>
            </div>
          ),
        )}
      </nav>

      <div className="">
        <Button
          className="w-full"
          onClick={() => {
            void signOut({
              callbackUrl: "/login",
            });
          }}
        >
          <LogOut size={24} />
          <span>Logout</span>
        </Button>
      </div>
    </div>
  );
}

const LoadingUI = () => (
  <nav className="grid h-full gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
    {Array.from({ length: 5 }).map((_, index) => (
      <Skeleton key={index} className="flex items-center gap-4">
        <div className="flex h-11 w-11 items-center justify-center md:h-16 md:w-16">
          <Avatar className="flex items-center justify-center">
            <AvatarImage className="h-10 w-10" />
            <AvatarFallback />
          </Avatar>
        </div>
        <div className="flex max-w-28 flex-col">
          <span className="h-4 w-3/4 rounded-md bg-gray-300"></span>
        </div>
      </Skeleton>
    ))}
  </nav>
);
