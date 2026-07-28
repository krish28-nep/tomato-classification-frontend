"use client"

import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { updatePost } from "@/lib/api/post"
import { showErrorToast } from "@/lib/showErrorToast"
import { updatePostSchema } from "@/schemas/post.schema"
import type { PostUpdate } from "@/schemas/post.schema"
import type { Post } from "@/types/post"
import { useAuth } from "@/hooks/useAuth"
import type { ReactNode } from "react"

type EditPostModalProps = {
  post: Post
  children: ReactNode
}

export function EditPostModal({ post, children }: EditPostModalProps) {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()

  const form = useForm<PostUpdate>({
    resolver: zodResolver(updatePostSchema),
    defaultValues: {
      title: post.title,
      content: post.content,
    },
  })

  useEffect(() => {
    if (open) {
      form.reset({
        title: post.title,
        content: post.content,
      })
    }
  }, [form, open, post.content, post.title])

  const updateMutation = useMutation({
    mutationFn: updatePost,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["posts"] })
      await queryClient.invalidateQueries({ queryKey: ["dashboard-summary", user?.id] })
      toast.success("Post updated successfully")
      setOpen(false)
    },
    onError: (error) => showErrorToast(error),
  })

  const handleUpdate = (values: PostUpdate) => {
    updateMutation.mutate({
      id: post.id,
      dataToSend: {
        title: values.title,
        content: values.content,
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="sm:max-w-lg bg-card text-card-foreground">
        <DialogHeader>
          <DialogTitle>Edit Post</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleUpdate)} className="flex flex-col gap-4 pt-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor={`edit-title-${post.id}`}>Title</Label>
            <Input
              id={`edit-title-${post.id}`}
              placeholder="Post title"
              {...form.register("title")}
            />
            {form.formState.errors.title && (
              <p className="text-sm text-destructive">
                {form.formState.errors.title.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor={`edit-content-${post.id}`}>Content</Label>
            <Textarea
              id={`edit-content-${post.id}`}
              placeholder="Post content"
              className="min-h-[120px] resize-none"
              {...form.register("content")}
            />
            {form.formState.errors.content && (
              <p className="text-sm text-destructive">
                {form.formState.errors.content.message}
              </p>
            )}
          </div>

          {post.image && (
            <p className="text-xs text-muted-foreground">
              The existing image will stay unchanged.
            </p>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
