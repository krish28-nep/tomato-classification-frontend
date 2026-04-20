// tomato-classification-frontend/lib/api/post.ts
import axios from "../axios"
import { PaginatedPostsResponse } from "@/types/post"

type FetchPostsPageParams = {
  limit?: number
  cursor?: string | null
}

export const fetchPosts = async () => {
  const { data } = await axios.get("/post")
  return data.data
}

export const fetchPostsPage = async ({
  limit = 10,
  cursor = null
}: FetchPostsPageParams = {}): Promise<PaginatedPostsResponse> => {
  const { data } = await axios.get("/post", {
    params: {
      limit,
      ...(cursor ? { cursor } : {})
    }
  })
  const posts = data?.data ?? []
  const pagination = data?.pagination
  const total = pagination?.total ?? posts.length

  return {
    posts,
    limit,
    total,
    hasMore: pagination?.has_more ?? false,
    nextCursor: pagination?.next_cursor ?? null
  }
}

export const fetchPostById = async (id: number) => {
  const { data } = await axios.get(`/post/${id}`)
  return data.data
}

export const fetchPostByUserId = async ({
  limit = 10,
  cursor = null
}: FetchPostsPageParams = {}): Promise<PaginatedPostsResponse> => {
  const { data } = await axios.get("/post/user", {
    params: {
      limit,
      ...(cursor ? { cursor } : {})
    }
  })
  const posts = data?.data ?? []
  const pagination = data?.pagination
  const total = pagination?.total ?? posts.length

  return {
    posts,
    limit,
    total,
    hasMore: pagination?.has_more ?? false,
    nextCursor: pagination?.next_cursor ?? null
  }
}


export const addPost = async (dataToSend: FormData) => {
  const { data } = await axios.post("/post", dataToSend)
  return data
}

export const deletePost = async (id: number) => {
  const { data } = await axios.delete(`/post/${id}`)
  return data
}

export const togglePostLike = async (id: number) => {
  const { data } = await axios.post(`/post/${id}/like`)
  return data
}

export const togglePostDislike = async (id: number) => {
  const { data } = await axios.post(`/post/${id}/dislike`)
  return data
}
