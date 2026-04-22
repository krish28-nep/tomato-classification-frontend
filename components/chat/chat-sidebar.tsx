"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Search } from "lucide-react"

import { fetchApprovedExpertsForChat, fetchChatMessages } from "@/lib/api/chat"
import { useAuth } from "@/hooks/useAuth"
import { useSocket } from "@/hooks/useSocket"
import { ChatExpert, ChatMessage } from "@/types/chat"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"

type ChatSidebarProps = {
  basePath: string
  activeReceiverUserId?: number
}

function formatPreviewTime(timestamp?: string) {
  if (!timestamp) return ""

  return new Date(timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
}

function ChatSidebarItem({
  expert,
  basePath,
  isActive,
}: {
  expert: ChatExpert
  basePath: string
  isActive: boolean
}) {
  const { on } = useSocket()
  const [livePreview, setLivePreview] = useState<ChatMessage | null>(null)

  const { data } = useQuery({
    queryKey: ["chat", "preview", expert.id],
    queryFn: () => fetchChatMessages({ receiverId: expert.id, limit: 1 }),
    retry: false,
    staleTime: 30 * 1000,
  })

  useEffect(() => {
    return on("message", (message) => {
      const belongsToThisChat =
        message.sender_id === expert.id || message.receiver_id === expert.id

      if (!belongsToThisChat) return

      setLivePreview(message)
    })
  }, [expert.id, on])

  const latestMessage = livePreview ?? data?.messages[0]

  return (
    <Link
      href={`${basePath}/${expert.id}`}
      className={cn(
        "group flex gap-3 px-4 py-3 transition-colors",
        isActive ? "bg-primary/10" : "hover:bg-muted/60"
      )}
    >
      <Avatar className="h-12 w-12 border border-primary/20">
        <AvatarFallback className="bg-primary/10 text-primary text-xs">
          {getInitials(expert.username)}
        </AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1 border-b border-border/50 pb-3">
        <div className="flex items-center justify-between gap-3">
          <p className="font-medium text-card-foreground line-clamp-1">{expert.username}</p>
          <span className="shrink-0 text-[11px] text-muted-foreground">
            {formatPreviewTime(latestMessage?.messaged_at)}
          </span>
        </div>
        <div className="mt-1 flex items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground line-clamp-1">
            {latestMessage?.message ?? "No messages yet"}
          </p>
          {expert.online ? (
            <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-primary" />
          ) : null}
        </div>
      </div>
    </Link>
  )
}

export function ChatSidebar({ basePath, activeReceiverUserId }: ChatSidebarProps) {
  const { user } = useAuth()
  const [search, setSearch] = useState("")

  const {
    data: experts = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["chat", "experts"],
    queryFn: fetchApprovedExpertsForChat,
  })

  const filteredExperts = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()

    return experts
      .filter((expert) => expert.id !== user?.id)
      .filter((expert) => (
        normalizedSearch === "" ||
        expert.username.toLowerCase().includes(normalizedSearch) ||
        expert.email.toLowerCase().includes(normalizedSearch)
      ))
  }, [experts, search, user?.id])

  return (
    <aside className="flex min-h-[720px] flex-col overflow-hidden rounded-2xl border border-border/60 bg-card">
      <div className="border-b border-border/60 p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-card-foreground font-heading">Chats</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">Approved expert conversations</p>
          </div>
          <Badge variant="outline">{filteredExperts.length}</Badge>
        </div>

        <div className="relative mt-4">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search chats"
            className="rounded-full bg-muted/50 pl-9"
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        {isLoading ? (
          <div className="flex h-48 items-center justify-center">
            <Spinner className="h-5 w-5" />
          </div>
        ) : isError ? (
          <div className="px-4 py-10 text-center">
            <p className="text-sm font-medium text-foreground">Unable to load chats</p>
            <p className="mt-1 text-xs text-muted-foreground">Please try again in a moment.</p>
          </div>
        ) : filteredExperts.length > 0 ? (
          <div className="flex flex-col">
            {filteredExperts.map((expert) => (
              <ChatSidebarItem
                key={expert.id}
                expert={expert}
                basePath={basePath}
                isActive={expert.id === activeReceiverUserId}
              />
            ))}
          </div>
        ) : (
          <div className="px-4 py-10 text-center">
            <p className="text-sm font-medium text-foreground">No chats found</p>
            <p className="mt-1 text-xs text-muted-foreground">Try searching another expert.</p>
          </div>
        )}
      </ScrollArea>
    </aside>
  )
}
