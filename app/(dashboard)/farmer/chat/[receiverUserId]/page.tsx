import { ChatShell } from "@/components/chat/chat-shell"

export default async function FarmerChatRoomPage({
  params,
}: {
  params: Promise<{ receiverUserId: string }>
}) {
  const { receiverUserId } = await params

  return (
    <ChatShell
      heading="Expert Chat"
      description="This room is between the current user and the selected receiver user."
      receiverUserId={Number(receiverUserId)}
      basePath="/farmer/chat"
    />
  )
}
