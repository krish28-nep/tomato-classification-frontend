"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { z } from "zod"

import tomatoLogo from "@/public/tomato.svg"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { resendOtp, verifyOtp } from "@/lib/api/user"
import { showErrorToast } from "@/lib/showErrorToast"

const verifyEmailSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  otp: z.string().regex(/^\d{6}$/, "OTP must be exactly 6 digits"),
})

type VerifyEmailData = z.infer<typeof verifyEmailSchema>

function VerifyEmailForm() {
  const MAX_RESEND = 3
  const SHORT_COOLDOWN = 10
  const LONG_COOLDOWN = 300

  const router = useRouter()
  const searchParams = useSearchParams()
  const [isResending, setIsResending] = useState(false)
  const [emailLocked, setEmailLocked] = useState(false)
  const [timer, setTimer] = useState(0)
  const [canResend, setCanResend] = useState(false)
  const [resendCount, setResendCount] = useState(0)

  const {
    register,
    handleSubmit,
    getValues,
    reset,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<VerifyEmailData>({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: {
      email: searchParams.get("email") ?? "",
      otp: "",
    },
  })

  useEffect(() => {
    const email = searchParams.get("email") ?? ""

    reset({
      email,
      otp: "",
    })
    setEmailLocked(Boolean(email))
    setTimer(email ? SHORT_COOLDOWN : 0)
    setCanResend(false)
    setResendCount(0)
  }, [reset, searchParams])

  useEffect(() => {
    if (!emailLocked || timer <= 0) {
      setCanResend(emailLocked)
      return
    }

    const interval = setInterval(() => setTimer((time) => time - 1), 1000)
    return () => clearInterval(interval)
  }, [emailLocked, timer])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const startCooldown = (count: number) => {
    setTimer(count >= MAX_RESEND ? LONG_COOLDOWN : SHORT_COOLDOWN)
    setCanResend(false)
  }

  const handleVerify = async (data: VerifyEmailData) => {
    try {
      await verifyOtp(data)
      toast.success("Email verified successfully")
      router.push("/login")
    } catch (error) {
      showErrorToast(error, "OTP verification failed")
    }
  }

  const handleSendOtp = async () => {
    const isEmailValid = await trigger("email")
    if (!isEmailValid || isResending) return

    setIsResending(true)

    try {
      await resendOtp(getValues("email"))
      toast.success("OTP sent successfully")
      setEmailLocked(true)
      setResendCount(0)
      startCooldown(0)
    } catch (error) {
      showErrorToast(error, "Unable to send OTP")
    } finally {
      setIsResending(false)
    }
  }

  const handleResend = async () => {
    if (!canResend || isResending) return

    setIsResending(true)

    try {
      await resendOtp(getValues("email"))
      toast.success("OTP resent successfully")

      const newCount = resendCount + 1
      setResendCount(newCount)
      startCooldown(newCount)
    } catch (error) {
      showErrorToast(error, "Unable to resend OTP")
    } finally {
      setIsResending(false)
    }
  }

  const handleEditEmail = () => {
    setEmailLocked(false)
    setCanResend(false)
    setTimer(0)
    setResendCount(0)
    reset({ email: getValues("email"), otp: "" })
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center mb-4">
            <Image src={tomatoLogo} className="h-10 w-10" width={100} height={100} alt="tomato logo" />
          </div>
          <h1 className="text-2xl font-bold text-foreground font-heading">
            Verify Email
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Verify your account before signing in
          </p>
        </div>

        <Card className="shadow-lg border-border/50">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl">
              {emailLocked ? "Enter verification code" : "Send verification code"}
            </CardTitle>
            <CardDescription>
              Use your registered email to verify or resend OTP
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit(handleVerify)} className="space-y-2">
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between gap-3">
                  <Label htmlFor="email">Email</Label>
                  {emailLocked && (
                    <button
                      type="button"
                      onClick={handleEditEmail}
                      className="text-sm text-primary font-medium hover:underline"
                    >
                      Edit
                    </button>
                  )}
                </div>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  readOnly={emailLocked}
                  className={emailLocked ? "bg-muted" : ""}
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              {emailLocked && (
                <div className="flex flex-col gap-2">
                  <Label htmlFor="otp">OTP Code</Label>
                  <Input
                    id="otp"
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="123456"
                    {...register("otp")}
                  />
                  {errors.otp && (
                    <p className="text-sm text-red-500">{errors.otp.message}</p>
                  )}
                </div>
              )}
            </CardContent>

            <CardFooter className="flex flex-col gap-3">
              {emailLocked ? (
                <>
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Verifying..." : "Verify OTP"}
                  </Button>

                  {canResend ? (
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      disabled={isResending}
                      onClick={handleResend}
                    >
                      {isResending ? "Sending OTP..." : "Resend OTP"}
                    </Button>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Resend OTP in {formatTime(timer)}
                    </p>
                  )}
                </>
              ) : (
                <Button
                  type="button"
                  className="w-full"
                  disabled={isResending}
                  onClick={handleSendOtp}
                >
                  {isResending ? "Sending OTP..." : "Send OTP"}
                </Button>
              )}

              <Link href="/login" className="text-sm text-primary font-medium hover:underline">
                Back to login
              </Link>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={null}>
      <VerifyEmailForm />
    </Suspense>
  )
}
