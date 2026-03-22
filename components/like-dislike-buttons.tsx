"use client"

import { Button } from "@/components/ui/button"
import { ThumbsUp, ThumbsDown } from "lucide-react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import {
  togglePostDislike,
  togglePostLike,
} from "@/lib/api/post"
import {
  toggleCommentDislike,
  toggleCommentLike,
} from "@/lib/api/comment"
import { showErrorToast } from "@/lib/showErrorToast"

interface LikeDislikeButtonsProps {
  likes: number
  dislikes: number
  postId?: number
  commentId?: number
}

export function LikeDislikeButtons({
  likes,
  dislikes,
  postId,
  commentId,
}: LikeDislikeButtonsProps) {
  const queryClient = useQueryClient()

  // Post mutations
  const postLike = useMutation({
    mutationFn: togglePostLike,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"], exact: false })
    },
    onError: (err) => showErrorToast(err),
  })

  const postDislike = useMutation({
    mutationFn: togglePostDislike,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"], exact: false })
    },
    onError: (err) => showErrorToast(err),
  })

  // Comment mutations
  const commentLike = useMutation({
    mutationFn: toggleCommentLike,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"], exact: false })
      queryClient.invalidateQueries({ queryKey: ["comments"], exact: false })
    },
    onError: (err) => showErrorToast(err),
  })

  const commentDislike = useMutation({
    mutationFn: toggleCommentDislike,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"], exact: false })
      queryClient.invalidateQueries({ queryKey: ["comments"], exact: false })
    },
    onError: (err) => showErrorToast(err),
  })

  const handleLike = () => {
    //  comment case
    if (postId && commentId) {
      commentLike.mutate({ postId, commentId })
      return
    }

    //  post case
    if (postId) {
      postLike.mutate(postId)
    }
  }

  const handleDislike = () => {
    //  comment case
    if (postId && commentId) {
      commentDislike.mutate({ postId, commentId })
      return
    }

    //  post case
    if (postId) {
      postDislike.mutate(postId)
    }
  }

  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleLike}
        className="gap-1.5 text-xs text-muted-foreground"
      >
        <ThumbsUp className="h-3.5 w-3.5" />
        {likes}
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={handleDislike}
        className="gap-1.5 text-xs text-muted-foreground"
      >
        <ThumbsDown className="h-3.5 w-3.5" />
        {dislikes}
      </Button>
    </div>
  )
}