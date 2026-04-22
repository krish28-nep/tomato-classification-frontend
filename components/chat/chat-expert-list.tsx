"use client"

import { MessageSquareText } from "lucide-react"

import { ChatSidebar } from "@/components/chat/chat-sidebar"

type ChatExpertListProps = {
  heading: string
  description: string
  basePath: string
}

export function ChatExpertList({ heading, description, basePath }: ChatExpertListProps) {
  return (
    <div className="flex w-full flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground font-heading">{heading}</h1>
        <p className="text-muted-foreground text-sm mt-1">{description}</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[390px_minmax(0,1fr)]">
        <ChatSidebar basePath={basePath} />

        <section className="hidden min-h-[720px] flex-col items-center justify-center rounded-2xl border border-border/60 bg-card lg:flex">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <MessageSquareText className="h-10 w-10 text-primary" />
          </div>
          <h2 className="mt-5 text-xl font-semibold text-card-foreground">Select a chat</h2>
          <p className="mt-2 max-w-md text-center text-sm text-muted-foreground">
            Choose an expert from the left sidebar to open a dedicated conversation room.
          </p>
        </section>
      </div>
    </div>
  )
}
