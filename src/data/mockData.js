// Mock Data for LifeReceipt Purchase Intelligence Vault
// Deterministic Demo Date: 2026-09-03
export const DEMO_DATE = "2026-09-03";

export const initialPurchases = [
  {
    id: "purch-1",
    name: "LG UltraGear Monitor",
    brand: "LG Electronics",
    category: "Displays",
    price: 32999,
    store: "Croma Tech MegaStore",
    purchaseDate: "2024-09-14",
    warrantyMonths: 24,
    warrantyExpires: "2026-09-14",
    daysRemaining: 11, // 2026-09-14 minus 2026-09-03 = 11 days
    status: "EXPIRING", // EXPIRING, PROTECTED, AT_RISK
    returnWindow: "Closed (30 Days)",
    serialNumber: "LG-UG27-994821-X",
    receiptId: "RCP-LG-88192",
    claimEligibility: "Eligible",
    issueDescription: "Display panel micro-flicker under high refresh rate.",
    icon: "🖥️",
    receiptDetails: {
      storeName: "Croma Electronics - Indiranagar",
      taxId: "GSTIN29ABCDE1234F1Z5",
      purchaseDate: "14 Sept 2024, 14:32",
      paymentMethod: "HDFC Visa Credit Card (**** 8841)",
      items: [
        { name: "LG 27\" 4K UltraGear Nano-IPS Monitor", price: 27965, qty: 1 }
      ],
      subtotal: 27965,
      tax: 5034,
      total: 32999
    },
    x: 250,
    y: 180,
    z: 1.2
  },
  {
    id: "purch-2",
    name: "Sony WH-1000XM6",
    brand: "Sony",
    category: "Audio",
    price: 24999,
    store: "Reliance Digital Experience",
    purchaseDate: "2024-09-22",
    warrantyMonths: 24,
    warrantyExpires: "2026-09-22",
    daysRemaining: 19, // 2026-09-22 minus 2026-09-03 = 19 days
    status: "EXPIRING",
    returnWindow: "Closed (14 Days)",
    serialNumber: "SN-WH1000XM6-773192",
    receiptId: "RCP-SNY-99201",
    claimEligibility: "Eligible",
    issueDescription: "Left earcup stopped producing sound after recent firmware update.",
    icon: "🎧",
    receiptDetails: {
      storeName: "Reliance Digital - MG Road",
      taxId: "GSTIN29XYZAB5678G2Z9",
      purchaseDate: "22 Sept 2024, 18:15",
      paymentMethod: "UPI (Google Pay)",
      items: [
        { name: "Sony WH-1000XM6 Wireless Noise Cancelling (Silver)", price: 21185, qty: 1 }
      ],
      subtotal: 21185,
      tax: 3814,
      total: 24999
    },
    x: 580,
    y: 130,
    z: 1.4
  },
  {
    id: "purch-3",
    name: "Mechanical Keyboard",
    brand: "Keychron",
    category: "Peripherals",
    price: 8499,
    store: "Meckeys India",
    purchaseDate: "2025-09-30",
    warrantyMonths: 12,
    warrantyExpires: "2026-09-30",
    daysRemaining: 27, // 2026-09-30 minus 2026-09-03 = 27 days
    status: "EXPIRING",
    returnWindow: "Closes in 2 days",
    serialNumber: "KC-Q1PRO-881273",
    receiptId: "RCP-KC-33104",
    claimEligibility: "Eligible",
    issueDescription: "Spacebar switch intermitting double clicks.",
    icon: "⌨️",
    receiptDetails: {
      storeName: "Meckeys Online Store",
      taxId: "GSTIN27MKIND9910H1Z3",
      purchaseDate: "30 Sept 2025, 11:04",
      paymentMethod: "NetBanking ICICI",
      items: [
        { name: "Keychron Q1 Pro Custom Wireless Mechanical Keyboard", price: 7202, qty: 1 }
      ],
      subtotal: 7202,
      tax: 1297,
      total: 8499
    },
    x: 180,
    y: 380,
    z: 0.9
  },
  {
    id: "purch-4",
    name: "Apple MacBook Air",
    brand: "Apple",
    category: "Computers",
    price: 99900,
    store: "Apple Store BKC, Mumbai",
    purchaseDate: "2025-03-15",
    warrantyMonths: 24,
    warrantyExpires: "2027-03-15",
    daysRemaining: 558,
    status: "PROTECTED",
    returnWindow: "Closed",
    serialNumber: "C02G8912M1X",
    receiptId: "RCP-APL-11029",
    claimEligibility: "Protected",
    issueDescription: "None reported. AppleCare+ Active.",
    icon: "💻",
    receiptDetails: {
      storeName: "Apple BKC Official Store",
      taxId: "GSTIN27APPL88191J1Z0",
      purchaseDate: "15 Mar 2025, 16:40",
      paymentMethod: "Apple Card / Amex",
      items: [
        { name: "MacBook Air 15\" M3 / 16GB / 512GB Midnight", price: 84661, qty: 1 },
        { name: "2-Year AppleCare+ Protection Plan", price: 0, qty: 1 }
      ],
      subtotal: 84661,
      tax: 15239,
      total: 99900
    },
    x: 420,
    y: 280,
    z: 1.5
  },
  {
    id: "purch-5",
    name: "Logitech MX Master",
    brand: "Logitech",
    category: "Peripherals",
    price: 8995,
    store: "Amazon India",
    purchaseDate: "2025-06-10",
    warrantyMonths: 24,
    warrantyExpires: "2027-06-10",
    daysRemaining: 645,
    status: "PROTECTED",
    returnWindow: "Closed",
    serialNumber: "LZ-MX3S-991823",
    receiptId: "RCP-LOG-55192",
    claimEligibility: "Protected",
    issueDescription: "None reported.",
    icon: "🖱️",
    receiptDetails: {
      storeName: "Amazon Retail India",
      taxId: "GSTIN29AMZON1122K1Z8",
      purchaseDate: "10 Jun 2025, 09:20",
      paymentMethod: "Amazon Pay UPI",
      items: [
        { name: "Logitech MX Master 3S Wireless Performance Mouse", price: 7622, qty: 1 }
      ],
      subtotal: 7622,
      tax: 1373,
      total: 8995
    },
    x: 720,
    y: 350,
    z: 1.0
  },
  {
    id: "purch-6",
    name: "Samsung SSD",
    brand: "Samsung",
    category: "Storage",
    price: 7499,
    store: "MDComputers",
    purchaseDate: "2025-01-20",
    warrantyMonths: 60,
    warrantyExpires: "2030-01-20",
    daysRemaining: 1234,
    status: "PROTECTED",
    returnWindow: "Closed",
    serialNumber: "SS-990PRO-2TB-881",
    receiptId: "RCP-SAM-77182",
    claimEligibility: "Protected",
    issueDescription: "None reported.",
    icon: "💽",
    receiptDetails: {
      storeName: "MDComputers Tech Store",
      taxId: "GSTIN19MDCOM3344L1Z2",
      purchaseDate: "20 Jan 2025, 13:50",
      paymentMethod: "Credit Card",
      items: [
        { name: "Samsung 990 PRO NVMe M.2 SSD 2TB", price: 6355, qty: 1 }
      ],
      subtotal: 6355,
      tax: 1144,
      total: 7499
    },
    x: 320,
    y: 480,
    z: 0.8
  },
  {
    id: "purch-7",
    name: "JBL Speaker",
    brand: "JBL",
    category: "Audio",
    price: 11999,
    store: "Vijay Sales",
    purchaseDate: "2025-08-05",
    warrantyMonths: 24,
    warrantyExpires: "2027-08-05",
    daysRemaining: 701,
    status: "PROTECTED",
    returnWindow: "Closed",
    serialNumber: "JBL-CHG5-559128",
    receiptId: "RCP-JBL-10293",
    claimEligibility: "Protected",
    issueDescription: "None reported.",
    icon: "🔊",
    receiptDetails: {
      storeName: "Vijay Sales - Koramangala",
      taxId: "GSTIN29VIJAY5566M1Z1",
      purchaseDate: "05 Aug 2025, 17:10",
      paymentMethod: "Debit Card",
      items: [
        { name: "JBL Charge 5 Portable Waterproof Bluetooth Speaker", price: 10168, qty: 1 }
      ],
      subtotal: 10168,
      tax: 1831,
      total: 11999
    },
    x: 630,
    y: 490,
    z: 1.1
  }
];

