"use client"

import { useState } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { UserBadge } from "@/components/user-badge"
import { LikeDislikeButtons } from "@/components/like-dislike-buttons"
import { ImageGallery } from "@/components/image-gallery"
import { Comment } from "@/types/post"
import { timeAgo } from "@/app/(dashboard)/farmer/post/[id]/page"
import { CommentForm } from "./comment-form"
import { replyComment } from "@/lib/api/comment"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { showErrorToast } from "@/lib/showErrorToast"

interface CommentThreadProps {
  comments: Comment[]
  postId: number
  depth?: number
}

export function CommentThread({ comments, postId, depth = 0 }: CommentThreadProps) {
  const queryClient = useQueryClient()
  const [replyingTo, setReplyingTo] = useState<number | null>(null)

  const replyMutation = useMutation({
    mutationFn: replyComment,
    onSuccess: async () => {
      setReplyingTo(null)
      await queryClient.invalidateQueries({ queryKey: ["comments"], exact: false })
    },
    onError: (err) => showErrorToast(err),
  })

  return (
    <div className="flex flex-col gap-4">
      {comments.map((comment) => {
        const initials = comment.user.username
          .split(" ")
          .map((n) => n[0])
          .join("")

        return (
          <div key={comment.id} className="flex gap-3" style={{ marginLeft: depth * 16 }}>
            <Avatar className="h-8 w-8 shrink-0 border border-primary/20">
              <AvatarFallback className="bg-primary/10 text-primary text-xs">
                {initials}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="bg-muted/50 rounded-lg p-3 border">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm">{comment.user.username}</span>
                  <UserBadge role={comment.user.role} />
                  <span className="text-xs text-muted-foreground">
                    {timeAgo(comment.created_at)}
                  </span>
                </div>

                <p className="text-sm">{comment.content}</p>

                {comment.image && (
                  <div className="mt-2">
                    <ImageGallery images={[comment.image]} title="" />
                  </div>
                )}
              </div>

              {/* ACTIONS */}
              <div className="flex items-center gap-2 mt-1">
                <LikeDislikeButtons
                  postId={postId}
                  commentId={comment.id}
                  likes={comment.like}
                  dislikes={comment.dislike}
                />

                <button
                  onClick={() => setReplyingTo(comment.id)}
                  className="text-xs text-muted-foreground hover:text-primary"
                >
                  Reply
                </button>
              </div>

              {/* REPLY FORM */}
              {replyingTo === comment.id && (
                <div className="mt-2">
                  <CommentForm
                    onSubmit={(data) =>
                      replyMutation.mutate({
                        postId,
                        commentId: comment.id,
                        dataToSend: data,
                      })
                    }
                    isLoading={replyMutation.isPending}
                  />
                </div>
              )}

              {/* CHILD COMMENTS (RECURSIVE) */}
              {comment.children && comment.children.length > 0 && (
                <CommentThread
                  comments={comment.children}
                  postId={postId}
                  depth={depth + 1}
                />
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}