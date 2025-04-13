"use client";

import { useTransition } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation"; 
import { useUserStore } from "@/store/store";
import TranslateText from "../TranslateText";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition(); 
  const {setValues} =useUserStore()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    startTransition(async () => {
      try {
        const response = await fetch("/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        const result = await response.json();

        if (!response.ok) {
          toast.error(result.error);
          return;
        }

        // ✅ Set the "loggedIn" cookie using JavaScript
        document.cookie = "loggedIn=true; path=/;";
        if (result.user) {
          console.log(result)
          setValues({
            email: result.user.sys_email,
            name: result.user.sys_name,
          });
        } 
        toast.success("Login successful!");
        router.push("/dashboard"); // ✅ Redirect after login
      } catch (error) {
        toast.error(`Login request failed ${error}`);
      }
    });
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>
            <TranslateText english_text="Login to your account" marathi_text="तुमच्या खात्यात लॉग इन करा">
              Login to your account
            </TranslateText>
          </CardTitle>
          <CardDescription>
            Enter your email below to login.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">
                  Email
                </Label>
                {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                <Input id="email" type="email" placeholder="m@example.com" {...register("email")} />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="password">Password</Label>
                {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                <Input id="password" type="password" {...register("password")} />
              </div>

              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full accent" disabled={isPending}>
                  {isPending ? <span className="animate-pulse">
                    Logging in...
                  </span> : "Login"}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
