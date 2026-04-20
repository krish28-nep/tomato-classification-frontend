"use client"

import Link from "next/link"
import { FormEvent, useEffect, useMemo, useRef, useState } from "react"
import { useInfiniteQuery, useQuery } from "@tanstack/react-query"
import { ArrowLeft, MessageSquare, SendHorizontal, Wifi, WifiOff } from "lucide-react"
import { toast } from "sonner"

import { fetchApprovedExpertsForChat, fetchChatMessages } from "@/lib/api/chat"
import { useAuth } from "@/hooks/useAuth"
import { useSocket } from "@/hooks/useSocket"
import { ChatMessage } from "@/types/chat"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
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
    queryKey: ["chat", user?.email, receiverUserId],
    queryFn: ({ pageParam }) => fetchChatMessages({
      receiverId: receiverUserId,
      limit: MESSAGES_PER_PAGE,
      cursor: pageParam,
    }),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.hasMore ? lastPage.nextCursor : undefined,
    enabled: Boolean(user?.email && receiverUserId),
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
    const seen = new Set<string>()

    return combined.filter((message) => {
      const key = `${message.sender_id}-${message.receiver_id}-${message.messaged_at}-${message.message}`
      if (seen.has(key)) {
        return false
      }

      seen.add(key)
      return true
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

    setLiveMessages((current) => [
      ...current,
      {
        message: normalizedDraft,
        sender_id: 0,
        receiver_id: receiverUserId,
        is_read: false,
        messaged_at: new Date().toISOString(),
      },
    ])
    setDraft("")
  }

  return (
    <div className="flex flex-col gap-6 mx-auto max-w-5xl">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground font-heading">{heading}</h1>
          <p className="text-muted-foreground text-sm mt-1">{description}</p>
        </div>
        <Link href={basePath}>
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to experts
          </Button>
        </Link>
      </div>

      <Card className="border-border/60">
        <CardHeader>
          {isExpertsLoading ? (
            <div className="flex items-center gap-3">
              <Spinner className="h-5 w-5" />
              <p className="text-sm text-muted-foreground">Loading expert...</p>
            </div>
          ) : isExpertsError || !selectedExpert ? (
            <div>
              <CardTitle className="text-lg">Chat room not found</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                We couldn&apos;t find the selected expert.
              </p>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-11 w-11 border border-primary/20">
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {selectedExpert.username
                      .split(" ")
                      .map((part) => part[0])
                      .join("")
                      .slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg">{selectedExpert.username}</CardTitle>
                  <p className="text-sm text-muted-foreground">{selectedExpert.email}</p>
                </div>
              </div>
              <Badge variant={socketState === "connected" ? "default" : "outline"}>
                {socketState === "connected" ? (
                  <span className="flex items-center gap-1"><Wifi className="h-3 w-3" /> Live</span>
                ) : socketState === "connecting" ? (
                  <span className="flex items-center gap-1"><Spinner className="h-3 w-3" /> Connecting</span>
                ) : (
                  <span className="flex items-center gap-1"><WifiOff className="h-3 w-3" /> Offline</span>
                )}
              </Badge>
            </div>
          )}
        </CardHeader>

        <Separator />

        <CardContent className="flex min-h-[640px] flex-col gap-4 pt-6">
          {!selectedExpert ? (
            <div className="flex flex-1 flex-col items-center justify-center text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                <MessageSquare className="h-7 w-7 text-primary" />
              </div>
              <p className="font-medium text-foreground">No conversation available</p>
              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                Select a valid expert from the chat list to open a room.
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => void fetchNextPage()}
                  disabled={!hasNextPage || isFetchingNextPage}
                >
                  {isFetchingNextPage ? "Loading..." : hasNextPage ? "Load older messages" : "No older messages"}
                </Button>
                <p className="text-xs text-muted-foreground">Dedicated room with {selectedExpert.username}</p>
              </div>

              <ScrollArea className="h-[460px] rounded-xl border border-border/60 bg-muted/20 px-4 py-4">
                {isMessagesLoading ? (
                  <div className="flex h-full items-center justify-center">
                    <Spinner className="h-5 w-5" />
                  </div>
                ) : isMessagesError ? (
                  <div className="flex h-full items-center justify-center text-center">
                    <div>
                      <p className="font-medium text-foreground">Unable to load messages</p>
                      <p className="mt-1 text-sm text-muted-foreground">Please try this chat again in a moment.</p>
                    </div>
                  </div>
                ) : messages.length > 0 ? (
                  <div className="flex flex-col gap-3">
                      {messages.map((message, index) => {
                      const isOwnMessage = message.sender_id !== receiverUserId

                      return (
                        <div
                          key={`${message.sender_id}-${message.receiver_id}-${message.messaged_at}-${index}`}
                          className={cn("flex", isOwnMessage ? "justify-end" : "justify-start")}
                        >
                          <div
                            className={cn(
                              "max-w-[78%] rounded-2xl px-4 py-3 shadow-sm",
                              isOwnMessage
                                ? "bg-primary text-primary-foreground"
                                : "bg-card text-card-foreground border border-border/60"
                            )}
                          >
                            <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.message}</p>
                            <p
                              className={cn(
                                "mt-2 text-[11px]",
                                isOwnMessage ? "text-primary-foreground/80" : "text-muted-foreground"
                              )}
                            >
                              {new Date(message.messaged_at).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                    <div ref={bottomRef} />
                  </div>
                ) : (
                  <div className="flex h-full items-center justify-center text-center">
                    <div>
                      <p className="font-medium text-foreground">No messages yet</p>
                      <p className="mt-1 text-sm text-muted-foreground">Send the first message to begin the conversation.</p>
                    </div>
                  </div>
                )}
              </ScrollArea>

              <form onSubmit={handleSend} className="flex flex-col gap-3">
                <Textarea
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  placeholder={`Write a message to ${selectedExpert.username}...`}
                  className="min-h-24 resize-none"
                />
                <div className="flex items-center justify-end gap-3">
                  <Button type="submit" disabled={draft.trim() === "" || socketState !== "connected"}>
                    Send
                    <SendHorizontal className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </form>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
