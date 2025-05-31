"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginUser } from "@/services/AuthService";
import { toast } from "sonner";
import { loginSchema } from "./loginValidation";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useUser } from "@/context/UserContext";
import logo from "@/assets/logo.png";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";

export default function LoginForm() {
  const form = useForm({
    resolver: zodResolver(loginSchema),
  });

  const { setIsLoading } = useUser();
  const [showPassword, setShowPassword] = useState(false);
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirectPath");
  const router = useRouter();

  const {
    formState: { isSubmitting },
    setValue,
  } = form;

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    try {
      const res = await loginUser(data);
      setIsLoading(true);
      if (res?.success) {
        toast.success(res?.message);
        router.push(redirect || "/");
      } else {
        toast.error(res?.message);
      }
    } catch (err: any) {
      console.error(err);
    }
  };

  // Demo Login Handlers
  const handleDemoLogin = (type: "user" | "admin") => {
    const demoCredentials = {
      user: {
        email: "karim@gmail.com",
        password: "karim1234",
      },
      admin: {
        email: "admin@gmail.com",
        password: "admin123",
      },
    };
    const selected = demoCredentials[type];
    setValue("email", selected.email);
    setValue("password", selected.password);
    toast.info(
      `${type === "admin" ? "Admin" : "User"} demo credentials filled.`
    );
  };

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 shadow-md rounded-xl flex-grow max-w-md w-full p-6 space-y-4 mx-auto">
      <div className="flex flex-col items-center gap-2">
        <Link href="/" className="flex items-center gap-2 ">
          <Image src={logo} alt="BasaFinder Logo" className="dark:bg-blue-400 rounded-full" width={40} height={32} />
          <span className="text-2xl font-bold dark:text-white">BasaFinder</span>
        </Link>
        <h1 className="text-xl font-semibold dark:text-white">Login</h1>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Welcome back!
        </p>
      </div>

      {/* Demo Buttons */}
      <div className="flex gap-4 justify-center">
        <Button onClick={() => handleDemoLogin("user")}>Demo User</Button>
        <Button onClick={() => handleDemoLogin("admin")}>Demo Admin</Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="dark:text-white">Email</FormLabel>
                <FormControl>
                  <Input type="email" {...field} value={field.value || ""} placeholder="Enter Your Email" className="border-blue-700 dark:border-blue-400"/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="dark:text-white">Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      type={showPassword ? "text" : "password"}
                      value={field.value || ""}
                      placeholder="Enter Your Password"
                      className="border-blue-700 dark:border-blue-400"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute inset-y-0 right-2"
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            {isSubmitting ? "Logging in..." : "Login"}
          </Button>
        </form>
      </Form>

      <div className="text-sm text-gray-600 dark:text-gray-400 text-center space-y-1">
        <p>
          Don’t have an account?{" "}
          <Link href="/register" className="text-blue-700 dark:text-blue-400 font-medium">
            Register
          </Link>
        </p>
        <p>
          Go to{" "}
          <Link href="/" className="text-blue-700 dark:text-blue-400 font-medium">
            Home
          </Link>
        </p>
      </div>
    </div>
  );
}
