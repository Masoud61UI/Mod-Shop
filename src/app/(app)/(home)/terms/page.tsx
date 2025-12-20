import type { Metadata } from "next";
import TermsHeroSection from "@/src/modules/terms/ui/components/TermsHeroSection";
import TermsContent from "@/src/modules/terms/ui/components/TermsContent";
import CTASection from "@/src/modules/terms/ui/components/CTASection";

export const metadata: Metadata = {
  title: "قوانین و مقررات | مد کالکشن",
  description: "قوانین، مقررات و شرایط استفاده از وبسایت و خدمات مد کالکشن",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white">
      <TermsHeroSection />
      <TermsContent />
      <CTASection />
    </main>
  );
}
