export enum UserRole {
  CONSUMER = 'Consumer',
  MANUFACTURER = 'Manufacturer',
  DISTRIBUTOR = 'Distributor',
  RETAILER = 'Retailer'
}

export enum ProductStatus {
  MANUFACTURED = 'Manufactured',
  IN_TRANSIT = 'In Transit',
  AT_DISTRIBUTOR = 'At Distributor',
  IN_RETAIL = 'In Retail',
  SOLD = 'Sold',
  FLAGGED = 'Flagged (Suspected Fake)'
}

export interface Product {
  id: string;
  name: string;
  category: 'Pharmaceuticals' | 'Luxury' | 'FMCG' | 'Electronics';
  description: string;
  manufacturer: string;
  manufactureDate: string;
  expiryDate?: string;
  batchNumber: string;
  imageUrl: string;
  status: ProductStatus;
  currentLocation: string;
}

export interface Transaction {
  hash: string;
  timestamp: string;
  productId: string;
  action: string;
  actor: string;
  location: string;
  previousHash: string;
}

export interface ScanResult {
  isValid: boolean;
  product?: Product;
  history: Transaction[];
  aiAnalysis?: string;
}