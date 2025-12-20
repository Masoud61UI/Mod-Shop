"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Truck,
  RefreshCw,
  HeadphonesIcon,
  Shirt,
} from "lucide-react";

const faqData = [
  {
    id: "shipping",
    title: "ارسال و تحویل",
    icon: <Truck className="h-5 w-5 text-purple-600" />,
    items: [
      {
        question: "مدت زمان ارسال سفارش چقدر است؟",
        answer:
          "سفارشات داخل استان مازندران طی ۱ تا ۲ روز کاری تحویل داده می‌شوند. سفارشات به سایر استان‌ها طی ۳ تا ۵ روز کاری ارسال می‌شوند. زمان دقیق ارسال به آدرس و روش ارسال انتخابی شما بستگی دارد.",
      },
      {
        question: "هزینه ارسال چقدر است؟",
        answer:
          "برای خریدهای بالای ۱,۵۰۰,۰۰۰ تومان، ارسال رایگان است. برای خریدهای کمتر، هزینه ارسال مطابق نرخ‌های اعلام شده توسط اداره پست دریافت می‌گردد.",
      },
      {
        question: "از کدام شهر ارسال می‌کنید؟",
        answer:
          "انبار اصلی ما در استان مازندران (نور) واقع شده است. به همین دلیل ارسال به شهرهای مازندران سریع‌تر انجام می‌شود.",
      },
      {
        question: "چگونه می‌توانم وضعیت سفارشم را پیگیری کنم؟",
        answer:
          "پس از ثبت سفارش، یک کد رهگیری برای شما ارسال می‌شود. همچنین می‌توانید از طریق پنل کاربری خود در سایت، بخش 'سفارشات من' وضعیت سفارش را پیگیری کنید.",
      },
    ],
  },
  {
    id: "returns",
    title: "بازگشت و تعویض",
    icon: <RefreshCw className="h-5 w-5 text-amber-500" />,
    items: [
      {
        question: "شرایط بازگشت و تعویض لباس چیست؟",
        answer:
          "لباس‌های خریداری شده تنها در صورت داشتن **برچسب اصلی سالم** و **عدم استفاده**، تا ۷ روز پس از تحویل قابل تعویض هستند. لباس نباید پوشیده شده، شسته شده یا کوچکترین اثری از استفاده (حتی به صورت تست) داشته باشد. همچنین باید در بسته‌بندی اصلی و سالم تحویل داده شود.",
      },
      {
        question: "اگر سایز لباس مناسب نباشد چه می‌شود؟",
        answer:
          "می‌توانید از راهنمای سایز موجود در صفحه هر محصول استفاده کنید. در صورت عدم تطابق سایز، تا ۷ روز پس از دریافت با حفظ شرایط بالا (برچسب سالم و عدم استفاده) می‌توانید لباس را تعویض کنید. هزینه ارسال برای تعویض سایز در استان مازندران رایگان و برای سایر استان‌ها مطابق تعرفه پست خواهد بود.",
      },
      {
        question: "آیا امکان بازگشت وجه دارید؟",
        answer:
          "خیر، مد کالکشن بر اساس قوانین داخلی خود **فقط خدمات تعویض کالا** را ارائه می‌دهد و بازگشت وجه انجام نمی‌شود. شما می‌توانید تا ۷ روز پس از دریافت، لباس را با شرایط ذکر شده تعویض کنید.",
      },
    ],
  },
  {
    id: "products",
    title: "محصولات و کیفیت",
    icon: <Shirt className="h-5 w-5 text-amber-500" />,
    items: [
      {
        question: "کیفیت لباس‌های شما چگونه است؟",
        answer:
          "تمام محصولات ما از پارچه‌های باکیفیت و برندهای معتبر داخلی و بین‌المللی تهیه شده‌اند. قبل از ارسال تمام لباس‌ها کنترل کیفیت می‌شوند.",
      },
      {
        question: "آیا لباس‌ها قابل شستشو هستند؟",
        answer:
          "بله، راهنمای شستشو و نگهداری هر لباس روی برچسب آن درج شده است. پیشنهاد می‌کنیم قبل از اولین شستشو، راهنمای روی لباس را مطالعه کنید.",
      },
      {
        question: "پارچه‌های مورد استفاده در لباس‌های شما از چه جنسی هستند؟",
        answer:
          "ما از باکیفیت‌ترین پارچه‌ها شامل پنبه ممتاز، لینن، ویسکوز باکیفیت و ترکیبات مدرن استفاده می‌کنیم. جنس پارچه هر محصول به طور دقیق در صفحه توضیحات آن ذکر شده است تا بتوانید بر اساس نیاز خود انتخاب کنید.",
      },
    ],
  },
  {
    id: "support",
    title: "پشتیبانی و خدمات",
    icon: <HeadphonesIcon className="h-5 w-5 text-purple-600" />,
    items: [
      {
        question: "ساعات پاسخگویی پشتیبانی چه زمانی است؟",
        answer:
          "پشتیبانی آنلاین همه روزه (حتی ایام تعطیل) از ساعت ۹ صبح تا ۹ شب پاسخگوی سوالات شماست. همچنین می‌توانید در ساعات دیگر از طریق واتساپ یا ایمیل با ما در ارتباط باشید.",
      },
      {
        question: "چگونه می‌توانم با مد کالکشن همکاری کنم؟",
        answer:
          "برای همکاری در زمینه فروشندگی، بازاریابی، طراحی لباس یا همکاری‌های تجاری، لطفا رزومه و درخواست خود را به ایمیل همکاری mod.store@gmail.com ارسال نمایید.",
      },
    ],
  },
];

interface AccordionItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}

function AccordionItem({
  question,
  answer,
  isOpen,
  onToggle,
}: AccordionItemProps) {
  return (
    <div className="border-b border-gray-200 last:border-b-0">
      <button
        className="flex justify-between items-center w-full py-5 text-right hover:bg-gray-50 transition-colors rounded-lg px-4"
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <span className="font-medium text-gray-800">{question}</span>
        <div className="mr-3 text-purple-600">
          {isOpen ? (
            <ChevronUp className="h-5 w-5" />
          ) : (
            <ChevronDown className="h-5 w-5" />
          )}
        </div>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="pb-5 px-4 text-gray-600 leading-relaxed mx-4 mb-2">
          {answer}
        </div>
      </div>
    </div>
  );
}

export default function AccordionFAQ() {
  const [openSections, setOpenSections] = useState<
    Record<string, number | null>
  >({
    shipping: 0,
    returns: null,
    payment: null,
    products: null,
    support: null,
  });

  const toggleItem = (category: string, index: number) => {
    setOpenSections((prev) => ({
      ...prev,
      [category]: prev[category] === index ? null : index,
    }));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 pb-16 mt-15">
      {faqData.map((category) => (
        <div
          key={category.id}
          id={category.id}
          className="mb-12 last:mb-0 scroll-mt-20"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-amber-50 rounded-lg">{category.icon}</div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">
              {category.title}
            </h2>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {category.items.map((item, index) => (
              <AccordionItem
                key={index}
                question={item.question}
                answer={item.answer}
                isOpen={openSections[category.id] === index}
                onToggle={() => toggleItem(category.id, index)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
