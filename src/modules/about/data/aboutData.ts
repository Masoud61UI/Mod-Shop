import {
  Check,
  Users,
  Target,
  Sparkles,
  Shield,
  Calendar,
  Award,
  Globe,
  Heart,
} from "lucide-react";

export interface ValueItem {
  iconName: keyof typeof icons;
  title: string;
  description: string;
  bgColor: string;
  iconColor: string;
}

export interface TeamMember {
  name: string;
  role: string;
  description: string;
  expertise: string;
}

export interface Milestone {
  year: string;
  title: string;
  description: string;
  iconName: keyof typeof icons;
}

export const icons = {
  Check,
  Users,
  Target,
  Sparkles,
  Shield,
  Calendar,
  Award,
  Globe,
  Heart,
};

export const valuesData: ValueItem[] = [
  {
    iconName: "Check",
    title: "دوخت درجه‌یک",
    description: "هر محصول قبل از عرضه، چندین مرحله کنترل کیفیت را می‌گذراند.",
    bgColor: "bg-purple-50",
    iconColor: "text-purple-600",
  },
  {
    iconName: "Users",
    title: "تمرکز بر تجربه",
    description: "ساده، سریع و امن. این سه اصل راهنمای هر تصمیم ماست.",
    bgColor: "bg-purple-100",
    iconColor: "text-purple-600",
  },
  {
    iconName: "Target",
    title: "بهبود مستمر",
    description: "هر روز برای بهتر شدن تلاش می‌کنیم.",
    bgColor: "bg-purple-50",
    iconColor: "text-purple-600",
  },
  {
    iconName: "Shield",
    title: "شفافیت کامل",
    description: "هیچ هزینه پنهانی، هیچ تعهد اضافی.",
    bgColor: "bg-purple-100",
    iconColor: "text-purple-600",
  },
];

export const teamMembersData: TeamMember[] = [
  {
    name: "امیرمسعود محمدی",
    role: "بنیان‌گذار و مدیرعامل",
    description: "چندین سال تجربه در استارتاپ‌های مد و پوشاک",
    expertise: "استراتژی کسب‌وکار • توسعه پلتفرم • رهبری تیم",
  },
  {
    name: "مهدیس اسماعیلی",
    role: "مدیر خلاقیت و طراحی",
    description: "کارشناسی ارشد طراحی لباس از دانشگاه تهران",
    expertise: "ترندشناسی • کنترل کیفیت • طراحی مجموعه",
  },
  {
    name: "امیرعباس محمدی",
    role: "مدیر فنی و توسعه",
    description: "متخصص روابط برندها و توسعه همکاری‌های مد",
    expertise: "مدیریت همکاری‌ها • توسعه شبکه • جذب برند",
  },
];

export const milestonesData: Milestone[] = [
  {
    year: "۱۴۰۰",
    title: "شروع داستان",
    description: "شکل‌گیری ایده اولیه مد کالکشن در یک مهمانی",
    iconName: "Sparkles",
  },
  {
    year: "۱۴۰۱",
    title: "تحقیق و توسعه",
    description: "مطالعه عمیق بازار و نیازهای مشتریان ایرانی",
    iconName: "Target",
  },
  {
    year: "۱۴۰۳",
    title: "ساخت پلتفرم",
    description: "طراحی و توسعه نرم‌افزار اختصاصی با تیمی کوچک",
    iconName: "Calendar",
  },
  {
    year: "۱۴۰۴",
    title: "راه‌اندازی رسمی",
    description: "شروع فعالیت با چندین برند معتبر داخلی و استقبال چشمگیر",
    iconName: "Award",
  },
  {
    year: "۱۴۰۵",
    title: "چشم‌انداز جهانی",
    description: "گسترش به بازارهای منطقه‌ای و معرفی برندهای ایرانی",
    iconName: "Globe",
  },
];
