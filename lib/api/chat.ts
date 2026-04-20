import axios from "@/lib/axios"
import { ChatExpert, PaginatedChatMessages } from "@/types/chat"

type ChatApiResponse = {
  data?: {
    message: string
    sender_id: number
    receiver_id: number
    is_read: boolean
    messaged_at: string
  }[]
  pagination?: {
    next_cursor?: string | null
    has_more?: boolean
  }
}

export const fetchApprovedExpertsForChat = async (): Promise<ChatExpert[]> => {
  const { data } = await axios.get("/user/expert")
  return data.data ?? []
}

export const fetchChatMessages = async ({
  receiverId,
  limit = 20,
  cursor,
}: {
  receiverId: number
  limit?: number
  cursor?: string | null
}): Promise<PaginatedChatMessages> => {
  const params = new URLSearchParams()
  params.set("limit", String(limit))

  if (cursor) {
    params.set("cursor", cursor)
  }

  const { data } = await axios.get<ChatApiResponse>(`/chat/${receiverId}?${params.toString()}`)

  return {
    messages: data.data ?? [],
    nextCursor: data.pagination?.next_cursor ?? null,
    hasMore: data.pagination?.has_more ?? false,
  }
}
