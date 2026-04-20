"use client"

import { Eye, ThumbsDown, ThumbsUp } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ImageGallery } from "@/components/image-gallery"
import { Post } from "@/types/post"

type PostPreviewButtonProps = {
  post: Post
}

export function PostPreviewButton({ post }: PostPreviewButtonProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
          <Eye className="h-4 w-4" />
          <span className="sr-only">Preview post</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl leading-snug">{post.title}</DialogTitle>
          <DialogDescription>
            Posted by {post.user?.username ?? "Unknown"} {post.create_at ? `on ${new Date(post.create_at).toLocaleDateString()}` : ""}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          {post.image && (
            <ImageGallery title={post.title} images={[post.image]} />
          )}

          {post.content && (
            <div className="rounded-lg border bg-muted/30 p-4">
              <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
                {post.content}
              </p>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="gap-1.5">
              <ThumbsUp className="h-3.5 w-3.5" />
              {post.like ?? 0} likes
            </Badge>
            <Badge variant="outline" className="gap-1.5 text-muted-foreground">
              <ThumbsDown className="h-3.5 w-3.5" />
              {post.dislike ?? 0} dislikes
            </Badge>
            <Badge variant="outline" className="capitalize">
              {post.user?.role ?? "unknown"}
            </Badge>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
