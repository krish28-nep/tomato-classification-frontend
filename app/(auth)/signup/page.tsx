// tomato-classification-frontend/app/(auth)/signup/page.tsx
"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Eye, EyeOff, GraduationCap, Sprout } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import tomatoLogo from "@/public/tomato.svg"
import Image from "next/image"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { SignUpData, signUpSchema } from "@/schemas/auth.schema"
import axios from "@/lib/axios"
import { Role } from "@/types/user"
import EmailOtpModal from "@/components/auth/email-otp-modal"

export default function SignupPage() {

  const router = useRouter()
  const [role, setRole] = useState<"farmer" | "expert">("farmer")

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [otpModalOpen, setOtpModalOpen] = useState(false)
  const [signupEmail, setSignupEmail] = useState("")
  const {
    register,
    reset,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<SignUpData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      role: Role.USER,
    },
  });

  const handleSignUp = async (data: SignUpData) => {
    try {

      await axios.post("/auth/register", data)
      setSignupEmail(data.email)
      toast.success("Account created successfully")
      setOtpModalOpen(true)
      reset()

    } catch (err) {
      toast.error("Signup failed")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-background">
      <div className="w-full max-w-md">

        <div className="flex flex-col items-center mb-8">
          <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center mb-4">
            <Image src={tomatoLogo} width={40} height={40} alt="logo" />
          </div>

          <h1 className="text-2xl font-bold">TomatoCare</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Join the farming community
          </p>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle>Create your account</CardTitle>
            <CardDescription>
              Choose your role to get started
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit(handleSignUp)} className="space-y-2">

            <CardContent className="flex flex-col gap-4">

              {/* ROLE */}
              <div className="flex flex-col gap-3">

                <Label>I am a...</Label>

                <RadioGroup
                  value={role}
                  onValueChange={(v) => {
                    const r = v === "expert" ? Role.EXPERT : Role.USER
                    setRole(v as "farmer" | "expert")
                    setValue("role", r)
                  }}
                >
                  <Label className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 cursor-pointer ${role === "farmer" ? "border-primary" : ""}`}>
                    <RadioGroupItem value="farmer" className="sr-only" />
                    <Sprout className="h-6 w-6" />
                    Farmer
                  </Label>

                  <Label className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 cursor-pointer ${role === "expert" ? "border-primary" : ""}`}>
                    <RadioGroupItem value="expert" className="sr-only" />
                    <GraduationCap className="h-6 w-6" />
                    Expert
                  </Label>

                </RadioGroup>
              </div>


              {/* USERNAME */}
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input
                  placeholder="John Doe"
                  {...register("username")}
                />
                {errors.username && (
                  <p className="text-red-500 text-sm">
                    {errors.username.message}
                  </p>
                )}
              </div>

              {/* EMAIL */}
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">
                    {errors.email.message}
                  </p>
                )}
              </div>


              {/* PASSWORD */}
              <div className="space-y-2">
                <Label>Password</Label>

                <div className="relative">

                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Create password"
                    {...register("password")}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 cursor-pointer top-1/2 -translate-y-1/2"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>

                </div>

                {errors.password && (
                  <p className="text-red-500 text-sm">
                    {errors.password.message}
                  </p>
                )}

              </div>

              {/* CONFIRM PASSWORD */}
              <div className="space-y-2">
                <Label>Confirm Password</Label>
                <div className="relative">

                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm password"
                    {...register("confirmPassword")}
                  />

                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 cursor-pointer -translate-y-1/2"
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>

                </div>

                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm">
                    {errors.confirmPassword.message}
                  </p>
                )}

              </div>

            </CardContent>

            <CardFooter className="flex flex-col gap-3">
              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating account..." : "Create Account"}
              </Button>

              <p className="text-sm text-center text-muted-foreground">
                Already have an account?{" "}
                <Link href="/login" className="text-primary hover:underline">
                  Sign in
                </Link>
              </p>

            </CardFooter>
          </form>
        </Card>

      </div>
      <EmailOtpModal
        open={otpModalOpen}
        email={signupEmail}
        onSuccess={() => router.push("/login")}
        onClose={() => setOtpModalOpen(false)}
      />
    </div>
  )
}