export const initialClaims = [
  {
    claimId: "LR-20481",
    purchaseId: "purch-2",
    productName: "Sony WH-1000XM6",
    brand: "Sony",
    price: 24999,
    issue: "Left earcup stopped producing sound after recent firmware update.",
    status: "AWAITING_APPROVAL", // READY_TO_CLAIM, AWAITING_APPROVAL, SUBMITTED, UNDER_REVIEW
    createdAt: "2026-09-03 08:32",
    warrantyExpires: "2026-09-22",
    receiptVerified: true,
    claimReference: "SNY-WR-992014"
  },
  {
    claimId: "LR-19042",
    purchaseId: "purch-1",
    productName: "LG UltraGear Monitor",
    brand: "LG Electronics",
    price: 32999,
    issue: "Display panel micro-flicker under high refresh rate.",
    status: "READY_TO_CLAIM",
    createdAt: "2026-09-02 14:10",
    warrantyExpires: "2026-09-14",
    receiptVerified: true,
    claimReference: "LG-WR-331902"
  }
];

export const initialAgentLogs = [
  {
    id: "log-1",
    timestamp: "09:41",
    tool: "search_purchases",
    input: { query: "expiring warranties" },
    output: "Found 3 purchases expiring within 30 days.",
    status: "SUCCESS"
  },
  {
    id: "log-2",
    timestamp: "09:42",
    tool: "check_warranty",
    input: { purchaseId: "purch-2" },
    output: "Sony WH-1000XM6 warranty ACTIVE until 2026-09-22 (19 days left).",
    status: "SUCCESS"
  },
  {
    id: "log-3",
    timestamp: "09:43",
    tool: "get_receipt",
    input: { purchaseId: "purch-2" },
    output: "Receipt RCP-SNY-99201 verified. Purchase date 22 Sept 2024.",
    status: "SUCCESS"
  },
  {
    id: "log-4",
    timestamp: "09:44",
    tool: "prepare_claim",
    input: { purchaseId: "purch-2", issue: "Left earcup stopped producing sound" },
    output: "Claim drafted for Sony India Support. Claim ID: LR-20481",
    status: "SUCCESS"
  },
  {
    id: "log-5",
    timestamp: "09:44",
    tool: "request_claim_approval",
    input: { claimId: "LR-20481" },
    output: "🔐 HUMAN APPROVAL REQUIRED. Halting execution until user response.",
    status: "WAITING_FOR_APPROVAL"
  }
];

