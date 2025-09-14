import { getConversations } from "@/actions/message.action";
import { getCurrentUser } from "@/lib/server-auth";
import MessagingInterface from "@/components/MessagingInterface";
import { Suspense } from "react";

export const dynamic = 'force-dynamic';

export default async function MessagesPage() {
  const conversations = await getConversations();
  const currentUser = await getCurrentUser();

  return (
    <Suspense fallback={<div>Loading messages...</div>}>
      <MessagingInterface initialConversations={conversations} currentUser={currentUser} />
    </Suspense>
  );
}