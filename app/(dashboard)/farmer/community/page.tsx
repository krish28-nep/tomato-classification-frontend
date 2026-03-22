// tomato-classification-frontend/app/(dashboard)/farmer/community/page.tsx
"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Filter } from "lucide-react"
import { PostCard } from "@/components/post-card"
import { CreatePostModal } from "@/components/create-post-modal"
import { useQuery } from "@tanstack/react-query"
import { fetchPosts } from "@/lib/api/post"
import { Post } from "@/types/post"

const tags = ["All", "disease", "prevention", "treatment", "help", "guide", "organic"]

export default function FarmerCommunityPage() {
  const [search, setSearch] = useState("")
  const [activeTag, setActiveTag] = useState("All")

  const { data } = useQuery<Post[]>({
    queryKey: ["posts"],
    queryFn: fetchPosts
  })

  const filteredPosts =
    data?.filter((post) => {
      const matchesSearch =
        search === "" ||
        post.title.toLowerCase().includes(search.toLowerCase()) ||
        post.content.toLowerCase().includes(search.toLowerCase());

      return matchesSearch;
    }) ?? [];

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-foreground font-heading">Community Feed</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Browse discussions, ask questions, and learn from experts.
          </p>
        </div>
        <CreatePostModal />
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search posts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
          {tags.map((tag) => (
            <Badge
              key={tag}
              variant={activeTag === tag ? "default" : "outline"}
              className={`cursor-pointer text-xs ${activeTag === tag
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
                }`}
              onClick={() => setActiveTag(tag)}
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      {/* Posts */}
      {filteredPosts.length > 0 ? (
        <div className="flex flex-col gap-4">
          {filteredPosts.map((post) => (
            <PostCard key={post.id} post={post} basePath="/farmer" />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center mx-auto mb-3">
            <Search className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="font-semibold text-foreground">No posts found</h3>
          <p className="text-sm text-muted-foreground mt-1">Try adjusting your search or filters.</p>
        </div>
      )}
    </div>
  )
}
