import { Product, ProductStatus, Transaction } from "./types";

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "TC-IN-7829",
    name: "LifeGuard Paracetamol 500mg",
    category: "Pharmaceuticals",
    description: "Standard antipyretic and analgesic.",
    manufacturer: "MediSafe India Ltd, Mumbai",
    manufactureDate: "2023-10-15",
    expiryDate: "2025-10-15",
    batchNumber: "B-2023-X99",
    imageUrl: "https://picsum.photos/200/200?random=1",
    status: ProductStatus.IN_RETAIL,
    currentLocation: "Apollo Pharmacy, Bangalore"
  },
  {
    id: "TC-IN-9921",
    name: "Royal Silk Saree - Kanchipuram",
    category: "Luxury",
    description: "Authentic handwoven silk saree with gold zari.",
    manufacturer: "SilkWeavers Co-op, Tamil Nadu",
    manufactureDate: "2024-01-10",
    batchNumber: "S-KANCHI-005",
    imageUrl: "https://picsum.photos/200/200?random=2",
    status: ProductStatus.SOLD,
    currentLocation: "Consumer Address, Delhi"
  },
  {
    id: "TC-IN-FAKE",
    name: "Suspected Fake Watch",
    category: "Luxury",
    description: "Counterfeit imitation of a luxury brand.",
    manufacturer: "Unknown Source",
    manufactureDate: "Unknown",
    batchNumber: "INVALID",
    imageUrl: "https://picsum.photos/200/200?random=3",
    status: ProductStatus.FLAGGED,
    currentLocation: "Confiscated"
  }
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    hash: "0x8f3...29a",
    timestamp: "2023-10-15 09:00",
    productId: "TC-IN-7829",
    action: "MANUFACTURED",
    actor: "MediSafe India Ltd",
    location: "Mumbai, MH",
    previousHash: "0x000...000"
  },
  {
    hash: "0x1d4...88b",
    timestamp: "2023-10-20 14:30",
    productId: "TC-IN-7829",
    action: "SHIPPED_TO_DISTRIBUTOR",
    actor: "FastLogistics Inc",
    location: "Pune, MH",
    previousHash: "0x8f3...29a"
  },
  {
    hash: "0x92c...11f",
    timestamp: "2023-10-25 10:15",
    productId: "TC-IN-7829",
    action: "RECEIVED_AT_RETAIL",
    actor: "Apollo Pharmacy",
    location: "Bangalore, KA",
    previousHash: "0x1d4...88b"
  }
];