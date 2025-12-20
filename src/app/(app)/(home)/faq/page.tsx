import FaqHeroSection from "@/src/modules/faq/ui/components/FaqHeroSection";
import AccordionFAQ from "@/src/modules/faq/ui/components/AccordionFAQ";
import CTASection from "@/src/modules/faq/ui/components/CTASection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "سوالات متداول | مد کالکشن",
  description:
    "پاسخ به پرتکرارترین سوالات درباره خرید، ارسال، بازگشت کالا و خدمات مد کالکشن",
};

export default function FAQPage() {
  return (
    <main className="min-h-screen bg-white">
      <FaqHeroSection />
      <AccordionFAQ />
      <CTASection />
    </main>
  );
}
