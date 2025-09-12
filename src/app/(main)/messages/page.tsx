import { getConversations } from "@/actions/message.action";
import { getCurrentUser } from "@/lib/server-auth";
import MessagingInterface from "@/components/MessagingInterface";

export default async function MessagesPage() {
  const conversations = await getConversations();
  const currentUser = await getCurrentUser();

  return <MessagingInterface initialConversations={conversations} currentUser={currentUser} />;
}