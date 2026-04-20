// tomato-classification-frontend/lib/api/user.ts
import { OTPVerifyData } from "@/schemas/auth.schema"
import axios from "../axios"

export type AdminUser = {
    id?: number
    username: string
    email: string
    role: "user" | "expert" | "admin"
    online?: boolean
}

export const verifyOtp = async (dataToSend: OTPVerifyData) => {
    const { data } = await axios.post("/auth/verify-otp", dataToSend)
    return data
}

export const resendOtp = async (email: string) => {
    const { data } = await axios.post("/auth/resend-otp", { email })
    return data
}

export const fetchMe = async () => {
    const { data } = await axios.get("/user/me")
    return data.data
}

export const fetchUsers = async (): Promise<AdminUser[]> => {
    const { data } = await axios.get("/user/")
    return data.data ?? []
}

export const fetchApprovedExperts = async (): Promise<AdminUser[]> => {
    const { data } = await axios.get("/user/expert")
    return data.data ?? []
}

export const fetchPendingExperts = async (): Promise<AdminUser[]> => {
    const { data } = await axios.get("/user/pending-expert")
    return data.data ?? []
}

export const approveExpert = async (userId: number) => {
    const { data } = await axios.patch(`/user/${userId}/approve`)
    return data
}

export const rejectExpert = async (userId: number) => {
    const { data } = await axios.patch(`/user/${userId}/reject`)
    return data
}
