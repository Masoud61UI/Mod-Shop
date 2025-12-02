import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/src/trpc/client";
import {
  ShippingSettings,
  ShippingSettingsForCalculation,
} from "@/src/lib/typeShipping";

export function useShippingSettings() {
  const trpc = useTRPC();

  const { data, isLoading, error } = useQuery(
    trpc.shipping.getSettings.queryOptions()
  );

  const safeSettings: ShippingSettingsForCalculation = {
    enabled: data?.enabled ?? true,
    baseCost: data?.baseCost ?? 70000,
    freeThreshold: data?.freeThreshold ?? 1000000,
    message: data?.message ?? "خرید بالای ۱,۰۰۰,۰۰۰ تومان رایگان",
  };

  return {
    settings: safeSettings,
    isLoading,
    error,
  };
}
