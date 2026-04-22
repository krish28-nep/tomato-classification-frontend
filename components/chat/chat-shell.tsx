"use client"

import { FormEvent, useEffect, useMemo, useRef, useState } from "react"
import { useInfiniteQuery, useQuery } from "@tanstack/react-query"
import { MoreVertical, SendHorizontal, Wifi, WifiOff } from "lucide-react"
import { toast } from "sonner"

import { ChatSidebar } from "@/components/chat/chat-sidebar"
import { fetchApprovedExpertsForChat, fetchChatMessages } from "@/lib/api/chat"
import { useAuth } from "@/hooks/useAuth"
import { useSocket } from "@/hooks/useSocket"
import { ChatMessage } from "@/types/chat"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

const MESSAGES_PER_PAGE = 20

type ChatShellProps = {
  heading: string
  description: string
  receiverUserId: number
  basePath: string
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
}

export function ChatShell({ heading, description, receiverUserId, basePath }: ChatShellProps) {
  const { user } = useAuth()
  const { status: socketState, on, send, getBufferedMessages } = useSocket()
  const [draft, setDraft] = useState("")
  const [liveMessages, setLiveMessages] = useState<ChatMessage[]>([])
  const bottomRef = useRef<HTMLDivElement | null>(null)

  const {
    data: experts = [],
    isLoading: isExpertsLoading,
    isError: isExpertsError,
  } = useQuery({
    queryKey: ["chat", "experts"],
    queryFn: fetchApprovedExpertsForChat,
  })

  const selectedExpert = useMemo(
    () => experts.find((expert) => expert.id === receiverUserId) ?? null,
    [receiverUserId, experts]
  )

  const {
    data,
    isLoading: isMessagesLoading,
    isError: isMessagesError,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["chat", user?.id, receiverUserId],
    queryFn: ({ pageParam }) => fetchChatMessages({
      receiverId: receiverUserId,
      limit: MESSAGES_PER_PAGE,
      cursor: pageParam,
    }),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.hasMore ? lastPage.nextCursor : undefined,
    enabled: Boolean(user?.id && receiverUserId),
  })

  useEffect(() => {
    setLiveMessages(getBufferedMessages(receiverUserId))
  }, [getBufferedMessages, receiverUserId])

  useEffect(() => {
    return on("message", (message) => {
      const belongsToCurrentRoom =
        message.sender_id === receiverUserId || message.receiver_id === receiverUserId

      if (!belongsToCurrentRoom) return

      setLiveMessages((current) => [...current, message])
    })
  }, [receiverUserId, on])

  const historicalMessages = useMemo(() => {
    const pages = data?.pages ?? []
    return pages.flatMap((page) => page.messages).reverse()
  }, [data])

  const messages = useMemo(() => {
    const combined = [...historicalMessages, ...liveMessages]

    return combined.filter((message, index) => {
      const messageTime = new Date(message.messaged_at).getTime()

      return !combined.some((otherMessage, otherIndex) => {
        if (otherIndex >= index) return false
        if (otherMessage.sender_id !== message.sender_id) return false
        if (otherMessage.receiver_id !== message.receiver_id) return false
        if (otherMessage.message !== message.message) return false

        const otherMessageTime = new Date(otherMessage.messaged_at).getTime()
        return Math.abs(otherMessageTime - messageTime) < 10_000
      })
    })
  }, [historicalMessages, liveMessages])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages.length, receiverUserId])

  const handleSend = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const normalizedDraft = draft.trim()

    if (!normalizedDraft) return

    const sent = send({
      to: receiverUserId,
      message: normalizedDraft,
    })

    if (!sent) {
      toast.error("Chat is not connected yet. Please try again.")
      return
    }

    setDraft("")
  }

  return (
    <div className="flex w-full flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground font-heading">{heading}</h1>
        <p className="text-muted-foreground text-sm mt-1">{description}</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[390px_minmax(0,1fr)]">
        <div className="hidden lg:block">
          <ChatSidebar basePath={basePath} activeReceiverUserId={receiverUserId} />
        </div>

        <Card className="flex min-h-[720px] overflow-hidden rounded-2xl border-border/60">
          <div className="flex min-w-0 flex-1 flex-col">
            <header className="flex items-center justify-between gap-3 border-b border-border/60 bg-card px-4 py-3">
              {isExpertsLoading ? (
                <div className="flex items-center gap-3">
                  <Spinner className="h-5 w-5" />
                  <p className="text-sm text-muted-foreground">Loading chat...</p>
                </div>
              ) : isExpertsError || !selectedExpert ? (
                <div>
                  <h2 className="font-semibold text-card-foreground">Chat room not found</h2>
                  <p className="text-sm text-muted-foreground">We couldn&apos;t find this receiver.</p>
                </div>
              ) : (
                <>
                  <div className="flex min-w-0 items-center gap-3">
                    <Avatar className="h-11 w-11 border border-primary/20">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs">
                        {getInitials(selectedExpert.username)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <h2 className="font-semibold text-card-foreground line-clamp-1">{selectedExpert.username}</h2>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {selectedExpert.online ? "Online" : selectedExpert.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant={socketState === "connected" ? "default" : "outline"}>
                      {socketState === "connected" ? (
                        <span className="flex items-center gap-1"><Wifi className="h-3 w-3" /> Live</span>
                      ) : socketState === "connecting" ? (
                        <span className="flex items-center gap-1"><Spinner className="h-3 w-3" /> Connecting</span>
                      ) : (
                        <span className="flex items-center gap-1"><WifiOff className="h-3 w-3" /> Offline</span>
                      )}
                    </Badge>
                    <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </>
              )}
            </header>

            <div className="flex min-h-0 flex-1 flex-col bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)/0.08),transparent_30%),linear-gradient(135deg,hsl(var(--muted)/0.45),hsl(var(--background)))]">
              <div className="flex items-center justify-center px-4 py-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => void fetchNextPage()}
                  disabled={!hasNextPage || isFetchingNextPage || !selectedExpert}
                >
                  {isFetchingNextPage ? "Loading..." : hasNextPage ? "Load older messages" : "No older messages"}
                </Button>
              </div>

              <ScrollArea className="min-h-0 flex-1 px-4 pb-4">
                {isMessagesLoading ? (
                  <div className="flex h-[460px] items-center justify-center">
                    <Spinner className="h-5 w-5" />
                  </div>
                ) : isMessagesError ? (
                  <div className="flex h-[460px] items-center justify-center text-center">
                    <div>
                      <p className="font-medium text-foreground">Unable to load messages</p>
                      <p className="mt-1 text-sm text-muted-foreground">Please try this chat again in a moment.</p>
                    </div>
                  </div>
                ) : messages.length > 0 ? (
                  <div className="flex flex-col gap-3 py-2">
                    {messages.map((message, index) => {
                      const isOwnMessage = message.sender_id !== receiverUserId

                      return (
                        <div
                          key={`${message.sender_id}-${message.receiver_id}-${message.messaged_at}-${index}`}
                          className={cn("flex px-1", isOwnMessage ? "justify-end" : "justify-start")}
                        >
                          {isOwnMessage ? (
                            <div className="relative max-w-[78%] min-w-24 rounded-2xl rounded-br-md bg-primary px-3.5 py-2.5 text-primary-foreground shadow-sm ring-1 ring-primary/20 after:absolute after:bottom-0 after:-right-1.5 after:h-3 after:w-3 after:rounded-bl-full after:bg-primary">
                              <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.message}</p>
                              <div className="mt-1 flex items-center justify-end gap-1.5">
                                <span className="text-[10px] leading-none text-primary-foreground/75">
                                  {new Date(message.messaged_at).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </span>
                                <span className="text-[10px] leading-none text-primary-foreground/75">✓</span>
                              </div>
                            </div>
                          ) : (
                            <div className="flex max-w-[82%] items-start gap-2">
                              <Avatar className="mt-0.5 h-8 w-8 border border-border/60">
                                <AvatarFallback className="bg-primary/10 text-primary text-[11px]">
                                  {selectedExpert ? getInitials(selectedExpert.username) : "U"}
                                </AvatarFallback>
                              </Avatar>
                              <div className="min-w-0 rounded-2xl rounded-tl-md bg-card px-3.5 py-2.5 text-card-foreground shadow-sm ring-1 ring-border/60">
                                <div className="mb-0.5 flex items-center gap-2">
                                  <p className="text-xs font-semibold text-primary line-clamp-1">
                                    {selectedExpert?.username ?? "User"}
                                  </p>
                                </div>
                                <div className="flex items-end gap-3">
                                  <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.message}</p>
                                  <span
                                    className="shrink-0 pb-0.5 text-[10px] leading-none text-muted-foreground"
                                  >
                                    {new Date(message.messaged_at).toLocaleTimeString([], {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    })}
                    <div ref={bottomRef} />
                  </div>
                ) : (
                  <div className="flex h-[460px] items-center justify-center text-center">
                    <div>
                      <p className="font-medium text-foreground">No messages yet</p>
                      <p className="mt-1 text-sm text-muted-foreground">Send the first message to begin the conversation.</p>
                    </div>
                  </div>
                )}
              </ScrollArea>

              <form onSubmit={handleSend} className="border-t border-border/60 bg-card px-4 py-3">
                <div className="flex items-end gap-3">
                  <Textarea
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" && !event.shiftKey) {
                        event.preventDefault()
                        event.currentTarget.form?.requestSubmit()
                      }
                    }}
                    placeholder={selectedExpert ? `Message ${selectedExpert.username}` : "Message"}
                    className="max-h-32 min-h-11 resize-none rounded-2xl bg-muted/50"
                    disabled={!selectedExpert}
                  />
                  <Button
                    type="submit"
                    size="icon"
                    className="h-11 w-11 shrink-0 rounded-full"
                    disabled={draft.trim() === "" || socketState !== "connected" || !selectedExpert}
                  >
                    <SendHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
