"use client"

import { useDeferredValue, useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { PostCard } from "@/components/post-card"
import { CreatePostModal } from "@/components/create-post-modal"
import { useInfiniteQuery } from "@tanstack/react-query"
import { fetchPostsPage } from "@/lib/api/post"
import { Spinner } from "@/components/ui/spinner"
import { useInView } from "react-intersection-observer"
import { useSearchParams } from "next/navigation"

const POSTS_PER_PAGE = 10

export default function ExpertCommunityPage() {
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(searchParams.get("search") ?? "")
  const deferredSearch = useDeferredValue(search.trim())
  const { ref, inView } = useInView({
    rootMargin: "200px 0px",
    threshold: 0
  })

  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    isError
  } = useInfiniteQuery({
    queryKey: ["posts", "expert-community", deferredSearch],
    initialPageParam: null as string | null,
    queryFn: ({ pageParam }) =>
      fetchPostsPage({
        limit: POSTS_PER_PAGE,
        cursor: pageParam
      }),
    getNextPageParam: (lastPage) => (
      lastPage.hasMore ? lastPage.nextCursor : undefined
    )
  })

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      void fetchNextPage()
    }
  }, [fetchNextPage, hasNextPage, inView, isFetchingNextPage])

  useEffect(() => {
    setSearch(searchParams.get("search") ?? "")
  }, [searchParams])

  const allPosts = data?.pages.flatMap((page) => page.posts) ?? []
  const totalPosts = allPosts.length
  const posts = allPosts.filter((post) => {
    const normalizedSearch = deferredSearch.toLowerCase()

    return (
      normalizedSearch === "" ||
      post.title.toLowerCase().includes(normalizedSearch) ||
      post.content.toLowerCase().includes(normalizedSearch)
    )
  })

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-foreground font-heading">Community Feed</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Answer farmer questions, share solutions, and mark verified answers.
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            {totalPosts} total posts
          </p>
        </div>
        <CreatePostModal />
      </div>

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
      </div>

      {isLoading ? (
        <div className="w-full h-[50vh] flex items-center justify-center">
          <Spinner />
        </div>
      ) : isError ? (
        <div className="text-center py-12">
          <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center mx-auto mb-3">
            <Search className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="font-semibold text-foreground">Unable to load posts</h3>
          <p className="text-sm text-muted-foreground mt-1">Please try again in a moment.</p>
        </div>
      ) : posts.length > 0 ? (
        <div className="flex flex-col gap-4">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} basePath="/expert" />
          ))}
          <div ref={ref} className="flex min-h-10 items-center justify-center py-2">
            {isFetchingNextPage ? <Spinner /> : !hasNextPage ? (
              <p className="text-sm text-muted-foreground">You&apos;ve reached the end of the feed.</p>
            ) : null}
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center mx-auto mb-3">
            <Search className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="font-semibold text-foreground">No posts found</h3>
          <p className="text-sm text-muted-foreground mt-1">Try adjusting your search.</p>
        </div>
      )}
    </div>
  )
}
