import ChatTopbar from "./chat-topbar";
import { ChatList } from "./chat-list";
import React, { useEffect, useState } from "react";
import { api } from "@/utils/api";

import { Messages } from "@/types";

interface ChatProps {
  roomId: string;
  username: string;
  userId: string;
  selectedUser: string;
  selectedUserId: string;
  isMobile: boolean;
}

export function Chat({
  roomId,
  username,
  userId,
  selectedUser,
  selectedUserId,
  isMobile,
}: ChatProps) {
  const [messages, setMessages] = useState<Messages[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const {
    data: getPrevMessage,
    isLoading,
    refetch,
  } = api.chat.getUserMessage.useQuery(
    {
      receiverUsername: selectedUser,
    },
    {
      refetchInterval: 10000,
      refetchOnMount: true,
      refetchOnWindowFocus: true,
    },
  );

  const { mutate } = api.chat.sendMessage.useMutation({
    onSuccess: () => {
      void refetch();
    },
  });

  useEffect(() => {
    if (getPrevMessage) {
      setMessages(getPrevMessage);
    }
  }, [userId, selectedUserId, getPrevMessage]);

  const sendMessage = () => {
    if (newMessage.trim() !== "") {
      mutate({
        content: newMessage,
        senderUsername: username,
        receiverUsername: selectedUser,
      });
      setNewMessage("");
    }
  };

  return (
    <div className="flex h-full w-full flex-col justify-between">
      {!selectedUser && (
        <div className="flex h-full items-center justify-center">
          <p className="text-center"> please select a user to chat</p>
        </div>
      )}
      {selectedUser && (
        <>
          <ChatTopbar selectedUser={selectedUser} />

          <ChatList
            messages={messages}
            selectedUser={selectedUser}
            selectedUserId={selectedUserId}
            sendMessage={sendMessage}
            isMobile={isMobile}
            setNewMessage={setNewMessage}
            newMessage={newMessage}
            isLoading={isLoading}
          />
        </>
      )}
    </div>
  );
}
