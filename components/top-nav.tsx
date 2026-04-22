// tomato-classification-frontend/components/top-nav.tsx
"use client"

import { FormEvent, useEffect, useMemo, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Bell, Search, LogOut, User, FileText, Users, ShieldCheck } from "lucide-react"
import { UserBadge } from "@/components/user-badge"
import { useAuth } from "@/hooks/useAuth"
import { Role } from "@/types/user"
import { fetchPosts } from "@/lib/api/post"
import { fetchApprovedExperts, fetchPendingExperts, fetchUsers } from "@/lib/api/user"
import { Post } from "@/types/post"

type SearchPreviewItem = {
  id: string
  title: string
  subtitle: string
  href: string
}

export function TopNav() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(searchParams.get("search") ?? "")
  const [isFocused, setIsFocused] = useState(false)

  const initials = user?.username
    .split(" ")
    .map((n) => n[0])
    .join("") || "U"

  const handleLogout = async () => {
    await logout()
    router.replace("/login")
    router.refresh()
  }

  const profilePath =
    user?.role === Role.ADMIN
      ? "/admin/profile"
      : user?.role === Role.FARMER
        ? "/farmer/profile"
        : "/expert/profile"

  useEffect(() => {
    setSearch(searchParams.get("search") ?? "")
  }, [searchParams])

  const searchConfig = useMemo(() => {
    if (pathname.startsWith("/admin/posts")) {
      return { target: "/admin/posts", placeholder: "Search posts", type: "posts" as const }
    }
    if (pathname.startsWith("/admin/experts")) {
      return { target: "/admin/experts", placeholder: "Search experts", type: "experts" as const }
    }
    if (pathname.startsWith("/admin")) {
      return { target: "/admin/users", placeholder: "Search users", type: "users" as const }
    }
    if (pathname.startsWith("/expert")) {
      return { target: "/expert/community", placeholder: "Search posts", type: "posts" as const }
    }
    return { target: "/farmer/community", placeholder: "Search posts", type: "posts" as const }
  }, [pathname])

  const normalizedSearch = search.trim().toLowerCase()
  const trimmedSearch = search.trim()

  const { data: topNavPosts = [] } = useQuery<Post[]>({
    queryKey: ["top-nav", "posts"],
    queryFn: fetchPosts,
    enabled: searchConfig.type === "posts",
    staleTime: 60 * 1000,
  })

  const { data: topNavUsers = [] } = useQuery({
    queryKey: ["top-nav", "users"],
    queryFn: fetchUsers,
    enabled: searchConfig.type === "users",
    staleTime: 60 * 1000,
  })

  const { data: approvedExperts = [] } = useQuery({
    queryKey: ["top-nav", "experts", "approved"],
    queryFn: fetchApprovedExperts,
    enabled: searchConfig.type === "experts",
    staleTime: 60 * 1000,
  })

  const { data: pendingExperts = [] } = useQuery({
    queryKey: ["top-nav", "experts", "pending"],
    queryFn: fetchPendingExperts,
    enabled: searchConfig.type === "experts",
    staleTime: 60 * 1000,
  })

  const previewItems = useMemo<SearchPreviewItem[]>(() => {
    if (normalizedSearch === "") return []

    if (searchConfig.type === "posts") {
      const postBasePath = pathname.startsWith("/expert")
        ? "/expert/post"
        : pathname.startsWith("/farmer")
          ? "/farmer/post"
          : "/admin/posts"

      return topNavPosts
        .filter((post) =>
          post.title.toLowerCase().includes(normalizedSearch) ||
          post.content.toLowerCase().includes(normalizedSearch) ||
          post.user?.username?.toLowerCase().includes(normalizedSearch)
        )
        .slice(0, 5)
        .map((post) => ({
          id: String(post.id),
          title: post.title,
          subtitle: post.user?.username ?? "Unknown author",
          href: postBasePath === "/admin/posts" ? `${searchConfig.target}?search=${encodeURIComponent(trimmedSearch)}` : `${postBasePath}/${post.id}`,
        }))
    }

    if (searchConfig.type === "users") {
      return topNavUsers
        .filter((user) =>
          user.username.toLowerCase().includes(normalizedSearch) ||
          user.email.toLowerCase().includes(normalizedSearch) ||
          user.role.toLowerCase().includes(normalizedSearch)
        )
        .slice(0, 5)
        .map((user) => ({
          id: user.email,
          title: user.username,
          subtitle: `${user.email} • ${user.role}`,
          href: `${searchConfig.target}?search=${encodeURIComponent(trimmedSearch)}`,
        }))
    }

    const allExperts = [...approvedExperts, ...pendingExperts]
    return allExperts
      .filter((expert) =>
        expert.username.toLowerCase().includes(normalizedSearch) ||
        expert.email.toLowerCase().includes(normalizedSearch) ||
        expert.role.toLowerCase().includes(normalizedSearch)
      )
      .slice(0, 5)
      .map((expert) => ({
        id: expert.email,
        title: expert.username,
        subtitle: `${expert.email} • ${expert.online ? "Online" : "Offline"}`,
        href: `${searchConfig.target}?search=${encodeURIComponent(trimmedSearch)}`,
      }))
  }, [
    normalizedSearch,
    trimmedSearch,
    searchConfig.target,
    searchConfig.type,
    pathname,
    topNavPosts,
    topNavUsers,
    approvedExperts,
    pendingExperts,
  ])

  const previewIcon = searchConfig.type === "users"
    ? <Users className="h-4 w-4 text-primary" />
    : searchConfig.type === "experts"
      ? <ShieldCheck className="h-4 w-4 text-primary" />
      : <FileText className="h-4 w-4 text-primary" />

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const params = new URLSearchParams(searchParams.toString())
    const normalizedSearch = search.trim()

    if (normalizedSearch) {
      params.set("search", normalizedSearch)
    } else {
      params.delete("search")
    }

    const nextUrl = params.toString()
      ? `${searchConfig.target}?${params.toString()}`
      : searchConfig.target

    router.push(nextUrl)
  }

  return (
    <header className="h-16 border-b border-border bg-card flex items-center justify-between px-4 lg:px-6 sticky top-0 z-40">
      <div className="flex items-center gap-3 flex-1">
        <div className="lg:hidden flex items-center gap-2 mr-2">
          <div className="h-7 w-7 rounded-md bg-primary flex items-center justify-center">
            <svg className="h-4 w-4 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
            </svg>
          </div>
        </div>
        <form
          onSubmit={handleSearch}
          className="relative max-w-sm w-full hidden sm:block"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 150)}
        >
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={searchConfig.placeholder}
            className="pl-9 h-9 bg-muted/50 border-border/50"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {isFocused && normalizedSearch !== "" && (
            <Card className="absolute top-11 left-0 right-0 z-50 border-border/60 shadow-lg">
              <CardContent className="p-2">
                {previewItems.length > 0 ? (
                  <div className="flex flex-col gap-1">
                    {previewItems.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        className="flex w-full items-start gap-3 rounded-md px-3 py-2 text-left hover:bg-muted/60 transition-colors"
                        onMouseDown={(event) => {
                          event.preventDefault()
                          setIsFocused(false)
                          router.push(item.href)
                        }}
                      >
                        <div className="mt-0.5">{previewIcon}</div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-card-foreground line-clamp-1">{item.title}</p>
                          <p className="text-xs text-muted-foreground line-clamp-1">{item.subtitle}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="px-3 py-2 text-sm text-muted-foreground">No matching results found.</p>
                )}
              </CardContent>
            </Card>
          )}
        </form>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="relative h-9 w-9 text-muted-foreground">
          <Bell className="h-4.5 w-4.5" />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive" />
          <span className="sr-only">Notifications</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 px-2 h-9">
              <Avatar className="h-7 w-7 border border-primary/20">
                <AvatarFallback className="bg-primary/10 text-primary text-xs">{initials}</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium text-card-foreground hidden sm:inline">{user?.username || "User"}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="flex flex-col gap-1">
              <span className="text-sm">{user?.username || "User"}</span>
              <span className="text-xs text-muted-foreground font-normal">{user?.email || ""}</span>
              <UserBadge role={user?.role ?? Role.FARMER} />
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push(profilePath)}>
              <User className="h-4 w-4 mr-2" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout} className="text-destructive">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
