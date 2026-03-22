// tomato-classification-frontend/schemas/auth.schema.ts
import { Role } from '@/types/user';
import { z } from 'zod';
// Sign In schema
export const signInSchema = z.object({
  email: z.email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});


// secure password schema
const securePasswordSchema = z
  .string()
  .min(1, 'Password is required')
  .min(8, 'Password must be at least 8 characters');

// Sign Up schema
export const signUpSchema = z
  .object({
    username: z.string().min(1, 'User name is required'),
    email: z.string().min(1, 'Email is required').email('Invalid email address'),
    password: securePasswordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    role: z.enum(Role),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'], // errors go on confirmPassword field
  });

// OTP verifiy schema
export const otpVerifySchema = z.object({
  email: z.email('Invalid email address'),
  otp: z.string()
    .regex(/^\d{6}$/, 'OTP must be exactly 6 digits'), 
});

export type SignInData = z.infer<typeof signInSchema>;
export type SignUpData = z.infer<typeof signUpSchema>;
export type OTPVerifyData = z.infer<typeof otpVerifySchema>;