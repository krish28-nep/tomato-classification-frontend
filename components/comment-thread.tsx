"use client"

import { useState } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { UserBadge } from "@/components/user-badge"
import { LikeDislikeButtons } from "@/components/like-dislike-buttons"
import { ImageGallery } from "@/components/image-gallery"
import { Comment } from "@/types/post"
import { timeAgo } from "@/app/(dashboard)/farmer/post/[id]/page"
import { CommentForm } from "./comment-form"
import { fetchRepliesByCommentId, replyComment } from "@/lib/api/comment"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { showErrorToast } from "@/lib/showErrorToast"

interface CommentThreadProps {
  comments: Comment[]
  postId: number
  depth?: number
}

export function CommentThread({ comments, postId, depth = 0 }: CommentThreadProps) {
  return (
    <div className="flex flex-col gap-4">
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          postId={postId}
          depth={depth}
        />
      ))}
    </div>
  )
}

function CommentItem({ comment, postId, depth }: { comment: Comment; postId: number; depth: number }) {
  const queryClient = useQueryClient()
  const [isReplying, setIsReplying] = useState(false)
  const [showReplies, setShowReplies] = useState(false)

  const repliesQueryKey = ["comments", postId, comment.id, "replies"]

  const {
    data: replies,
    isFetching: isRepliesFetching,
  } = useQuery({
    queryKey: repliesQueryKey,
    queryFn: () => fetchRepliesByCommentId({ postId, commentId: comment.id }),
    enabled: showReplies,
  })

  const replyMutation = useMutation({
    mutationFn: replyComment,
    onSuccess: async (_, variables) => {
      setIsReplying(false)
      setShowReplies(true)
      await queryClient.invalidateQueries({
        queryKey: ["comments", postId, variables.commentId, "replies"],
      })
      await queryClient.invalidateQueries({ queryKey: ["comments"], exact: false })
    },
    onError: (err) => showErrorToast(err),
  })

  const visibleReplies = replies ?? comment.children ?? []
  const replyCount = replies?.length ?? comment.total_replies ?? comment.children?.length ?? 0
  const hasReplies = replyCount > 0
  const authorName = comment.user?.username ?? "Reply"
  const initials = authorName
    .split(" ")
    .map((n) => n[0])
    .join("")

  return (
    <div className="flex gap-3" style={{ marginLeft: depth * 16 }}>
      <Avatar className="h-8 w-8 shrink-0 border border-primary/20">
        <AvatarFallback className="bg-primary/10 text-primary text-xs">
          {initials}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1">
        <div className="bg-muted/50 rounded-lg p-3 border">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-sm">{authorName}</span>
            {comment.user && <UserBadge role={comment.user.role} />}
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

        <div className="flex items-center gap-2 mt-1">
          <LikeDislikeButtons
            postId={postId}
            commentId={comment.id}
            likes={comment.like}
            dislikes={comment.dislike}
          />

          <button
            onClick={() => {
              setIsReplying(true)
              setShowReplies(true)
            }}
            className="text-xs text-muted-foreground hover:text-primary"
          >
            Reply
          </button>

          {hasReplies && (
            <button
              onClick={() => setShowReplies((current) => !current)}
              className="text-xs text-muted-foreground hover:text-primary"
            >
              {showReplies ? `Hide replies (${replyCount})` : `Show replies (${replyCount})`}
            </button>
          )}
        </div>

        {isReplying && (
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

        {showReplies && hasReplies && (
          <div className="mt-3">
            {isRepliesFetching ? (
              <p className="text-xs text-muted-foreground">Loading replies...</p>
            ) : visibleReplies.length > 0 ? (
              <CommentThread
                comments={visibleReplies}
                postId={postId}
                depth={depth + 1}
              />
            ) : null}
          </div>
        )}
      </div>
    </div>
  )
}
