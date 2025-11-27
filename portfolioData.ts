export interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  heroImage: string;
  images: string[];
  roles: string[];
  tools: string[];
  date: string;
  link?: string;
  problem?: string;
  solution?: string;
  process?: { title: string; description: string; image?: string }[];
  results?: { metric: string; label: string }[];
  keyLearnings?: string[];
}

export interface Experience {
  company: string;
  role: string;
  date: string;
  location: string;
  description: string;
}

export interface MusicProject {
  id: string;
  name: string;
  years: string;
  role: string;
  description: string;
  image: string;
  color: string; // e.g., 'text-red-400'
  notablePerformances?: string;
  spotifyEmbedUrl?: string;
}

// --- FILL THIS OUT WITH YOUR DATA ---

export const bioText = `Hello, I am Rosean Frank-Alexander! When I was very young my grandmother purchased a Compaq Presario which included a music video for Buddy Holly by Weezer.

Little did I know then, that moment it became the foundation of future interests and sparked my affinity for technology, software, and music.

I am a technology professional with diverse industry expertise (Payments (PCI-DSS), ISO, Warehousing Logistics, E-Commerce and Music & Entertainment). My current experience lies with Front-end Engineering, UI/UX Design and software development. My previous experience also include roles in Operations, Sales, and Customer Success.`;

export const experience: Experience[] = [
  {
    company: 'Nebusis Cloud Services',
    role: 'Director of Product & Technology',
    date: 'Nov 2020 - Jun 2024',
    location: 'Reston, VA / Madrid, Spain',
    description: 'Collaborated with CEO to define and execute product roadmap, resulting in a 12% increase in user engagement. Managed ISO AI projects and directed multi-location onboarding for global clients.'
  },
  // ... Add more experience items here from your resume.html
];

export const projects: Project[] = [
  {
    id: 'nebusis',
    title: 'Nebusis®',
    subtitle: 'SaaS ISO-based platform simplifying management systems.',
    description: 'A complete redesign of a compliance management platform serving enterprise clients. Recovered from a critical website failure by rebuilding the entire system in a compressed timeframe.',
    heroImage: '/assets/img/nebusis_photos/NEBUSIS Dribble Landing.png',
    images: [
      '/assets/img/nebusis_photos/mockups/nebusis_dashboard_mockup.png',
      '/assets/img/nebusis_photos/mockups/policy_managment_mockup.png',
    ],
    roles: ['Product Manager', 'UI/UX Design', 'Project Management'],
    tools: ['Figma', 'Adobe CC', 'Wordpress', 'Elementor'],
    date: 'Nov 2020 - Jun 2023',
    link: 'https://www.nebusis.com/',
    problem: 'Organizations struggled with outdated ISO management systems that required extensive manual work, created compliance gaps, and provided frustrating user experiences.',
    solution: 'Nebusis® transforms compliance management through intelligent automation, intuitive design, and real-time analytics. We made the complex simple and the tedious automated.'
  },
  // ... Add your other projects (Qurado, Naesor, BruVue) here
];

export const musicProjects: MusicProject[] = [
    {
        id: 'boxbomb',
        name: 'BoxBomb',
        years: '2003–2009',
        role: 'Bass Guitarist',
        description: 'This project gave me the foundational skills that transformed into a 10-year career. We released three albums and were signed to Tragic Hero Records.',
        image: '/assets/img/headers/studio-music.jpg', // Replace with a real image
        color: 'text-accent',
        notablePerformances: 'Thrice, Toadies, The Get Up Kids, American Aquarium, Killa Priest, He is Legend, MuteMath',
        spotifyEmbedUrl: 'https://open.spotify.com/embed/artist/1Bq0OrnNdaUsQU1UANmdJP?utm_source=generator&theme=0'
    },
    // ... Add your other music projects here
];