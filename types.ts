
export interface ProjectData {
  id: string;
  title: string;
  subtitle: string;
  description: string; // Short summary for cards
  roles: string[];
  tools: string[];
  heroImage: string;
  images: string[]; // General gallery images
  link?: string;
  date?: string;
  client?: string;
  
  // Extended Case Study Data
  overview?: string; // Long form overview
  problem?: string;
  solution?: string;
  process?: {
    title: string;
    description: string;
    image?: string;
  }[];
  results?: {
    metric: string;
    label: string;
  }[];
  keyLearnings?: string[];
}

export interface GalleryItem {
  id: string;
  title: string;
  category: string[]; 
  image: string;
  link?: string;
}

export interface MusicProject {
  id: string;
  name: string;
  role: string;
  years: string;
  description: string;
  notablePerformances?: string;
  image: string;
  spotifyEmbedUrl?: string;
  color: string; 
}

export enum FilterType {
  ALL = 'ALL',
  NEBUSIS = 'NEBUSIS',
  NAESOR = 'NAESOR',
  QURADO = 'QURADO',
  BRUVUE = 'BRUVUE',
  LANDING = 'LANDING',
  MOCKUPS = 'MOCKUPS',
  DASHBOARDS = 'DASHBOARDS',
  MARKETING = 'MARKETING'
}

export interface ExperienceItem {
  company: string;
  role: string;
  date: string;
  location: string;
  description: string;
  link?: string;
  icon?: string;
}

declare global {
  interface Window {
    ColorThief: any;
  }
}