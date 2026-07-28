export type ChatExpert = {
  id: number
  username: string
  email: string
  role: "expert"
  online?: boolean
}

export type ChatConversation = {
  user_id: number
  username: string
  last_message: string
  last_message_at: string
}

export type ChatReceiver = {
  id: number
  username: string
  email?: string
  role?: string
  online?: boolean
}

export type ChatMessage = {
  message: string
  sender_id: number
  receiver_id: number
  is_read: boolean
  messaged_at: string
}

export type SocketChatMessage = ChatMessage

export type PaginatedChatMessages = {
  messages: ChatMessage[]
  nextCursor: string | null
  hasMore: boolean
}
