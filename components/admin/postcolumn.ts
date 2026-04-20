import React from "react"
import { Badge } from "@/components/ui/badge"
import { Post } from "@/types/post"
import { AdminTableColumn } from "@/components/admin/table-types"
import { PostPreviewButton } from "@/components/admin/post-preview-button"

export const postColumns: AdminTableColumn<Post>[] = [
  {
    key: "serialNumber",
    header: "S.N",
    cell: (_, index) =>
      React.createElement("span", { className: "text-muted-foreground" }, index + 1),
  },
  {
    key: "title",
    header: "Post",
    cell: (post) =>
      React.createElement(
        "div",
        { className: "max-w-md" },
        React.createElement("p", { className: "font-medium text-card-foreground line-clamp-1" }, post.title),
        React.createElement("p", { className: "text-xs text-muted-foreground line-clamp-1" }, post.content)
      ),
  },
  {
    key: "user",
    header: "Author",
    cell: (post) =>
      React.createElement(
        "div",
        null,
        React.createElement("p", { className: "text-sm text-card-foreground" }, post.user?.username ?? "Unknown"),
        React.createElement("p", { className: "text-xs text-muted-foreground" }, post.user?.email ?? "")
      ),
  },
  {
    key: "engagement",
    header: "Engagement",
    cell: (post) =>
      React.createElement(
        "div",
        { className: "flex items-center gap-2" },
        React.createElement(Badge, { variant: "outline" }, `${post.like ?? 0} likes`),
        React.createElement(Badge, { variant: "outline", className: "text-muted-foreground" }, `${post.dislike ?? 0} dislikes`)
      ),
  },
  {
    key: "create_at",
    header: "Created",
    cell: (post) =>
      React.createElement(
        "span",
        { className: "text-muted-foreground" },
        post.create_at ? new Date(post.create_at).toLocaleDateString() : "Unknown"
      ),
  },
  {
    key: "actions",
    header: "Actions",
    cell: (post) => React.createElement(PostPreviewButton, { post }),
  },
]
