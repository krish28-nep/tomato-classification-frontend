"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { Search, UserSearch } from "lucide-react"

import { fetchApprovedExpertsForChat, fetchChatConversations } from "@/lib/api/chat"
import { useAuth } from "@/hooks/useAuth"
import { useSocket } from "@/hooks/useSocket"
import { ChatConversation } from "@/types/chat"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"

type ChatSidebarProps = {
  basePath: string
  activeReceiverUserId?: number
  className?: string
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
  user,
  basePath,
  isActive,
  preview,
  previewAt,
  online,
}: {
  user: { id: number; username: string }
  basePath: string
  isActive: boolean
  preview?: string
  previewAt?: string
  online?: boolean
}) {
  return (
    <Link
      href={`${basePath}/${user.id}`}
      className={cn(
        "group flex gap-3 px-4 py-3 transition-colors",
        isActive ? "bg-primary/10" : "hover:bg-muted/60"
      )}
    >
      <Avatar className="h-12 w-12 border border-primary/20">
        <AvatarFallback className="bg-primary/10 text-primary text-xs">
          {getInitials(user.username)}
        </AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1 border-b border-border/50 pb-3">
        <div className="flex items-center justify-between gap-3">
          <p className="font-medium text-card-foreground line-clamp-1">{user.username}</p>
          <span className="shrink-0 text-[11px] text-muted-foreground">
            {formatPreviewTime(previewAt)}
          </span>
        </div>
        <div className="mt-1 flex items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground line-clamp-1">
            {preview ?? "No messages yet"}
          </p>
          {online ? (
            <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-primary" />
          ) : null}
        </div>
      </div>
    </Link>
  )
}

export function ChatSidebar({ basePath, activeReceiverUserId, className }: ChatSidebarProps) {
  const { user } = useAuth()
  const { on } = useSocket()
  const queryClient = useQueryClient()
  const [search, setSearch] = useState("")
  const [showExpertFinder, setShowExpertFinder] = useState(false)
  const conversationsQueryKey = useMemo(
    () => ["chat", user?.id, "conversations"] as const,
    [user?.id]
  )

  const {
    data: conversations = [],
    isLoading: isConversationsLoading,
    isError: isConversationsError,
  } = useQuery({
    queryKey: conversationsQueryKey,
    queryFn: fetchChatConversations,
    enabled: Boolean(user?.id),
  })

  const {
    data: experts = [],
    isFetching: isExpertsFetching,
    isError: isExpertsError,
    refetch: findExperts,
  } = useQuery({
    queryKey: ["chat", user?.id, "experts"],
    queryFn: fetchApprovedExpertsForChat,
    enabled: false,
  })

  useEffect(() => {
    setSearch("")
    setShowExpertFinder(false)
  }, [user?.id])

  useEffect(() => {
    return on("message", (message) => {
      if (!user?.id) return

      const conversationUserId =
        message.sender_id === user.id ? message.receiver_id : message.sender_id

      if (conversationUserId <= 0) return

      queryClient.setQueryData<ChatConversation[]>(
        conversationsQueryKey,
        (currentConversations = []) => {
          const existingConversation = currentConversations.find(
            (conversation) => conversation.user_id === conversationUserId
          )
          const expert = experts.find((item) => item.id === conversationUserId)
          const username =
            existingConversation?.username ??
            expert?.username ??
            (conversationUserId === activeReceiverUserId ? "Selected user" : "User")

          const updatedConversation: ChatConversation = {
            user_id: conversationUserId,
            username,
            last_message: message.message,
            last_message_at: message.messaged_at,
          }

          return [
            updatedConversation,
            ...currentConversations.filter(
              (conversation) => conversation.user_id !== conversationUserId
            ),
          ].sort(
            (first, second) =>
              new Date(second.last_message_at).getTime() -
              new Date(first.last_message_at).getTime()
          )
        }
      )

      const invalidateConversations = () => {
        void queryClient.invalidateQueries({ queryKey: conversationsQueryKey })
      }

      if (message.sender_id === user.id) {
        window.setTimeout(invalidateConversations, 1_000)
        return
      }

      invalidateConversations()
    })
  }, [activeReceiverUserId, conversationsQueryKey, experts, on, queryClient, user?.id])

  const filteredConversations = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()

    return conversations.filter((conversation) => (
      conversation.user_id !== user?.id &&
      (normalizedSearch === "" ||
        conversation.username.toLowerCase().includes(normalizedSearch) ||
        conversation.last_message.toLowerCase().includes(normalizedSearch))
    ))
  }, [conversations, search, user?.id])

  const filteredExperts = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()

    return experts.filter((expert) => (
      expert.id !== user?.id &&
      !conversations.some((conversation) => conversation.user_id === expert.id) &&
      (
        normalizedSearch === "" ||
        expert.username.toLowerCase().includes(normalizedSearch) ||
        expert.email.toLowerCase().includes(normalizedSearch)
      )
    ))
  }, [conversations, experts, search, user?.id])

  const visibleCount = showExpertFinder ? filteredExperts.length : filteredConversations.length
  const isLoading = showExpertFinder ? isExpertsFetching : isConversationsLoading
  const isError = showExpertFinder ? isExpertsError : isConversationsError

  const handleFindExpert = () => {
    setShowExpertFinder(true)
    void findExperts()
  }

  return (
    <aside
      className={cn(
        "flex min-h-[720px] flex-col overflow-hidden rounded-2xl border border-border/60 bg-card",
        className
      )}
    >
      <div className="border-b border-border/60 p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-card-foreground font-heading">Chats</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {showExpertFinder ? "Start a new expert conversation" : "Recent conversations"}
            </p>
          </div>
          <Badge variant="outline">{visibleCount}</Badge>
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
        ) : showExpertFinder ? (
          <div className="flex flex-col">
            {filteredExperts.length > 0 ? (
              filteredExperts.map((expert) => (
                <ChatSidebarItem
                  key={expert.id}
                  user={{ id: expert.id, username: expert.username }}
                  basePath={basePath}
                  isActive={expert.id === activeReceiverUserId}
                  online={expert.online}
                />
              ))
            ) : (
              <div className="px-4 py-10 text-center">
                <p className="text-sm font-medium text-foreground">No experts found</p>
                <p className="mt-1 text-xs text-muted-foreground">Try searching another name.</p>
              </div>
            )}
          </div>
        ) : filteredConversations.length > 0 ? (
          <div className="flex flex-col">
            {filteredConversations.map((conversation: ChatConversation) => (
              <ChatSidebarItem
                key={conversation.user_id}
                user={{ id: conversation.user_id, username: conversation.username }}
                basePath={basePath}
                isActive={conversation.user_id === activeReceiverUserId}
                preview={conversation.last_message}
                previewAt={conversation.last_message_at}
              />
            ))}
          </div>
        ) : (
          <div className="px-4 py-10 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <UserSearch className="h-6 w-6 text-primary" />
            </div>
            <p className="mt-4 text-sm font-medium text-foreground">No conversations</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Find an expert to start your first chat.
            </p>
            <Button type="button" className="mt-4" onClick={handleFindExpert}>
              Find Expert
            </Button>
          </div>
        )}
      </ScrollArea>
    </aside>
  )
}
