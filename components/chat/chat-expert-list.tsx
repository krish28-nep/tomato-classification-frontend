"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { MessageSquare, Search } from "lucide-react"

import { fetchApprovedExpertsForChat } from "@/lib/api/chat"
import { useAuth } from "@/hooks/useAuth"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"

type ChatExpertListProps = {
  heading: string
  description: string
  basePath: string
}

export function ChatExpertList({ heading, description, basePath }: ChatExpertListProps) {
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
      .filter((expert) => expert.email !== user?.email)
      .filter((expert) => (
        normalizedSearch === "" ||
        expert.username.toLowerCase().includes(normalizedSearch) ||
        expert.email.toLowerCase().includes(normalizedSearch)
      ))
  }, [experts, search, user?.email])

  return (
    <div className="flex flex-col gap-6 mx-auto max-w-6xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground font-heading">{heading}</h1>
        <p className="text-muted-foreground text-sm mt-1">{description}</p>
      </div>

      <Card className="border-border/60">
        <CardHeader className="space-y-4">
          <div>
            <CardTitle className="text-lg">Approved Experts</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Choose an expert to open a dedicated chat room.
            </p>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search experts..."
              className="pl-9"
            />
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <ScrollArea className="h-[620px] pr-3">
            <div className="flex flex-col gap-3">
              {isLoading ? (
                <div className="flex h-40 items-center justify-center">
                  <Spinner className="h-5 w-5" />
                </div>
              ) : isError ? (
                <div className="rounded-xl border border-dashed border-border px-4 py-8 text-center">
                  <p className="text-sm font-medium text-foreground">Unable to load experts</p>
                  <p className="mt-1 text-xs text-muted-foreground">Please try again in a moment.</p>
                </div>
              ) : filteredExperts.length > 0 ? (
                filteredExperts.map((expert) => {
                  const initials = expert.username
                    .split(" ")
                    .map((part) => part[0])
                    .join("")
                    .slice(0, 2)

                  return (
                    <Link
                      key={expert.id}
                      href={`${basePath}/${expert.id}`}
                      className={cn(
                        "flex items-center gap-3 rounded-xl border border-border/60 px-4 py-4 transition-colors",
                        "hover:border-primary/20 hover:bg-muted/40"
                      )}
                    >
                      <Avatar className="h-11 w-11 border border-primary/20">
                        <AvatarFallback className="bg-primary/10 text-primary text-xs">{initials}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-card-foreground line-clamp-1">{expert.username}</p>
                        <p className="text-xs text-muted-foreground line-clamp-1">{expert.email}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={expert.online ? "default" : "outline"} className="shrink-0">
                          {expert.online ? "Online" : "Offline"}
                        </Badge>
                        <div className="hidden sm:flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <MessageSquare className="h-4 w-4" />
                        </div>
                      </div>
                    </Link>
                  )
                })
              ) : (
                <div className="rounded-xl border border-dashed border-border px-4 py-8 text-center">
                  <p className="text-sm font-medium text-foreground">No approved experts found</p>
                  <p className="mt-1 text-xs text-muted-foreground">Try a different search or check back later.</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
