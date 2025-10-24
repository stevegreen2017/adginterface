// TypeScript interfaces and types
export interface Asset {
  id: number;
  name: string;
  type: string;
  registered: string;
  views: number;
  references: number;
  contributions: number;
  verified: boolean;
}

export interface Credential {
  name: string;
  earned: boolean;
}

export interface Activity {
  user: string;
  action: string;
  asset: string | null;
  time: string;
}

export interface ContributionEntry {
  date: string;
  user: string;
  action: string;
  type: 'create' | 'reference' | 'contribution';
}

export type Screen = 'mywork' | 'register' | 'processing' | 'success' | 'detail' | 'projects' | 'search' | 'inbox' | 'profile';
