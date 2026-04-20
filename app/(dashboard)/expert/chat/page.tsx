"use client"

import { ChatExpertList } from "@/components/chat/chat-expert-list"

export default function ExpertChatPage() {
  return (
    <ChatExpertList
      heading="Chat Center"
      description="Stay available for live conversations and review message history with approved experts."
      basePath="/expert/chat"
    />
  )
}
