// tomato-classification-frontend/components/comment-form.tsx
"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ImagePlus, Send, X } from "lucide-react"
import { CommentCreate } from "@/schemas/comment.schema"

interface CommentFormProps {
  onSubmit: (data: CommentCreate) => void
  isLoading?: boolean
}

export function CommentForm({ onSubmit, isLoading }: CommentFormProps) {
  const [content, setContent] = useState("")

  const handleSubmit = () => {
    if (!content.trim()) return

    onSubmit({ content })
    setContent("") // clear after submit
  }

  return (
    <div className="flex flex-col gap-3">
      <Textarea
        placeholder="Write a comment..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="min-h-[80px] resize-none bg-card text-card-foreground"
      />
      <div className="flex items-center justify-between">
        <Button size="sm" onClick={handleSubmit} disabled={isLoading} className="gap-1.5">
          <Send className="h-3.5 w-3.5" />
          Comment
        </Button>
      </div>
    </div>
  )
}
