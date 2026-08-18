export type OfferStatus = "available" | "over" | "removed";

export interface Offer {
  id: string;
  provider: string;
  product: string;
  category: string;
  monthlyPrice: number; // 29.99
  setupFee: number; // 49.99
  speedMbps: number; // 150
  rating: number; // 4.0
  contractMonths: number; // 12
  status: OfferStatus;
  featured: boolean;
}
