// tomato-classification-frontend/lib/api/comment.ts
import { CommentCreate } from "@/schemas/comment.schema"
import axios from "../axios"

export const fetchCommentByPostId = async (postId: number) => {
    const { data } = await axios.get(`/post/${postId}/comment`)
    return data.data
}

export const fetchPostById = async (id: number) => {
    const { data } = await axios.get(`/post/${id}`)
    return data.data
}

export const addComment = async ({ postId, dataToSend }: { postId: number, dataToSend: CommentCreate }) => {
    const { data } = await axios.post(`/post/${postId}/comment`, dataToSend)
    return data
}

export const toggleCommentLike = async ({ postId, commentId }: { postId: number, commentId: number }) => {
    const { data } = await axios.post(`/post/${postId}/comment/${commentId}/like`)
    return data
}

export const toggleCommentDislike = async ({ postId, commentId }: { postId: number, commentId: number }) => {
    const { data } = await axios.post(`/post/${postId}/comment/${commentId}/dislike`)
    return data
}

export const replyComment = async ({ postId, commentId, dataToSend }: { postId: number, commentId: number, dataToSend: CommentCreate }) => {
    const { data } = await axios.post(`/post/${postId}/comment/${commentId}/reply`, dataToSend)
    return data
}