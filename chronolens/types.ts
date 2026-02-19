
export interface CommentPin {
  id: string;
  x: number; // Percentage 0-100
  y: number; // Percentage 0-100
  text: string;
  authorId: string; // UID of the author (Required by Security Rules)
  timestamp: string;
  memoryId?: string; // Link comment to specific memory
}

export interface AnalysisResult {
  estimatedYearRange: number[]; // [start, end]
  locationClues: string[];
  reasoning: string;
  isConflict: boolean;
  confidenceScore: number;
}

export interface PhotoLocation {
  lat: number;
  lng: number;
  label: string;
}

export interface PhotoItem {
  id: string;
  uri: string; // Base64 or URL
  date: string; // ISO Date or Year
  exifDate?: string;
  title: string;
  location?: PhotoLocation; // New Location Data
  generation?: 'grandparents' | 'parents' | 'self' | 'children'; // For Tree View
  comments?: CommentPin[];
  analysis?: AnalysisResult;
  
  // Firestore Security Fields
  ownerId?: string; // PII Vault Owner
  familyId?: string; // Shared Context Scope
  ai_verified_status?: 'verified' | 'conflict' | 'unverified'; // Derived Status
}

export interface MysteryPost extends PhotoItem {
  user: string;
  question: string;
  votes: number;
}

export interface ScrollState {
  top: number;
  velocity: number;
}

export type ViewState = 'scanner' | 'vault' | 'mystery';
export type VaultViewMode = 'timeline' | 'map' | 'tree' | 'grid';
export type CameraMode = 'snapshot' | 'artifact' | 'scanner-pro';
export type AppTheme = 'cyberpunk' | 'ancient' | 'library';
