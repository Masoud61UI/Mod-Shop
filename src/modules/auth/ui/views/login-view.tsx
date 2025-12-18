"use client";

import z from "zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useTRPC } from "@/src/trpc/client";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { Checkbox } from "@/src/components/ui/checkbox";
import { Label } from "@/src/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";

import { loginSchema } from "../../schemas";

import { ChevronRight } from "lucide-react";
import { useState } from "react";

export const LogInView = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const login = useMutation(
    trpc.auth.login.mutationOptions({
      onError: (error) => {
        const errorMessage = error.shape?.message || error.message;

        const persianErrors: Record<string, string> = {
          "The email or password provided is incorrect.":
            "ایمیل یا رمز عبور اشتباه است.",
          "Invalid credentials": "ایمیل یا رمز عبور اشتباه است.",
          "User not found": "کاربری با این ایمیل یافت نشد.",
        };

        setError(persianErrors[errorMessage] || errorMessage);
      },
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.auth.session.queryFilter());
        router.push("/");
      },
    })
  );

  const form = useForm<z.infer<typeof loginSchema>>({
    mode: "all",
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof loginSchema>) => {
    setError(null);
    login.mutate(values);
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-purple-600 relative">
        <div className="relative z-10 flex flex-col justify-center items-center text-white w-full p-12">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">مد کالکشن</h1>
            <p className="text-xl">به جامعه مد و پوشاک ما خوش آمدید</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 w-full max-w-md">
            <div className="bg-white rounded-xl p-7 shadow-2xl">
              <div
                className="w-full h-64 bg-cover bg-center rounded-lg"
                style={{
                  backgroundImage: "url('/auth-png.png')",
                }}
              />
            </div>
          </div>

          <div className="text-center mt-12">
            <Link href="/" className="flex items-center gap-1 opacity-60">
              <span>
                <ChevronRight size={14} />
              </span>
              بازگشت به صفحه اصلی
            </Link>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-right">
              {error}
            </div>
          )}

          <div className="text-right">
            <h2 className="text-3xl font-bold text-gray-900">
              ورود به حساب کاربری
            </h2>
            <p className="text-[15px] mt-2 text-gray-500">
              ایمیل و رمز عبور خود را وارد کنید.
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-7">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="text-right">
                    <FormLabel>ایمیل</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="آدرس ایمیل خود را وارد کنید"
                        className="text-right placeholder:text-right placeholder:text-sm 
            placeholder:text-gray-300
            focus-visible:ring-1 
            focus-visible:ring-purple-200 
            focus-visible:ring-offset-0"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="text-right">
                    <FormLabel>رمز عبور</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="رمز عبور خود را وارد کنید"
                        className="text-right placeholder:text-right placeholder:text-sm 
            placeholder:text-gray-300
            focus-visible:ring-1 
            focus-visible:ring-purple-200 
            focus-visible:ring-offset-0"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-reverse">
                  <Checkbox id="remember" />
                  <Label
                    htmlFor="remember"
                    className="text-sm text-gray-600 mr-2"
                  >
                    مرا به خاطر بسپار
                  </Label>
                </div>
                <Link
                  href="/forgot-password"
                  className="text-sm text-purple-600 hover:text-purple-500"
                >
                  رمز عبور را فراموش کرده‌اید؟
                </Link>
              </div>

              <Button
                disabled={login.isPending}
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 h-12 cursor-pointer transition-all duration-200 font-medium"
              >
                {login.isPending ? "در حال ورود..." : "ورود"}
              </Button>
            </form>
          </Form>

          <div className="text-center border-t pt-8">
            <p className="text-gray-600">
              حساب کاربری ندارید؟{" "}
              <Link
                href="/signup"
                className="text-amber-500 hover:text-amber-400 font-medium"
              >
                ثبت نام کنید
              </Link>
            </p>
          </div>

          <div className="text-center lg:hidden">
            <Link
              href="/"
              className="text-sm text-center text-gray-600 border border-gray-200 px-3 py-2 rounded-md"
            >
              بازگشت به صفحه اصلی
            </Link>
          </div>

          <div className="text-center mt-3">
            <p className="text-sm text-gray-400">
              ورود به مد کالکشن
              <br />
              <span className="text-xs">تجربه خرید آسان</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
