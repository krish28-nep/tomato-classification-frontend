// tomato-classification-frontend/lib/api/post.ts
import axios from "../axios"

export const fetchPosts = async () => {
    const { data } = await axios.get("/post")
    return data.data
}

export const fetchPostById = async (id: number) => {
    const { data } = await axios.get(`/post/${id}`)
    return data.data
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