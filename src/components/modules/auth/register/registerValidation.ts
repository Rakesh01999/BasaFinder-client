import { z } from "zod";

export const registrationSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be between 2 and 50 characters")
    .max(50, "Name must be between 2 and 50 characters"),
  email: z
    .string()
    .email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(20, "Password cannot exceed 20 characters"),
  role: z.enum(["admin", "landlord", "tenant"], {
    invalid_type_error: "Role must be either 'admin', 'landlord', or 'tenant'",
  }),
  isBlocked: z.boolean().default(false),
  passwordConfirm: z.string(),
}).refine(data => data.password === data.passwordConfirm, {
  message: "Passwords do not match",
  path: ["passwordConfirm"],
});
