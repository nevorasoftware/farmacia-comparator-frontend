export interface Pharmacy {
  id: number;
  name: string;
  code: string;
  baseUrl: string;
  logoUrl?: string;
  isActive: boolean;
}

export interface ProductSearch {
  id: number;
  name: string;
  activeIngredient: string;
  concentration?: string;
  pharmaceuticalForm?: string;
  brand?: string;
  laboratory?: string;
  healthRegistration?: string;
  presentation?: string;
  minPrice?: number;
  maxPrice?: number;
  pvmpSrs?: number;
  availablePharmaciesCount: number;
}

export interface PharmacyPrice {
  pharmacyId: number;
  pharmacyName: string;
  pharmacyCode: string;
  originalName: string;
  presentation?: string;
  price?: number;
  offerPrice?: number;
  isAvailable: boolean;
  url: string;
  imageUrl?: string;
  lastUpdated: string;
  differenceVsPvmp?: number;
  percentageVsPvmp?: number;
}

export interface SrsReference {
  healthRegistration: string;
  chm?: string;
  productName: string;
  activeIngredient: string;
  concentration?: string;
  pharmaceuticalForm?: string;
  presentation?: string;
  laboratory?: string;
  pvmp: number;
  pvmpUnit?: number;
  pvmpPresentation?: number;
  marketPrice?: number;
  pvmpType?: string;
  effectiveDate?: string;
  sourceUrl?: string;
  lastVerifiedAt: string;
}

export interface EquivalentProduct {
  id: number;
  name: string;
  brand?: string;
  laboratory?: string;
  activeIngredient: string;
  concentration?: string;
  pharmaceuticalForm?: string;
  presentation?: string;
  minPrice?: number;
  maxPrice?: number;
  pvmpSrs?: number;
}

export interface PriceHistoryPoint {
  pharmacyId: number;
  pharmacyName: string;
  price: number;
  offerPrice?: number;
  isAvailable: boolean;
  checkedAt: string;
}

export interface ProductComparison {
  id: number;
  name: string;
  activeIngredient: string;
  concentration?: string;
  pharmaceuticalForm?: string;
  administrationRoute?: string;
  brand?: string;
  laboratory?: string;
  healthRegistration?: string;
  chm?: string;
  presentation?: string;
  quantity?: number;
  unit?: string;
  lowestPrice?: number;
  highestPrice?: number;
  srsReference?: SrsReference;
  pharmacyPrices: PharmacyPrice[];
  equivalentProducts: EquivalentProduct[];
  priceHistory: PriceHistoryPoint[];
}

export interface ScrapingStatus {
  executionId: number;
  pharmacyId?: number;
  pharmacyName: string;
  pharmacyCode: string;
  status: string;
  recordsFound: number;
  recordsCreated: number;
  recordsUpdated: number;
  recordsFailed: number;
  errorMessage?: string;
  startedAt: string;
  finishedAt?: string;
  durationSeconds?: number;
}

export interface AdminDashboard {
  totalMasterProducts: number;
  totalPharmacyProducts: number;
  totalPharmacies: number;
  totalScrapingExecutions: number;
  latestScrapingStatus: ScrapingStatus[];
}
