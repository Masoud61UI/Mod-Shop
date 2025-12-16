"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/src/trpc/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import z from "zod";

import { contactSchema } from "../../schemas";
import {
  ContactHeader,
  AuthAlert,
  ContactSidebar,
  QuickResponseCard,
  ContactForm,
  SuccessMessage,
  SupportInfoCard,
} from "../components";
import { Loader2 } from "lucide-react";

export const ContactView = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const router = useRouter();
  const queryClient = useQueryClient();
  const trpc = useTRPC();

  const {
    data: sessionData,
    isLoading: isSessionLoading,
    error: sessionError,
  } = useQuery(trpc.auth.session.queryOptions());

  useEffect(() => {
    if (!isSessionLoading) {
      setIsAuthenticated(!!sessionData?.user);
      setIsCheckingAuth(false);
    }
  }, [isSessionLoading, sessionData]);

  useEffect(() => {
    if (sessionError) {
      console.error("Error checking auth:", sessionError);
      setIsAuthenticated(false);
      setIsCheckingAuth(false);
    }
  }, [sessionError]);

  const submitContact = useMutation(
    trpc.contact.submit.mutationOptions({
      onError: (error) => {
        const errorMessage = error.shape?.message || error.message;
        const errorCode = error.data?.code || error.shape?.code;

        if (
          errorMessage.includes("لاگین") ||
          errorMessage.includes("ورود") ||
          errorMessage.includes("وارد") ||
          errorCode === "UNAUTHORIZED"
        ) {
          toast.error("لطفا ابتدا وارد حساب کاربری خود شوید");
          router.push(`/login?redirect=${encodeURIComponent("/contact")}`);
          return;
        }

        toast.error(errorMessage || "خطا در ارسال پیام");
      },
      onSuccess: async (data) => {
        setIsSubmitted(true);
        toast.success(data.message);
        setTimeout(() => setIsSubmitted(false), 5000);
        form.reset();
      },
    })
  );

  const form = useForm<z.infer<typeof contactSchema>>({
    mode: "all",
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "other",
      message: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof contactSchema>) => {
    if (!isAuthenticated) {
      toast.info("لطفا ابتدا وارد حساب کاربری خود شوید");
      router.push(`/login?redirect=${encodeURIComponent("/contact")}`);
      return;
    }
    submitContact.mutate(values);
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-purple-600 mb-4" />
          <p className="text-gray-600">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <ContactHeader />

      <div className="container mx-auto px-4 py-8 mt-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="lg:col-span-1 space-y-6">
            {!isAuthenticated && <AuthAlert router={router} />}
            <ContactSidebar />
            <QuickResponseCard />
          </div>

          <div className="lg:col-span-2">
            {isSubmitted ? (
              <SuccessMessage onReset={() => setIsSubmitted(false)} />
            ) : (
              <ContactForm
                form={form}
                onSubmit={onSubmit}
                isAuthenticated={isAuthenticated}
                isPending={submitContact.isPending}
              />
            )}
            <SupportInfoCard />
          </div>
        </div>
      </div>
    </div>
  );
};
