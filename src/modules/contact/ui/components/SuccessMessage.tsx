import { CheckCircle } from "lucide-react";
import { Button } from "@/src/components/ui/button";

interface SuccessMessageProps {
  onReset: () => void;
}

export const SuccessMessage = ({ onReset }: SuccessMessageProps) => (
  <div className="text-center py-12 px-12 border border-gray-200 rounded-lg">
    <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
      <CheckCircle className="h-10 w-10 text-green-600" />
    </div>
    <h2 className="text-xl font-semibold text-gray-800 mb-3">
      پیام شما با موفقیت ارسال شد!
    </h2>
    <p className="text-gray-600 max-w-md mx-auto mb-8 text-sm">
      متشکریم که با ما در ارتباط هستید. کارشناسان ما در اسرع وقت پیام شما را
      بررسی کرده و پاسخ خواهند داد.
    </p>
    <Button
      onClick={onReset}
      variant="outline"
      className="border-gray-300 text-gray-700 hover:bg-gray-50 h-10 text-sm"
    >
      ارسال پیام جدید
    </Button>
  </div>
);
