"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registrationSchema } from "./registerValidation";
import { registerUser } from "@/services/AuthService";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormField, FormItem, FormMessage, FormControl } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Link from "next/link";

export default function RegisterForm() {
  const form = useForm({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      passwordConfirm: "",
      role: "tenant",
    },
  });

  const {
    formState: { isSubmitting },
  } = form;

  const router = useRouter();
  const { setIsLoading } = useUser();

  const onSubmit = async (data: any) => {
    try {
      const res = await registerUser(data);
      console.log(res);
      setIsLoading(true);
      if (res?.success) {
        toast.success(res?.message);
        router.push("/");
      } else {
        toast.error(res?.message);
      }
    } catch (err: any) {
      toast.error("Something went wrong!");
      console.error(err);
    }
  };

  return (
    <div className="border-2 border-gray-300 rounded-xl flex-grow max-w-md w-full p-5">
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Register</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="name">Name</Label>
                <FormControl>
                  <Input {...field} placeholder="Enter your name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="email">Email</Label>
                <FormControl>
                  <Input {...field} type="email" placeholder="Enter your email" />
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
                <Label htmlFor="password">Password</Label>
                <FormControl>
                  <Input {...field} type="password" placeholder="Enter your password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="passwordConfirm"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="passwordConfirm">Confirm Password</Label>
                <FormControl>
                  <Input {...field} type="password" placeholder="Confirm your password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

           {/* ✅ Fixed Role Section */}
           <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="role">User Role</Label>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex gap-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="tenant" id="tenant" />
                    <Label htmlFor="tenant">Tenant</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="landlord" id="landlord" />
                    <Label htmlFor="landlord">Landlord</Label>
                  </div>
                </RadioGroup>
                <FormMessage />
              </FormItem>
            )}
          />


          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Registering..." : "Register"}
          </Button>
        </form>
      </Form>

      <p className="text-sm text-gray-600 text-center my-3">
        Already have an account ?
        <Link href="/login" className="text-primary">
          Login
        </Link>
      </p>
    </div>
  );
}
