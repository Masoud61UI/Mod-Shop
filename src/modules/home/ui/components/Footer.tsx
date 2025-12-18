import Link from "next/link";
import { ShoppingBag, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  const menuItems = [
    { href: "/products", label: "محصولات" },
    { href: "/blog", label: "وبلاگ" },
    { href: "/about", label: "درباره ما" },
    { href: "/contact", label: "تماس با ما" },
  ];

  const socialMedias = [
    {
      href: "https://wa.me/989117186181",
      label: "واتساپ",
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893c0-3.18-1.24-6.169-3.495-8.418" />
        </svg>
      ),
    },
    {
      href: "https://instagram.com",
      label: "اینستاگرام",
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      ),
    },
    {
      href: "https://t.me",
      label: "تلگرام",
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.191l-1.83 8.725c-.129.586-.463.732-.935.455l-2.59-1.905-1.251 1.203c-.138.138-.255.255-.523.255l.188-2.662 4.81-4.339c.215-.191-.047-.297-.331-.107l-5.942 3.743-2.557-.796c-.624-.195-.636-.624.13-.924l9.924-3.82c.52-.185.975.129.795.92z" />
        </svg>
      ),
    },
  ];

  const contactInfo = [
    {
      icon: <Phone className="size-4" />,
      text: "۶۱۸۱ ۷۱۸ ۰۹۱۱",
      href: "tel:+989117186181",
    },
    {
      icon: <Mail className="size-4" />,
      text: "mod.store@gmail.com",
      href: "mailto:info@modcollection.ir",
    },
    {
      icon: <MapPin className="size-4" />,
      text: "مازندران، رویان، مجتمع الماس",
    },
  ];

  return (
    <footer className="bg-white border-t border-gray-100 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex flex-col items-center text-center mb-10">
          <Link href="/" className="flex items-center gap-3 group mb-4">
            <div className="relative">
              <div className="size-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center shadow-sm">
                <ShoppingBag className="size-6 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 size-3 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full border-2 border-white shadow"></div>
            </div>
            <div className="flex flex-col items-start">
              <span className="text-xl font-bold text-gray-900">مدکالکشن</span>
              <span className="text-xs text-gray-500 font-medium">
                فروشگاه مد و پوشاک
              </span>
            </div>
          </Link>

          <p className="text-gray-600 max-w-md text-sm leading-relaxed mt-1">
            فروشگاه آنلاین مد و پوشاک با ارائه جدیدترین ترندهای روز دنیا و کیفیت
            بی‌نظیر
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              لینک‌های سریع
            </h3>
            <ul className="space-y-3">
              {menuItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-gray-600 hover:text-purple-600 text-sm transition-colors flex items-center gap-2 group"
                  >
                    <div className="w-1.5 h-1.5 bg-gray-300 rounded-full group-hover:bg-purple-500 transition-colors"></div>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              ارتباط با ما
            </h3>
            <ul className="space-y-4">
              {contactInfo.map((info, index) => (
                <li key={index} className="flex items-center gap-3">
                  <div className="text-purple-600">{info.icon}</div>
                  {info.href ? (
                    <a
                      href={info.href}
                      className="text-gray-600 hover:text-purple-600 text-sm transition-colors"
                    >
                      {info.text}
                    </a>
                  ) : (
                    <span className="text-gray-600 text-sm">{info.text}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              شبکه‌های اجتماعی
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              ما را در شبکه‌های اجتماعی دنبال کنید
            </p>
            <div className="flex gap-4">
              {socialMedias.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="size-10 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:text-white hover:bg-purple-600 hover:border-purple-600 transition-all duration-300 group"
                  aria-label={social.label}
                  title={social.label}
                >
                  <div className="group-hover:scale-110 transition-transform">
                    {social.icon}
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-8"></div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500 text-center md:text-right">
            © ۱۴۰۳ مدکالکشن. کلیه حقوق این سایت محفوظ است.
          </p>

          <div className="flex items-center gap-6">
            <Link
              href="/privacy"
              className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
            >
              حریم خصوصی
            </Link>
            <Link
              href="/terms"
              className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
            >
              قوانین و مقررات
            </Link>
            <Link
              href="/faq"
              className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
            >
              سوالات متداول
            </Link>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100">
          <p className="text-xs text-gray-400 text-center">
            طراحی و توسعه با ❤️ برای علاقه‌مندان به مد و پوشاک
          </p>
        </div>
      </div>
    </footer>
  );
}
