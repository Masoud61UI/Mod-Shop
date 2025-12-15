"use client";

import { z } from "zod";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTRPC } from "@/src/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { Button } from "@/src/components/ui/button";
import StarPicker from "@/src/components/star-picker";
import { Textarea } from "@/src/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface Props {
  productId: string;
  initialData?: any;
}

const formSchema = z.object({
  rating: z.number().min(1, { message: "لطفاً به محصول امتیاز دهید" }).max(5),
  description: z.string().min(1, { message: "لطفاً نظر خود را بنویسید" }),
});

export default function ReviewForm({ productId, initialData }: Props) {
  const router = useRouter();
  const [showLoginPrompt, setShowLoginPrompt] = useState<boolean>(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState<boolean>(false);

  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rating: 0,
      description: "",
    },
  });

  useEffect(() => {
    if (showSuccessMessage) {
      const timer = setTimeout(() => {
        setShowSuccessMessage(false);
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [showSuccessMessage]);

  const createReview = useMutation(
    trpc.reviews.create.mutationOptions({
      onSuccess: (data) => {
        queryClient.invalidateQueries({
          queryKey: trpc.reviews.getByProduct.queryOptions({
            productId,
            status: "published",
          }).queryKey,
        });
        queryClient.invalidateQueries({
          queryKey: trpc.products.getOne.queryOptions({ id: productId })
            .queryKey,
        });
        queryClient.invalidateQueries({
          queryKey: trpc.reviews.getOne.queryOptions({ productId }).queryKey,
        });

        form.reset({
          rating: 0,
          description: "",
        });

        setShowSuccessMessage(true);
      },
      onError: (error: any) => {
        if (
          error.data?.code === "UNAUTHORIZED" ||
          error.message?.includes("Not Authenticated") ||
          error.message?.includes("UNAUTHORIZED")
        ) {
          setShowLoginPrompt(true);
          toast.error("برای ثبت نظر باید وارد حساب کاربری خود شوید");
        } else {
          toast.error(error.message || "خطایی در ثبت نظر رخ داد");
        }
      },
    })
  );

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    createReview.mutate({
      productId,
      rating: values.rating,
      description: values.description,
    });
  };

  const isLoading = createReview.isPending;

  if (showLoginPrompt) {
    return (
      <div className="text-center py-8">
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-100 rounded-xl p-6">
          <div className="text-5xl mb-4">🔒</div>
          <h4 className="text-lg font-semibold text-gray-800 mb-2">
            برای ثبت نظر وارد شوید
          </h4>
          <p className="text-gray-600 mb-6">
            فقط کاربران واردشده می‌توانند نظرات خود را ثبت کنند.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={() =>
                router.push(
                  `/auth/signin?callbackUrl=${encodeURIComponent(window.location.pathname)}`
                )
              }
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-medium"
            >
              ورود به حساب کاربری
            </Button>
            <Button
              onClick={() => router.push("/auth/signup")}
              variant="outline"
              className="border-purple-600 text-purple-600 px-6 py-3 rounded-lg font-medium"
            >
              ثبت‌نام جدید
            </Button>
          </div>
          <Button
            onClick={() => setShowLoginPrompt(false)}
            variant="ghost"
            className="mt-4 text-gray-500 text-sm"
          >
            بازگشت
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Form {...form}>
        <form
          className="flex flex-col gap-6"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="space-y-2">
            <p className="text-lg font-semibold text-gray-900">ثبت نظر جدید</p>
          </div>

          <FormField
            control={form.control}
            name="rating"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 font-medium">
                  امتیاز
                </FormLabel>
                <FormControl>
                  <StarPicker
                    value={field.value}
                    onChange={field.onChange}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage className="text-red-500 text-sm" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 font-medium">
                  نظر شما
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="تجربه خود از خرید این محصول را با دیگران به اشتراک بگذارید..."
                    disabled={isLoading}
                    className="min-h-[120px] resize-none text-right placeholder:text-right placeholder:text-sm 
            placeholder:text-gray-300
            focus-visible:ring-1 
            focus-visible:ring-purple-200 
            focus-visible:ring-offset-0"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-500 text-sm" />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={isLoading}
            className="px-8 py-3 bg-purple-500 hover:bg-purple-600 text-white font-medium rounded-md shadow-md transition-all duration-200 w-fit cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                در حال ثبت...
              </>
            ) : (
              "ثبت نظر"
            )}
          </Button>

          {showSuccessMessage && (
            <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg animate-in fade-in slide-in-from-top-5 duration-300">
              <div className="flex items-start gap-3">
                <div className="bg-green-100 p-2 rounded-full">
                  <svg
                    className="h-5 w-5 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-green-800 font-medium">.نظر شما ثبت شد</p>
                  <p className="text-green-600 text-sm mt-1">
                    نظر شما با موفقیت ثبت شد و تا دقایقی دیگر در صفحه محصول
                    نمایش داده خواهد شد.
                  </p>
                </div>
              </div>
            </div>
          )}
        </form>
      </Form>
    </div>
  );
}
