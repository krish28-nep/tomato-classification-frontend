// tomato-classification-frontend/app/(dashboard)/farmer/post/[id]/page.tsx
"use client"

import { use } from "react"
import Link from "next/link"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { ArrowLeft, Clock } from "lucide-react"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

import { UserBadge } from "@/components/user-badge"
import { LikeDislikeButtons } from "@/components/like-dislike-buttons"
import { ImageGallery } from "@/components/image-gallery"
import { CommentThread } from "@/components/comment-thread"
import { CommentForm } from "@/components/comment-form"

import { fetchPostById } from "@/lib/api/post"
import { useAuth } from "@/hooks/useAuth"
import { Role } from "@/types/user"
import type { Comment, Post } from "@/types/post"
import { addComment, fetchCommentByPostId } from "@/lib/api/comment"
import { toast } from "sonner"
import { showErrorToast } from "@/lib/showErrorToast"

export function timeAgo(dateString?: string) {
  if (!dateString) return "unknown time"

  const now = new Date()
  const date = new Date(dateString)
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (seconds < 60) return "just now"
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`

  return date.toLocaleDateString()
}

export default function FarmerPostDetail({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const postId = Number(id)
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const role = user?.role ?? Role.USER

  const {
    data: post,
    isLoading,
    isError,
  } = useQuery<Post | null>({
    queryKey: ["posts", postId],
    queryFn: () => fetchPostById(postId),
    enabled: Number.isFinite(postId),
  })

  const {
    data: comments,
    isLoading: isCommentLoading,
    isError: isCommentError,
  } = useQuery<Comment[]>({
    queryKey: ["comments", postId],
    queryFn: () => fetchCommentByPostId(postId),
    enabled: Number.isFinite(postId),
  })

  const addMutation = useMutation({
    mutationFn: addComment,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["posts"], exact: false });
      await queryClient.invalidateQueries({ queryKey: ["comments"], exact: false });

      toast.success("Your have comment successfully");
    },
    onError: (error) => showErrorToast(error),
  });

  const initials = post?.user.username
    .split(" ")
    .map((n) => n[0])
    .join("")

  if (isLoading || isCommentLoading) {
    return (
      <div className="max-w-3xl mx-auto text-sm text-muted-foreground">
        Loading post…
      </div>
    )
  }
  if (isError || !post || isCommentError) {
    return (
      <div className="max-w-3xl mx-auto flex flex-col gap-4">
        <Link href="/farmer/community">
          <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
            <ArrowLeft className="h-4 w-4" />
            Back to Community
          </Button>
        </Link>

        <Card>
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            This post does not exist or may have been removed.
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto">
      <Link href="/farmer/community">
        <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground -ml-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Community
        </Button>
      </Link>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border-2 border-primary/20">
              <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                {initials}
              </AvatarFallback>
            </Avatar>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">{post.user.username}</span>
                <UserBadge role={role} />
              </div>

              <div className="flex items-center gap-1 text-muted-foreground text-xs mt-0.5">
                <Clock className="h-3 w-3" />
                {timeAgo(post.create_at)}
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          <h1 className="text-xl font-bold text-balance">{post.title}</h1>

          {post.content && (
            <p className="text-sm text-muted-foreground whitespace-pre-line">
              {post.content}
            </p>
          )}

          {post.image && (
            <ImageGallery title={post.title} images={[post.image]} />
          )}

          {/* {post.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {post.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="text-xs font-normal text-muted-foreground"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )} */}

          <LikeDislikeButtons
            postId={post.id}
            likes={post.like ?? 0}
            dislikes={post.dislike ?? 0}
          />
        </CardContent>
      </Card>

      <Separator />

      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">
          Comments ({comments?.length ?? 0})
        </h2>

        {comments && comments?.length ? (
          <CommentThread postId={postId} comments={comments} />
        ) : (
          <p className="text-sm text-muted-foreground">
            No comments yet. Be the first to contribute.
          </p>
        )}
      </div>

      <Card>
        <CardHeader className="pb-2">
          <h3 className="text-sm font-semibold">Add a Comment</h3>
        </CardHeader>
        <CardContent>
          <CommentForm
            onSubmit={(data) =>
              addMutation.mutate({
                postId,
                dataToSend: data,
              })
            }
            isLoading={addMutation.isPending}
          />
        </CardContent>
      </Card>
    </div>
  )
}