"use client"

import { useQuery } from "@tanstack/react-query"
import { useSearchParams } from "next/navigation"
import { FileText, ThumbsDown, ThumbsUp } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { UserDataTable } from "@/components/admin/user-data-table"
import { postColumns } from "@/components/admin/postcolumn"
import { fetchPostsPage } from "@/lib/api/post"

export default function AdminPostsPage() {
  const searchParams = useSearchParams()
  const {
    data,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["admin", "posts"],
    queryFn: () => fetchPostsPage({ limit: 100 }),
  })

  const search = (searchParams.get("search") ?? "").trim().toLowerCase()
  const posts = (data?.posts ?? []).filter((post) => (
    search === "" ||
    post.title.toLowerCase().includes(search) ||
    post.content.toLowerCase().includes(search) ||
    post.user?.username?.toLowerCase().includes(search) ||
    post.user?.email?.toLowerCase().includes(search)
  ))
  const totalPosts = data?.total ?? posts.length
  const totalLikes = posts.reduce((sum, post) => sum + (post.like ?? 0), 0)
  const totalDislikes = posts.reduce((sum, post) => sum + (post.dislike ?? 0), 0)

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-foreground font-heading">Posts</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Review community posts and monitor engagement.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-card-foreground">{totalPosts}</p>
              <p className="text-xs text-muted-foreground">Total Posts</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="h-11 w-11 rounded-xl bg-accent/20 flex items-center justify-center">
              <ThumbsUp className="h-5 w-5 text-accent-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold text-card-foreground">{totalLikes}</p>
              <p className="text-xs text-muted-foreground">Total Likes</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="h-11 w-11 rounded-xl bg-secondary flex items-center justify-center">
              <ThumbsDown className="h-5 w-5 text-secondary-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold text-card-foreground">{totalDislikes}</p>
              <p className="text-xs text-muted-foreground">Total Dislikes</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {isLoading ? (
        <div className="w-full h-[45vh] flex items-center justify-center">
          <Spinner />
        </div>
      ) : isError ? (
        <Card>
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            Unable to load posts. Please try again.
          </CardContent>
        </Card>
      ) : (
        <UserDataTable
          columns={postColumns}
          data={posts}
          emptyMessage="No posts found."
        />
      )}
    </div>
  )
}
