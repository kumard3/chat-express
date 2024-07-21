import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";

import { api } from "@/utils/api";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { ChatLayout } from "@/components/chat/chat-layout";

export default function Home() {
  const router = useRouter();
  const { status } = useSession({
    required: true,
  });
  useEffect(() => {
    if (status !== "authenticated") {
      void signIn();
    }
  }, [status]);

  if (status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  if (status === "authenticated") {
    return (
      <div className="flex h-[calc(100dvh)] flex-col items-center justify-center gap-4">
        <ChatLayout defaultLayout={[320, 480]} navCollapsedSize={8} />
      </div>
    );
  }
}
