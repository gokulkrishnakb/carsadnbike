import { z } from "zod";

const passwordSchema = z
  .string()
  .min(8, "At least 8 characters")
  .regex(/[A-Z]/, "One uppercase letter")
  .regex(/[0-9]/, "One digit")
  .regex(/[!@#$%^&*()_+\-=\[\]{}|;':",./<>?]/, "One special character");

export const loginSchema = z.object({
  email:    z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z
  .object({
    full_name:        z.string().min(2, "At least 2 characters").max(200),
    email:            z.string().email("Invalid email address"),
    password:         passwordSchema,
    confirm_password: z.string(),
  })
  .refine((d) => d.password === d.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const resetPasswordSchema = z
  .object({
    new_password:     passwordSchema,
    confirm_password: z.string(),
  })
  .refine((d) => d.new_password === d.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

export type LoginInput          = z.infer<typeof loginSchema>;
export type RegisterInput       = z.infer<typeof registerSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput  = z.infer<typeof resetPasswordSchema>;
