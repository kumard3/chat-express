import { cn } from "@/lib/utils";
import React, { useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import ChatBottombar from "./chat-bottombar";
import { AnimatePresence, motion } from "framer-motion";
import { Skeleton } from "../ui/skeleton";
import { Message, User } from "@prisma/client";
import { Messages } from "@/types";

interface ChatListProps {
  messages?: Messages[];
  selectedUser: string;
  newMessage: string;
  selectedUserId: string;
  sendMessage: () => void;
  setNewMessage: React.Dispatch<React.SetStateAction<string>>;
  isMobile: boolean;
  isLoading: boolean;
}

export function ChatList({
  messages,
  selectedUser,
  sendMessage,
  isMobile,
  selectedUserId,
  setNewMessage,
  newMessage,
  isLoading,
}: ChatListProps) {
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex h-full w-full flex-col overflow-y-auto overflow-x-hidden">
      {isLoading && <ChatLoadingUI />}
      <div
        ref={messagesContainerRef}
        className="flex h-full w-full flex-col overflow-y-auto overflow-x-hidden"
      >
        <AnimatePresence>
          {messages?.map((message, index) => (
            <motion.div
              key={index}
              layout
              initial={{ opacity: 0, scale: 1, y: 50, x: 0 }}
              animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
              exit={{ opacity: 0, scale: 1, y: 1, x: 0 }}
              transition={{
                opacity: { duration: 0.1 },
                layout: {
                  type: "spring",
                  bounce: 0.3,
                  duration: messages.indexOf(message) * 0.05 + 0.2,
                },
              }}
              style={{
                originX: 0.5,
                originY: 0.5,
              }}
              className={cn(
                "flex flex-col gap-2 whitespace-pre-wrap p-4",
                message.senderUsername !== selectedUser
                  ? "items-end"
                  : "items-start",
              )}
            >
              <div className="flex items-center gap-3">
                {message.senderUsername === selectedUser && (
                  <Avatar className="flex items-center justify-center">
                    <AvatarFallback>
                      {message?.senderUsername.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                )}
                <span className="max-w-xs rounded-md bg-accent p-3">
                  {message.content}
                </span>
                {message.senderUsername !== selectedUser && (
                  <Avatar className="flex items-center justify-center">
                    <AvatarFallback>
                      {message?.senderUsername?.charAt(0)}
                    </AvatarFallback>{" "}
                  </Avatar>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <ChatBottombar
        setNewMessage={setNewMessage}
        sendMessage={sendMessage}
        isMobile={isMobile}
        newMessage={newMessage}
      />
    </div>
  );
}

const ChatMessageLoadingSkeleton = () => (
  <div className="flex items-start gap-4 p-2">
    <Skeleton className="flex h-10 w-10 items-center justify-center">
      <Avatar className="flex items-center justify-center">
        <div className="h-10 w-10 rounded-full bg-gray-300"></div>
      </Avatar>
    </Skeleton>
    <div className="flex flex-col gap-2">
      <Skeleton className="h-4 w-32 rounded-md bg-gray-300"></Skeleton>
      <Skeleton className="h-4 w-48 rounded-md bg-gray-300"></Skeleton>
    </div>
  </div>
);

const ChatLoadingUI = () => (
  <div className="space-y-2">
    {Array.from({ length: 5 }).map((_, index) => (
      <ChatMessageLoadingSkeleton key={index} />
    ))}
  </div>
);
