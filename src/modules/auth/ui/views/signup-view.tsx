"use client";

import z from "zod";
import Link from "next/link";
import { useState } from "react";
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

import { registerSchema } from "../../schemas";
import { ChevronRight } from "lucide-react";

export const SignUpView = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const register = useMutation(
    trpc.auth.register.mutationOptions({
      onError: (error) => {
        const errorMessage = error.shape?.message || error.message;
        setError(errorMessage);
      },
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.auth.session.queryFilter());
        router.push("/");
      },
    })
  );

  const form = useForm<z.infer<typeof registerSchema>>({
    mode: "all",
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      username: "",
    },
  });

  const onSubmit = (values: z.infer<typeof registerSchema>) => {
    setError(null);
    register.mutate(values);
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-purple-600 relative">
        <div className="relative z-10 flex flex-col justify-center items-center text-white w-full p-12">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">مد کالکشن</h1>
            <p className="text-xl">به جامعه مد و پوشاک ما بپیوندید</p>
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
            <h2 className="text-3xl font-bold text-gray-900">ثبت نام</h2>
            <p className="text-[15px] mt-2 text-gray-500">
              اطلاعات خود را برای ایجاد حساب کاربری وارد کنید.
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-7">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem className="text-right">
                    <FormLabel>نام کاربری</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="نام کاربری خود را وارد کنید"
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

              <div className="flex items-center space-x-reverse">
                <Checkbox id="terms" />
                <Label htmlFor="terms" className="text-sm text-gray-600 mr-2">
                  با قوانین و شرایط موافقم
                </Label>
              </div>

              <Button
                disabled={register.isPending}
                type="submit"
                className="w-full bg-purple-500 hover:bg-purple-600 h-12 cursor-pointer transition-all duration-200 font-medium"
              >
                {register.isPending ? "در حال ثبت نام..." : "ثبت نام"}
              </Button>
            </form>
          </Form>

          <div className="text-center border-t pt-8">
            <p className="text-gray-600">
              قبلاً حساب کاربری دارید؟{" "}
              <Link
                href="/login"
                className="text-amber-500 hover:text-amber-400 font-medium"
              >
                وارد شوید
              </Link>
            </p>
          </div>

          <div className="text-center mt-3">
            <p className="text-sm text-gray-400">
              ثبت نام در مد کالکشن
              <br />
              <span className="text-xs">سریع و آسان</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
