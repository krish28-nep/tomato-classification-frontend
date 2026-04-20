import { ChatShell } from "@/components/chat/chat-shell"

export default async function ExpertChatRoomPage({
  params,
}: {
  params: Promise<{ receiverUserId: string }>
}) {
  const { receiverUserId } = await params

  return (
    <ChatShell
      heading="Chat Center"
      description="This room is between the current user and the selected receiver user."
      receiverUserId={Number(receiverUserId)}
      basePath="/expert/chat"
    />
  )
}
