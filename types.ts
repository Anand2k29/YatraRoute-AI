export enum TrainStatus {
  AVL = "AVAILABLE",
  RAC = "RAC",
  WL = "WAITLIST",
  REGRET = "REGRET"
}

export interface TrainLeg {
  trainName: string;
  trainNumber: string;
  sourceStation: string;
  destinationStation: string;
  departureTime: string; // HH:mm
  arrivalTime: string; // HH:mm
  duration: string;
  status: string; // AVL, WL, RAC
  ticketClass: string;
  date: string;
  probability?: number;
}

export interface DirectRoute {
  leg: TrainLeg;
}

export interface SplitRoute {
  junctionStation: string;
  tags?: string[];
  totalDuration: string;
  leg1: TrainLeg;
  leg2: TrainLeg;
  layoverDuration: string;
  reasoning: string;
}

export interface PlatformPrice {
  platformName: string;
  finalPrice: number;
  breakdown: string;
  isCheapest: boolean;
  verdict?: string;
}

export interface FareAnalysis {
  baseFare: number;
  prices: PlatformPrice[]; // IRCTC, RedRail, MMT, Ixigo
  bestDealLabel: string; // e.g., "RedRail (-₹50)"
  secretTip?: string;
}

export interface RankedRoute {
  id: string;
  rank: number;
  title: string; // e.g., "The Jugaad Special" or "Direct (High Risk)"
  type: 'split' | 'direct';
  summary: string; // "Via Jabalpur" or "Direct Train"
  totalDuration: string;
  
  // Visual Line Data
  stations: string[]; // [Source, Junction?, Destination]
  midDuration?: string; // Layover time if split
  layoverTip?: string; // "Good food court on Platform 1"

  legs: TrainLeg[]; // 1 or 2 legs
  
  badges: {
    label: string;
    type: 'SAFE' | 'MODERATE' | 'RISKY' | 'CHEAP';
  }[];
  
  reason: string; // "Why this works"
  fareAnalysis: FareAnalysis;
}

export interface AnalysisLogEntry {
  optionLabel: string;
  status: 'APPROVED' | 'REJECTED' | 'WARNING';
  reason: string;
  riskLevel: 'GREEN' | 'YELLOW' | 'RED';
}

export interface SearchParams {
  source: string;
  destination: string;
  date: string;
}

export interface SearchResponse {
  routes: RankedRoute[];
  logs?: AnalysisLogEntry[];
}