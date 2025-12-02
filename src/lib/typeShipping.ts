export interface ShippingSettings {
  enabled?: boolean | null;
  baseCost?: number | null;
  freeThreshold?: number | null;
  message?: string | null;
  name?: string | null;
  id?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface ShippingSettingsForCalculation {
  enabled: boolean;
  baseCost: number;
  freeThreshold: number;
  message: string;
}