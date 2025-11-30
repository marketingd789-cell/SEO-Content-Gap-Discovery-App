export interface Competitor {
  url: string;
  name: string;
  topKeywords: string[];
  strengths: string[];
  visibilityScore: number;
  blogThemes: string[];
}

export interface ContentOpportunity {
  id: string;
  title: string;
  type: 'blog' | 'product_category' | 'landing_page';
  difficulty: 'Low' | 'Medium' | 'High';
  reason: string;
  targetKeyword: string;
}

export interface WebsiteAnalysis {
  url: string;
  websiteScore: number;
  categories: string[];
  blogThemes: string[];
  competitors: Competitor[];
  opportunities: ContentOpportunity[];
}

export interface GeneratedContent {
  title: string;
  content: string; // Markdown
  metaDescription: string;
  targetKeywords: string[];
}

export enum AppState {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  RESULTS = 'RESULTS',
  GENERATING_CONTENT = 'GENERATING_CONTENT',
  ERROR = 'ERROR'
}