// tomato-classification-frontend/components/auth/email-otp-modal.tsx
"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { otpVerifySchema, OTPVerifyData } from "@/schemas/auth.schema"
import { verifyOtp, resendOtp } from "@/lib/api/user"
import { toast } from "sonner"
import { showErrorToast } from "@/lib/showErrorToast"

type Props = {
  open: boolean
  email: string
  onSuccess: () => void
  onClose: () => void
}

export default function EmailOtpModal({ open, email, onSuccess, onClose }: Props) {
  const MAX_RESEND = 3
  const SHORT_COOLDOWN = 10
  const LONG_COOLDOWN = 300

  const [timer, setTimer] = useState(SHORT_COOLDOWN)
  const [canResend, setCanResend] = useState(false)
  const [resendCount, setResendCount] = useState(0)

  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<OTPVerifyData>({
      resolver: zodResolver(otpVerifySchema),
      defaultValues: { email },
    })

  useEffect(() => {
    if (open) {
      setTimer(SHORT_COOLDOWN)
      setCanResend(false)
      setResendCount(0)
    }
  }, [open])

  useEffect(() => {
    if (timer <= 0) {
      setCanResend(true)
      return
    }
    const interval = setInterval(() => setTimer((t) => t - 1), 1000)
    return () => clearInterval(interval)
  }, [timer])

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${s.toString().padStart(2, "0")}`
  }

  const handleVerify = async (data: OTPVerifyData) => {
    try {
      await verifyOtp(data)
      toast.success("Email verified successfully")
      onSuccess()
    } catch (error) {
      showErrorToast(error)
    }
  }

  const handleResend = async () => {
    if (!canResend) return
    try {
      await resendOtp(email)
      toast.success("OTP resent successfully")

      const newCount = resendCount + 1
      setResendCount(newCount)

      if (newCount >= MAX_RESEND) setTimer(LONG_COOLDOWN)
      else setTimer(SHORT_COOLDOWN)

      setCanResend(false)
    } catch (error) {
      showErrorToast(error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Email Verification</DialogTitle>
          <DialogDescription>
            Enter the 6 digit code sent to your email
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleVerify)} className="space-y-4">
          <div className="space-y-2">
            <Label>OTP Code</Label>
            <Input placeholder="123456" maxLength={6} {...register("otp")} />
            {errors.otp && (
              <p className="text-sm text-red-500">{errors.otp.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Verifying..." : "Verify OTP"}
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            {canResend ? (
              <button
                type="button"
                onClick={handleResend}
                className="text-primary hover:underline"
              >
                Resend OTP
              </button>
            ) : (
              <span>Resend OTP in {formatTime(timer)}</span>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}