export const webMcpToolsCatalog = [
  {
    name: "search_purchases",
    description: "Searches the user's purchase intelligence vault by name, category, or warranty status.",
    inputSchema: "{ query: string, status?: 'PROTECTED'|'EXPIRING'|'AT_RISK' }"
  },
  {
    name: "get_purchase",
    description: "Retrieves complete metadata, serial number, and warranty breakdown for a single purchase.",
    inputSchema: "{ purchaseId: string }"
  },
  {
    name: "check_warranty",
    description: "Calculates precise days remaining, return window status, and warranty eligibility.",
    inputSchema: "{ purchaseId: string }"
  },
  {
    name: "find_expiring_warranties",
    description: "Scans vault for purchases with warranties expiring within 30 days.",
    inputSchema: "{ thresholdDays?: number }"
  },
  {
    name: "get_receipt",
    description: "Fetches and verifies authentic digital receipt breakdown including subtotal, tax, store ID.",
    inputSchema: "{ purchaseId: string }"
  },
  {
    name: "prepare_claim",
    description: "Drafts a formal warranty claim package with serial number, issue description, and proof of purchase.",
    inputSchema: "{ purchaseId: string, issue: string }"
  },
  {
    name: "request_claim_approval",
    description: "Triggers mandatory human-in-the-loop approval interface. Pauses autonomous action.",
    inputSchema: "{ claimId: string }"
  },
  {
    name: "submit_claim",
    description: "Transmits verified claim package to manufacturer support API. Requires prior human approval.",
    inputSchema: "{ claimId: string }"
  },
  {
    name: "get_claim_status",
    description: "Polls claim tracking status with official ticket reference number.",
    inputSchema: "{ claimId: string }"
  }
];

// Helper functions for centralized derived calculations (Section 1 Data Consistency)
export const calculateVaultMetrics = (purchases, claims) => {
  const totalAssetsCount = purchases.length; // 7
  const activeWarrantiesCount = purchases.filter(p => p.status === 'PROTECTED' || p.status === 'EXPIRING').length; // 7
  const expiringCount = purchases.filter(p => p.status === 'EXPIRING').length; // 3
  
  // Protected Value = Value of purchases currently protected (>30 days remaining)
  const protectedValue = purchases
    .filter(p => p.status === 'PROTECTED')
    .reduce((acc, p) => acc + p.price, 0); // ₹1,28,393

  // Money at Risk = Value of purchases with warranties expiring within 30 days
  const moneyAtRisk = purchases
    .filter(p => p.status === 'EXPIRING')
    .reduce((acc, p) => acc + p.price, 0); // ₹66,497 (LG ₹32,999 + Sony ₹24,999 + Keyboard ₹8,499)

  const claimOpportunitiesCount = claims.filter(c => c.status === 'READY_TO_CLAIM' || c.status === 'AWAITING_APPROVAL').length; // 2

  return {
    totalAssetsCount,
    activeWarrantiesCount,
    expiringCount,
    protectedValue,
    moneyAtRisk,
    claimOpportunitiesCount
  };
};
