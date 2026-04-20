"use client"

import { ChatExpertList } from "@/components/chat/chat-expert-list"

export default function FarmerChatPage() {
  return (
    <ChatExpertList
      heading="Expert Chat"
      description="Connect directly with approved experts for guidance on tomato diseases and crop care."
      basePath="/farmer/chat"
    />
  )
}
