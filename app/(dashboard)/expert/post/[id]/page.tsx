"use client"

import { use } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Clock } from "lucide-react"
import { UserBadge } from "@/components/user-badge"
import { LikeDislikeButtons } from "@/components/like-dislike-buttons"
import { ImageGallery } from "@/components/image-gallery"
import { CommentThread } from "@/components/comment-thread"
import { CommentForm } from "@/components/comment-form"
import { mockPosts } from "@/lib/mock-data"

function timeAgo(dateString: string) {
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

export default function ExpertPostDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const post = mockPosts.find((p) => p.id === id) || mockPosts[0]
  const initials = post.user.name
    .split(" ")
    .map((n) => n[0])
    .join("")

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto">
      <Link href="/expert/community">
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
                <span className="font-medium text-sm text-card-foreground">{post.user.name}</span>
                <UserBadge role={post.user.role} />
              </div>
              <div className="flex items-center gap-1 text-muted-foreground text-xs mt-0.5">
                <Clock className="h-3 w-3" />
                {timeAgo(post.createdAt)}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <h1 className="text-xl font-bold text-card-foreground text-balance">{post.title}</h1>
          <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{post.content}</p>
          {post.images.length > 0 && <ImageGallery images={post.images} />}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs font-normal text-muted-foreground">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
          <div className="pt-2">
            <LikeDislikeButtons initialLikes={post.likes} initialDislikes={post.dislikes} />
          </div>
        </CardContent>
      </Card>

      <Separator />

      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-foreground font-heading">
          Comments ({post.comments.length})
        </h2>
        <CommentThread comments={post.comments} />
      </div>

      <Card>
        <CardHeader className="pb-2">
          <h3 className="text-sm font-semibold text-card-foreground">Add Expert Response</h3>
        </CardHeader>
        <CardContent>
          <CommentForm />
        </CardContent>
      </Card>
    </div>
  )
}
