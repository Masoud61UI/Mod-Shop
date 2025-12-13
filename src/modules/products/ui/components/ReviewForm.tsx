"use client";

import { z } from "zod";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTRPC } from "@/src/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { ReviewsGetManyOutput } from "@/src/modules/reviews/types";

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
  initialData?: ReviewsGetManyOutput;
}

const formSchema = z.object({
  rating: z.number().min(1, { message: "لطفاً به محصول امتیاز دهید" }).max(5),
  description: z.string().min(1, { message: "لطفاً نظر خود را بنویسید" }),
});

export default function ReviewForm({ productId, initialData }: Props) {
  const [isPreview, setIsPreview] = useState<boolean>(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [hasInitialDataLoaded, setHasInitialDataLoaded] = useState(false);

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
    if (initialData && !hasInitialDataLoaded) {
      console.log("📥 Setting form values from initialData:", initialData);

      form.reset({
        rating: initialData.امتیاز || 0,
        description: initialData.توضیحات || "",
      });

      setIsPreview(true);
      setHasInitialDataLoaded(true);
      setIsHydrated(true);
    } else if (!initialData && hasInitialDataLoaded) {
      form.reset({
        rating: 0,
        description: "",
      });
      setIsPreview(false);
      setHasInitialDataLoaded(false);
      setIsHydrated(true);
    } else if (!initialData && !hasInitialDataLoaded) {
      setIsPreview(false);
      setIsHydrated(true);
    }
  }, [initialData, form, hasInitialDataLoaded]);

  useEffect(() => {
    if (!initialData && typeof window !== "undefined") {
      const storageKey = `review_preview_${productId}`;
      const savedValue = localStorage.getItem(storageKey);

      if (savedValue === "true") {
        console.log("📁 Restoring from localStorage");
        setIsPreview(true);
      }
    }
  }, [productId, initialData]);

  const createReview = useMutation(
    trpc.reviews.create.mutationOptions({
      onSuccess: (data) => {
        queryClient.invalidateQueries({
          queryKey: trpc.reviews.getOne.queryOptions({ productId }).queryKey,
        });
        toast.success("نظر شما با موفقیت ثبت شد.");

        if (typeof window !== "undefined") {
          const storageKey = `review_preview_${productId}`;
          localStorage.setItem(storageKey, "true");
        }

        setIsPreview(true);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );

  const updateReview = useMutation(
    trpc.reviews.update.mutationOptions({
      onSuccess: (data) => {
        queryClient.invalidateQueries({
          queryKey: trpc.reviews.getOne.queryOptions({ productId }).queryKey,
        });
        toast.success("نظر شما ویرایش شد.");

        if (typeof window !== "undefined") {
          const storageKey = `review_preview_${productId}`;
          localStorage.setItem(storageKey, "true");
        }

        setIsPreview(true);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );

  const handleEditClick = () => {
    if (typeof window !== "undefined") {
      const storageKey = `review_preview_${productId}`;
      localStorage.removeItem(storageKey);
    }

    setIsPreview(false);
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (initialData) {
      updateReview.mutate({
        reviewId: initialData.id,
        rating: values.rating,
        description: values.description,
      });
    } else {
      createReview.mutate({
        productId,
        rating: values.rating,
        description: values.description,
      });
    }
  };

  const isLoading = createReview.isPending || updateReview.isPending;

  if (!isHydrated) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-purple-600" />
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
            <p className="text-lg font-semibold text-gray-900">
              {isPreview ? "امتیاز شما" : "نظر خود را ثبت کنید"}
            </p>
            {!isPreview && (
              <p className="text-sm text-gray-500">
                نظر شما پس از تایید نمایش داده خواهد شد
              </p>
            )}
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
                    disabled={isPreview || isLoading}
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
                    disabled={isPreview || isLoading}
                    className="min-h-[120px] resize-none text-right placeholder:text-right"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-500 text-sm" />
              </FormItem>
            )}
          />

          <div className="space-y-4">
            {!isPreview ? (
              <Button
                type="submit"
                disabled={isLoading}
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                    {initialData ? "در حال ویرایش..." : "در حال ثبت..."}
                  </>
                ) : initialData ? (
                  "ویرایش نظر"
                ) : (
                  "ثبت نظر"
                )}
              </Button>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
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
                        ></path>
                      </svg>
                    </div>
                    <div>
                      <p className="text-green-800 font-medium">
                        نظر شما ثبت شد
                      </p>
                      <p className="text-green-600 text-sm mt-1">
                        و تا دقایقی دیگر، نظر شما در صفحه محصول نمایش داده خواهد
                        شد.
                      </p>
                    </div>
                  </div>
                </div>

                <Button
                  type="button"
                  onClick={handleEditClick}
                  variant="outline"
                  className="w-full sm:w-auto px-6 py-3 border-purple-600 text-purple-600 hover:bg-purple-50 font-medium rounded-lg cursor-pointer"
                >
                  ویرایش نظر
                </Button>
              </div>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}
