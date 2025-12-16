import { AlertTriangle, LogIn } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface AuthAlertProps {
  router: ReturnType<typeof useRouter>;
}

export const AuthAlert = ({ router }: AuthAlertProps) => (
  <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl shadow-sm p-5 border border-amber-200">
    <div className="flex items-center gap-3 mb-3">
      <div className="bg-amber-100 p-2 rounded-lg">
        <AlertTriangle className="h-4 w-4 text-amber-600" />
      </div>
      <h3 className="font-medium text-amber-800">توجه</h3>
    </div>
    <p className="text-amber-700 text-sm mb-4">
      برای ارسال پیام نیاز است ابتدا وارد حساب کاربری خود شوید.
    </p>
    <div className="space-y-3">
      <Button
        onClick={() =>
          router.push(`/login?redirect=${encodeURIComponent("/contact")}`)
        }
        className="w-full bg-amber-500 hover:bg-amber-600 h-10 text-sm cursor-pointer"
      >
        <LogIn className="h-3.5 w-3.5 ml-0.5" />
        ورود به حساب کاربری
      </Button>
      <Link href="/signup" className="block">
        <Button
          variant="outline"
          className="w-full border-amber-300 text-amber-600 hover:bg-amber-50 h-10 text-sm cursor-pointer"
        >
          ساخت حساب جدید
        </Button>
      </Link>
    </div>
  </div>
);
