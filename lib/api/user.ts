// tomato-classification-frontend/lib/api/user.ts
import { OTPVerifyData } from "@/schemas/auth.schema"
import axios from "../axios"

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