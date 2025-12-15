"use client";

import Container from "@/src/modules/home/ui/components/Container";
import { Separator } from "@/src/components/ui/separator";
import {
  HeroSection,
  ValuesSection,
  TimelineSection,
  TeamSection,
  MissionVisionSection,
} from "@/src/modules/about/ui/components";

export default function AboutPage() {
  return (
    <Container>
      <HeroSection />

      <Separator className="my-12 md:my-16" />

      <ValuesSection />

      <TimelineSection />

      <Separator className="my-12 md:my-16" />

      <TeamSection />

      <MissionVisionSection />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "مد کالکشن",
            description:
              "فروشگاه آنلاین مد کالکشن - ارائه محصولات با کیفیت و تجربه خرید ساده",
            url: "https://modcollection.ir",
            foundingDate: "2021",
            foundingLocation: {
              "@type": "Place",
              name: "Mazandaran, Iran",
            },
            founder: [
              {
                "@type": "Person",
                name: "امیرمسعود محمدی",
                jobTitle: "بنیان‌گذار و مدیرعامل",
              },
              {
                "@type": "Person",
                name: "مهدیس اسماعیلی",
                jobTitle: "مدیر خلاقیت و طراحی",
              },
              {
                "@type": "Person",
                name: "امیرعباس محمدی",
                jobTitle: "مدیر فنی و توسعه",
              },
            ],
            contactPoint: {
              "@type": "ContactPoint",
              contactType: "پشتیبانی",
              email: "info@modcollection.ir",
              availableLanguage: ["Persian"],
            },
            keywords:
              "خرید آنلاین, مد کالکشن, فروشگاه اینترنتی, پوشاک, مد, لباس",
            brand: {
              "@type": "Brand",
              name: "مد کالکشن",
              slogan: "کیفیت در تاروپود هر محصول",
            },
          }),
        }}
      />
    </Container>
  );
}
