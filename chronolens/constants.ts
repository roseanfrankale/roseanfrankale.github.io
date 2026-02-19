
import { PhotoItem, MysteryPost, AppTheme } from './types';

export const THEME_PALETTES: Record<AppTheme, Record<string, string>> = {
  cyberpunk: {
    '--bg-base': '#000000',
    '--bg-panel': '#050b14',
    '--color-primary': '#00f0ff',   // Cyan
    '--color-secondary': '#7000ff', // Purple
    '--font-sans': '"Inter", system-ui, sans-serif',
    '--font-mono': '"JetBrains Mono", monospace',
  },
  ancient: {
    '--bg-base': '#1a1612',         // Deep Brown/Black
    '--bg-panel': '#2c241b',        // Leather/Wood tone
    '--color-primary': '#d4b483',   // Parchment Gold
    '--color-secondary': '#c14953', // Faded Crimson
    '--font-sans': '"Cinzel", serif',
    '--font-mono': '"Cinzel", serif',
  },
  library: {
    '--bg-base': '#1e293b',         // Slate 800
    '--bg-panel': '#0f172a',        // Slate 900
    '--color-primary': '#10b981',   // Emerald
    '--color-secondary': '#f59e0b', // Amber
    '--font-sans': '"Crimson Text", serif',
    '--font-mono': '"JetBrains Mono", monospace',
  }
};

// Sample Data for the Helix
export const MOCK_PHOTOS: PhotoItem[] = Array.from({ length: 30 }).map((_, i) => {
  const year = 2024 - i * 5;
  
  // Simulate Migration: Older photos in Europe, newer in US
  const isOld = year < 1980;
  const lat = isOld ? 48.8566 + (Math.random() * 5) : 40.7128 + (Math.random() * 5); // Parisish vs NYCish
  const lng = isOld ? 2.3522 + (Math.random() * 5) : -74.0060 + (Math.random() * 5);
  
  let generation: 'grandparents' | 'parents' | 'self' | 'children' = 'self';
  if (year < 1960) generation = 'grandparents';
  else if (year < 1990) generation = 'parents';
  else if (year > 2010) generation = 'children';
  
  // Unsplash images for realistic people
  const unsplashIds = [
      '1531123414780-f742f8266295', // Vintage lady
      '1543862475-ebbf11e445b5', // Man in suit
      '1517486887057-798886a34732', // Retro group
      '1494790108377-be9c29b29330', // Smiling
      '1552168324-d612d7772f59', // B&W
      '1503023345313-0f71e858db11', // Bus
  ];
  const imgId = unsplashIds[i % unsplashIds.length];

  return {
    id: `photo-${i}`,
    uri: `https://images.unsplash.com/photo-${imgId}?auto=format&fit=crop&w=400&q=80`,
    date: year.toString(),
    exifDate: year.toString(),
    title: `Archive Record #${1000 + i}`,
    ai_verified_status: i % 5 === 0 ? 'conflict' : 'verified',
    location: {
        lat,
        lng,
        label: isOld ? 'Europe Region' : 'North America'
    },
    generation,
    comments: i % 3 === 0 ? [
      {
        id: `c-${i}`,
        x: 50,
        y: 50,
        text: "This artifact shows signs of digital degradation.",
        authorId: "System_Admin",
        timestamp: new Date().toISOString()
      }
    ] : []
  };
});

export const MOCK_MYSTERY_POSTS: MysteryPost[] = [
  {
    id: 'mys-1',
    uri: 'https://images.unsplash.com/photo-1572949645841-094f3a9c4c94?auto=format&fit=crop&w=400&q=80',
    date: 'Unknown',
    title: 'Found in Attic',
    user: 'Alice_Walker',
    question: 'Is this 1920s or 1940s? The dress looks flapper but the car...',
    votes: 12,
    comments: [
        {
            id: 'mc-1',
            x: 30,
            y: 70,
            text: "Check the hubcaps. Those are definitely post-war.",
            authorId: "CarBuff55",
            timestamp: new Date().toISOString()
        }
    ]
  },
  {
    id: 'mys-2',
    uri: 'https://images.unsplash.com/photo-1542206395-9feb3edaa68d?auto=format&fit=crop&w=400&q=80',
    date: 'Unknown',
    title: 'Blurry Street Scene',
    user: 'RetroHunter',
    question: 'Can anyone identify this street corner? Maybe London?',
    votes: 8,
    comments: []
  },
  {
    id: 'mys-3',
    uri: 'https://images.unsplash.com/photo-1580129953335-d2268798cb34?auto=format&fit=crop&w=400&q=80',
    date: 'Unknown',
    title: 'Grandpa\'s Uniform',
    user: 'HistoryBuff99',
    question: 'What war is this uniform from?',
    votes: 25,
    comments: []
  },
   {
    id: 'mys-4',
    uri: 'https://images.unsplash.com/photo-1524624796336-d248b115456f?auto=format&fit=crop&w=400&q=80',
    date: 'Unknown',
    title: 'Strange Machine',
    user: 'TechArchaeologist',
    question: 'Is this a washing machine or a generator?',
    votes: 5,
    comments: []
  }
];

// SKSL / GLSL Shader for Film Grain
export const FILM_GRAIN_FRAGMENT_SHADER = `
  precision mediump float;
  varying vec2 vUv;
  uniform float uTime;
  uniform float uIntensity;

  float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
  }

  void main() {
    vec2 uv = vUv;
    float noise = random(uv + mod(uTime, 10.0));
    vec2 center = vec2(0.5, 0.5);
    float d = distance(uv, center);
    float vignette = 1.0 - smoothstep(0.4, 1.0, d);
    vec3 leakColor = vec3(1.0, 0.6, 0.3);
    float leakIntensity = 0.5 * sin(uTime * 0.5) + 0.5;
    float leakMask = smoothstep(0.4, 1.2, uv.x + uv.y * 0.5 + sin(uTime * 0.2));
    vec3 finalColor = vec3(noise) * uIntensity;
    finalColor += leakColor * leakMask * 0.1;
    gl_FragColor = vec4(finalColor, 0.15); 
  }
`;

export const VERTEX_SHADER = `
  attribute vec2 position;
  varying vec2 vUv;
  void main() {
    vUv = position * 0.5 + 0.5;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;
