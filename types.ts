

export type Department = 'homicide' | 'cyber' | 'theft';

export interface Victim {
  name: string;
  age: number;
  job: string;
  personality: string;
}

export interface CrimeScene {
  description: string;
  time: string;
  deathCause: string;
}

export interface Suspect {
  id: number;
  name: string;
  relation: string;
  motive: string;
  alibi: string;
  isKiller: boolean;
  avatarUrl?: string;
}

// Homicide specific
export interface AutopsyReport {
  timeOfDeath: string;
  toxicology: string;
  wounds: string;
  notes: string;
}

// Cyber specific
export interface ServerLog {
  timestamp: string;
  ip: string;
  action: string;
  status: 'SUCCESS' | 'FAILED' | 'WARNING';
}

// Theft specific
export interface SurveillanceLog {
  time: string;
  camera: string;
  observation: string;
  timeParsed?: number; // Helper for logic if needed
}

// New: Map Visualization Points
export interface MapPoint {
  id: string;
  x: number; // Percentage 0-100
  y: number; // Percentage 0-100
  label: string;
  type: 'body' | 'evidence' | 'blood' | 'entry' | 'other';
  description: string; // The detail revealed upon click
}

export interface Scenario {
  city: string;
  locationName: string;
  victim: Victim;
  crimeScene: CrimeScene;
  suspects: Suspect[];
  clues: string[]; // General clues
  intro: string;
  
  // Interactive Map Data
  mapPoints?: MapPoint[];

  // Department specific unique data
  autopsy?: AutopsyReport;
  serverLogs?: ServerLog[];
  surveillance?: SurveillanceLog[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai' | 'teammate';
  text: string;
  timestamp: Date;
  senderName?: string; // For multiplayer
}

export type CaseStatus = 'active' | 'solved_win' | 'solved_lose';

export interface CaseFile {
  id: string;
  department: Department;
  title: string;
  scenario: Scenario;
  status: CaseStatus;
  createdAt: string;
  messages: ChatMessage[];
  questionsUsed: number;
  lastActiveTab?: string;
  isMultiplayer?: boolean;
  teammateName?: string;
  isAiGenerated?: boolean; // New Flag for AI/Offline mode
  difficulty?: 'easy' | 'medium' | 'hard'; // New
  isRedNotice?: boolean; // New: High value target
}

export enum GameState {
  START,
  LOADING,
  PLAYING,
  SOLVED_WIN,
  SOLVED_LOSE,
}

// --- NEW SOCIAL & PROFILE TYPES ---

export interface Detective {
  id: string;
  name: string;
  title: string;
  description: string;
  avatar: string;
  specialAbility: string; // Text description
  bonus: {
    maxQuestions?: number; // Add extra questions
    xpMultiplier?: number; // Gain more XP
  };
  price: number; // 0 if free
  isOwned: boolean;
}

export interface StoreItem {
  id: string;
  name: string;
  type: 'cosmetic' | 'upgrade' | 'theme' | 'case_package';
  description: string;
  icon: string;
  price: number;
  purchased: boolean;
  energyValue?: number; // For coffee
  packageDifficulty?: 'easy' | 'medium' | 'hard'; // For case packages
}

export interface UserProfile {
  userId: string; // Unique ID (e.g. #TR-1234)
  name: string;
  title: string; // e.g. "Başkomiser"
  level: number;
  xp: number;
  score: number; // Competitive ranking score
  coins: number;
  energy: number; // New
  maxEnergy: number; // New
  isDeveloperMode?: boolean; // New: Developer Mode Flag
  casesSolved: number;
  correctAccusations: number;
  selectedDetectiveId: string;
  detectives: Detective[];
  inventory: StoreItem[];
  avatar: string; // Custom avatar URL
  avatarColor?: string; // New: Background color for ID Photo
  activeThemeId?: string; // New: Tracks which theme is equipped
  profileColor?: string; // New: Background color for profile card
}

export interface SocialPost {
  id: string;
  user: string;
  avatar: string;
  message: string;
  timestamp: string;
  isMe: boolean;
}

export interface Friend {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'busy';
  avatar: string;
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  title: string;
  score: number;
  casesSolved: number;
  avatar: string;
  isMe: boolean;
}