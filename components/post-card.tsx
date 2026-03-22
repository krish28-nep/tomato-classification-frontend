"use client"

import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MessageCircle, Clock } from "lucide-react"
import { UserBadge } from "@/components/user-badge"
import { LikeDislikeButtons } from "@/components/like-dislike-buttons"
import { ImageGallery } from "@/components/image-gallery"
import { Post } from "@/types/post"
import { Role } from "@/types/user"

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

interface PostCardProps {
  post: Post
  basePath?: string
}

const findInitals = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
}

export function PostCard({ post, basePath = "/farmer" }: PostCardProps) {

  return (
    <Card className="border-border/60 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border-2 border-primary/20">
              <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                {findInitals(post.user.username)}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm text-card-foreground">{post?.user.username || "Ram"}</span>
                <UserBadge role={post.user?.role || Role.USER} />
              </div>
              <div className="flex items-center gap-1 text-muted-foreground text-xs mt-0.5">
                <Clock className="h-3 w-3" />
                {timeAgo(post.create_at)}
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <Link href={`${basePath}/post/${post.id}`} className="group">
          <h3 className="font-semibold text-base text-card-foreground group-hover:text-primary transition-colors mb-2 text-balance">
            {post.title}
          </h3>
        </Link>
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">{post.content}</p>
        {post.image && (
          <div className="mt-3">
            <ImageGallery title={post.title} images={[post.image]} />
          </div>
        )}
        {/* {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs font-normal text-muted-foreground">
                {tag}
              </Badge>
            ))}
          </div>
        )} */}
      </CardContent>
      <CardFooter className="pt-0 border-t border-border/40">
        <div className="flex items-center justify-between w-full pt-3">
          <LikeDislikeButtons postId={post.id} likes={post.like} dislikes={post.dislike} />
          <Link href={`${basePath}/post/${post.id}`}>
            <Button variant="ghost" size="sm" className="gap-1.5 text-xs text-muted-foreground">
              <MessageCircle className="h-3.5 w-3.5" />
              {post.comments && post.comments.length || 0} {post.comments && post.comments.length === 1 ? "comment" : "comments"}
            </Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  )
}
