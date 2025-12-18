import { Form } from "@/src/components/ui/form";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { Loader2, LogIn } from "lucide-react";
import Link from "next/link";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { contactSchema } from "../../schemas";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/src/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";

interface ContactFormProps {
  form: UseFormReturn<z.infer<typeof contactSchema>>;
  onSubmit: (values: z.infer<typeof contactSchema>) => Promise<void>;
  isAuthenticated: boolean;
  isPending: boolean;
}

export const ContactForm = ({
  form,
  onSubmit,
  isAuthenticated,
  isPending,
}: ContactFormProps) => (
  <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 md:p-7">
    <div className="flex justify-between items-center mb-6 gap-2">
      <div>
        <h2 className="text-xl font-semibold text-gray-800">فرم تماس</h2>
        <p className="text-gray-600 mt-1 text-sm">
          فرم زیر را پر کنید تا در اولین فرصت با شما تماس بگیریم.
        </p>
      </div>
      <div
        className={`px-3 py-1.5 rounded-full text-xs font-medium ${
          isAuthenticated
            ? "bg-green-100 text-green-800"
            : "bg-red-100 text-red-800"
        }`}
      >
        {isAuthenticated ? "وارد شده‌اید ✓" : "وارد نشده‌اید"}
      </div>
    </div>

    {!isAuthenticated && (
      <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-center gap-2 text-red-700">
          <span className="text-sm">⚠️</span>
          <p className="font-medium text-sm">
            برای ارسال پیام نیاز به ورود دارید
          </p>
        </div>
        <p className="text-red-600 text-xs mt-1">
          می‌توانید فرم را پر کنید اما برای ارسال باید وارد حساب کاربری خود
          شوید.
        </p>
      </div>
    )}

    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-7">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="text-right">
                <FormLabel className="text-sm">نام کامل</FormLabel>
                <FormControl>
                  <Input
                    placeholder="نام و نام خانوادگی"
                    className="text-right placeholder:text-right placeholder:text-xs bg-gray-50 h-10 text-sm placeholder:text-gray-300
            focus-visible:ring-1 
            focus-visible:ring-purple-200 
            focus-visible:ring-offset-0"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="text-right">
                <FormLabel className="text-sm">ایمیل</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="example@gmail.com"
                    className="text-right placeholder:text-right placeholder:text-xs bg-gray-50 h-10 text-sm placeholder:text-gray-300
            focus-visible:ring-1 
            focus-visible:ring-purple-200 
            focus-visible:ring-offset-0"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem className="text-right">
                <FormLabel className="text-sm">شماره تماس</FormLabel>
                <FormControl>
                  <Input
                    placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                    className="text-right placeholder:text-right placeholder:text-xs bg-gray-50 h-10 text-sm placeholder:text-gray-300
            focus-visible:ring-1 
            focus-visible:ring-purple-200 
            focus-visible:ring-offset-0"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem className="text-right">
                <FormLabel className="text-sm">موضوع</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="text-right bg-gray-50 h-10 text-sm focus:ring-1 focus:ring-purple-200 focus:ring-offset-0">
                      <SelectValue placeholder="انتخاب کنید" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="product-support" className="text-sm">
                      پشتیبانی محصول
                    </SelectItem>
                    <SelectItem value="order-question" className="text-sm">
                      سوال درباره سفارش
                    </SelectItem>
                    <SelectItem value="collaboration" className="text-sm">
                      همکاری و مشارکت
                    </SelectItem>
                    <SelectItem value="feedback" className="text-sm">
                      انتقادات و پیشنهادات
                    </SelectItem>
                    <SelectItem value="other" className="text-sm">
                      سایر
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem className="text-right">
              <FormLabel className="text-sm">پیام شما</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="پیام خود را با جزئیات بنویسید..."
                  className="min-h-[120px] text-right placeholder:text-right placeholder:text-xs bg-gray-50 text-sm placeholder:text-gray-300
            focus-visible:ring-1 
            focus-visible:ring-purple-200 
            focus-visible:ring-offset-0"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        <div className="space-y-3 pt-2">
          <Button
            disabled={isPending}
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 h-11 text-sm font-medium cursor-pointer transition-colors"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin ml-2" />
                در حال ارسال...
              </>
            ) : isAuthenticated ? (
              "ارسال پیام"
            ) : (
              <>
                <LogIn className="h-4 w-4 ml-2" />
                ورود و ارسال پیام
              </>
            )}
          </Button>

          {!isAuthenticated && (
            <div className="text-center pt-2">
              <p className="text-xs text-gray-500">
                هنوز حساب کاربری ندارید؟{" "}
                <Link
                  href="/signup"
                  className="text-purple-600 hover:text-purple-700 font-medium"
                >
                  همین حالا ثبت نام کنید
                </Link>
              </p>
            </div>
          )}
        </div>
      </form>
    </Form>
  </div>
);
