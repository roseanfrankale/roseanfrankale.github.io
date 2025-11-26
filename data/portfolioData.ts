
import { ProjectData, ExperienceItem, MusicProject } from '../types';

export const projects: ProjectData[] = [
  {
    id: 'nebusis',
    title: 'Nebusis®',
    subtitle: 'AI ISO Technologies to Minimize Operational Risk',
    description: 'Nebusis® is a simplified Software as a Service (SaaS) solution based on recognized ISO Management system standards. I led the website redesign, branding, and operations management.',
    roles: ['Product Manager', 'UI/UX Design', 'Project Management', 'Operations'],
    tools: ['Adobe Creative Cloud', 'Figma', 'Elementor', 'Wordpress', 'GSuite'],
    heroImage: 'https://roseanfrankale.github.io/assets/img/nebusis_photos/NEBUSIS%20Dribble%20Landing.png',
    link: 'https://www.nebusis.com',
    client: 'Nebusis Cloud Services LLC',
    date: 'Nov 2020 - June 2023',
    
    // Rich Case Study Content
    overview: 'Nebusis® is an AI-powered SaaS platform designed to revolutionize how organizations manage ISO compliance. Traditional compliance management was plagued by manual processes, fragmented systems, and poor user experiences that made simple tasks unnecessarily complex. My role encompassed product management, UI/UX design, and project management, guiding the platform from concept through launch.',
    problem: 'Organizations struggled with outdated ISO management systems that required extensive manual work, created compliance gaps, and provided frustrating user experiences. Teams spent more time fighting the system than improving actual compliance.',
    solution: 'We transformed compliance management through intelligent automation, intuitive design, and real-time analytics. We made the complex simple and the tedious automated by implementing AI-powered policy generation, real-time dashboards, and a mobile-first responsive design.',
    process: [
      {
        title: 'Initial Assessment & Wireframing',
        description: 'I applied Google UX principles to restructure the information architecture, creating mobile-first wireframes that prioritized user task flows. The focus was on simplifying complex workflows and ensuring responsive design patterns.',
        image: 'https://roseanfrankale.github.io/assets/img/nebusis_photos/final_landing/neb_old_frame_2.png'
      },
      {
        title: 'Crisis Management & Pivot',
        description: 'During critical client onboarding, the website crashed with no backup. This crisis became a catalyst. Using saved Figma assets, I rapidly rebuilt the entire system, implementing a more robust design system and establishing better version control processes.',
        image: 'https://roseanfrankale.github.io/assets/img/nebusis_photos/final_landing/neb_old_2_frame_1.png'
      },
      {
        title: 'Design System & Launch',
        description: 'I developed a comprehensive design system including custom vectors, consistent typography, and component libraries. We successfully launched 4 distinct landing pages with integrated AI policy generation.',
        image: 'https://roseanfrankale.github.io/assets/img/nebusis_photos/mockups/DarkMockup_Nebusis.png'
      }
    ],
    results: [
      { metric: '12%', label: 'Increase in User Engagement' },
      { metric: '100%', label: 'Mobile Responsive' },
      { metric: '4', label: 'Landing Pages Launched' },
      { metric: '50+', label: 'Custom Assets Created' }
    ],
    keyLearnings: [
      'The crisis taught me the critical importance of maintaining multiple backups and robust version control.',
      'Starting with mobile constraints leads to cleaner, more focused designs that scale beautifully to desktop.',
      'Complex B2B systems require even more attention to user experience than consumer products.'
    ],
    images: [
      'https://roseanfrankale.github.io/assets/img/nebusis_photos/mockups/neb_policy_top_mockup.png',
      'https://roseanfrankale.github.io/assets/img/nebusis_photos/mockups/neb_risk_top_mockup.png',
      'https://roseanfrankale.github.io/assets/img/nebusis_photos/ai%20web%20images/mockups/iPhone%2012%20Pro%20Landing%20Dashboard.png',
      'https://roseanfrankale.github.io/assets/img/nebusis_photos/mockups/nebusis_dashboard_mockup.png'
    ]
  },
  {
    id: 'naesor',
    title: 'NAESOR',
    subtitle: 'Album Application Concept',
    description: 'Google UI/UX Design Course Challenge. Designed an app for users interested in purchasing or saving an artist\'s album before release.',
    roles: ['UI/UX Researcher', 'UI/UX Design', 'Prototyping'],
    tools: ['Figma'],
    heroImage: 'https://roseanfrankale.github.io/assets/img/naesor/NAESOR%20Dribble%20Landing%20Page_2.png',
    date: 'May 2022 - June 2022',
    problem: 'Existing music apps often suffer from cluttered interfaces, complex navigation, and a lack of personalized discovery, leading to user frustration and missed opportunities for artists.',
    solution: 'Naesor was conceived as a clean, user-centric album app focusing on seamless navigation, personalized content, and an engaging visual experience, making music discovery a joy.',
    images: [
        'https://roseanfrankale.github.io/assets/img/naesor/Case%20Study%20Mockups/iPhone%2011%20Pro%20Library.png',
        'https://roseanfrankale.github.io/assets/img/naesor/Case%20Study%20Mockups/iPhone%2011%20Pro%20Order%20Confirmation%20Mockup.png',
        'https://roseanfrankale.github.io/assets/img/naesor/Case%20Study%20Mockups/iPhone%2011%20Pro%20Splash%20Landing%20Mockup.png'
    ]
  },
  {
    id: 'qurado',
    title: 'Qurado',
    subtitle: 'E-commerce Platform',
    description: 'Consulting project to improve website traffic and engagement through UI/UX enhancements.',
    roles: ['UI/UX Consultant', 'Design'],
    tools: ['Figma', 'Adobe XD', 'Notion'],
    heroImage: 'https://roseanfrankale.github.io/assets/img/qurado/Qurado_Dribble_Landing.png',
    link: 'https://qurado.es',
    date: 'Oct 2022 - Nov 2022',
    problem: 'The original platform suffered from low conversion rates due to a confusing checkout process and a lack of mobile optimization.',
    solution: 'We implemented a streamlined checkout flow, modernized the branding to reflect the premium quality of the products, and fully optimized the site for mobile commerce.',
    images: [
        'https://roseanfrankale.github.io/assets/img/qurado/Documentation/web_intro_mockup_1.png',
        'https://roseanfrankale.github.io/assets/img/qurado/Documentation/discover_ipad.png',
        'https://roseanfrankale.github.io/assets/img/qurado/Documentation/prototype_1.png'
    ]
  },
  {
    id: 'bruvue',
    title: 'BruVue',
    subtitle: 'IoT Data Inventory System',
    description: 'Real-time beverage inventory data for bars, distributors and breweries. I worked on marketing collateral and customer success strategies.',
    roles: ['Director of Customer Success', 'Marketing Design'],
    tools: ['GSuite', 'Hubspot', 'Canva', 'Adobe CC'],
    heroImage: 'https://roseanfrankale.github.io/assets/img/bruvue_photos/BruVue_Line_of_Sensors_Tap_G1.png',
    date: 'Jan 2019 - July 2019',
    overview: 'BruVue offered Internet-connected sensors that were dropped on beer faucets and tracked the movement of beer in real-time, enabling breweries to see product inventory and prevented the theft or wastage of beer.',
    images: [
        'https://roseanfrankale.github.io/assets/img/bruvue_photos/BruVue_Logo.png',
        'https://roseanfrankale.github.io/assets/img/bruvue_photos/bruvue_dashboard_sensor.png',
        'https://roseanfrankale.github.io/assets/img/bruvue_photos/BruVue_Restuarants_&_Bars.png'
    ]
  }
];

export const musicProjects: MusicProject[] = [
  {
    id: 'lila',
    name: 'LiLa',
    role: 'Bass Guitarist',
    years: '2011-2016',
    description: 'LiLa\'s sound can be described as "Hip-Folk". The band\'s diverse musical backgrounds mixed rap, folk, rock and even dubstep. We garnered local attention and support from our community, leading to dynamic and energetic performances.',
    notablePerformances: 'Girl Talk, Who\'s Bad',
    image: 'https://roseanfrankale.github.io/assets/img/lila_photos/LILACOMICCOVER.jpeg',
    spotifyEmbedUrl: 'https://open.spotify.com/embed/artist/4Tqbi88O2bCIcBU9WyKmlz?utm_source=generator&theme=0',
    color: 'text-purple-400'
  },
  {
    id: 'toon',
    name: 'Toon & The Real Laww',
    role: 'Bass Guitarist',
    years: '2013-2015',
    description: 'A Hip-Hop duo backed by a live band. We performed at various venues in the Triangle area, mixing conscious rap with boom-bap beats.',
    notablePerformances: 'Run the Jewels, 2 Live Crew, Meek Mill, Machine Gun Kelly, GZA, Gym Class Heroes, Big Sean',
    image: 'https://roseanfrankale.github.io/assets/img/toon_laww_photos/toon_laww_full_band.jpg',
    spotifyEmbedUrl: 'https://open.spotify.com/embed/album/1hui6go1rSgNZKRg9M6X1W?utm_source=generator',
    color: 'text-yellow-400'
  },
  {
    id: 'boxbomb',
    name: 'Boxbomb',
    role: 'Bass Guitarist',
    years: '2003-2009',
    description: 'To complete Boxbomb\'s lineup, I took a hiatus from college to pursue a career as a bass guitarist. We released three albums and signed to Tragic Hero Records. This experience gave me foundational skills that transformed into a 10-year career.',
    notablePerformances: 'Thrice, Toadies, The Get Up Kids, Underoath, Paramore',
    image: 'https://roseanfrankale.github.io/assets/img/headers/header-split-youtube-background.jpg',
    spotifyEmbedUrl: 'https://open.spotify.com/embed/artist/1Bq0OrnNdaUsQU1UANmdJP?utm_source=generator&theme=0',
    color: 'text-red-500'
  },
  {
    id: 'erik',
    name: 'Erik Smallwood',
    role: 'Session • Touring',
    years: '2006-2009',
    description: 'Erik is an Alabama-born Singer-Songwriter. I played with his cover band and recorded bass tracks for his albums.',
    image: 'https://roseanfrankale.github.io/assets/img/headers/studio-music.jpg',
    spotifyEmbedUrl: 'https://open.spotify.com/embed/artist/2PbLtUwd6StVpuvXIPluUm?utm_source=generator',
    color: 'text-blue-400'
  },
  {
    id: 'lions',
    name: 'Lions at Lunchtime',
    role: 'Bass Guitarist',
    years: '2010-2011',
    description: 'Spent a year working with them on several songs to complete their EP. This project was more of a hobby and a relaxed, creative experience.',
    image: 'https://roseanfrankale.github.io/assets/img/lions_at_lunchtime/lions_1.jpg',
    color: 'text-green-400'
  }
];

export const experience: ExperienceItem[] = [
  {
    company: 'Nebusis Cloud Services',
    role: 'Product & Project Manager',
    date: 'Nov 2020 - Present',
    location: 'Durham, NC / Madrid, Spain',
    description: 'Recurring Contract assisting CEO with projects of varying degrees. Focused on product lifecycle, operations, and AI integration.'
  },
  {
    company: 'NewSoil, LLC.',
    role: 'Technology Consultant',
    date: 'Aug 2019 - Jun 2020',
    location: 'Durham, NC',
    description: 'Founder and Co-Owner of an SMB to increase internet presence and sales. Implemented e-commerce solutions.'
  },
  {
    company: 'CureMint',
    role: 'Director of Customer Success',
    date: 'Jul 2019 - Aug 2019',
    location: 'Durham, NC',
    description: 'Collaborated with CEO on features, training sessions, and documentation for dental procurement software during MVP stage.'
  },
  {
    company: 'BruVue',
    role: 'Director of Customer Success',
    date: 'Jan 2019 - Jul 2019',
    location: 'Raleigh, NC',
    description: 'IoT sector experience. Managed customer retention, onboarding processes, and assisted with product feedback loops.'
  },
  {
    company: 'Marca Global, LLC.',
    role: 'Inside Sales Rep',
    date: 'Oct 2017 - Mar 2018',
    location: 'Denver, CO',
    description: 'Managed sales for InternetReputation.com products, focusing on SEO rankings.'
  },
  {
    company: 'Spreedly',
    role: 'Project/Customer Success Manager',
    date: '2016-2017',
    location: 'Durham, NC',
    description: 'FinTech startup experience. Gained perspective on SDLC and SRE practices while managing customer implementations.'
  },
  {
    company: 'Etix',
    role: 'Technical Operations',
    date: '2014 - 2016',
    location: 'Morrisville, NC',
    description: 'Responsible for equipment logistics, software cloning, and beta testing applications for large-scale events.'
  },
  {
    company: 'Flow Volkswagen',
    role: 'Parts Sales & Delivery',
    date: '2012 - 2013',
    location: 'Durham, NC',
    description: 'Managed supply chains and logistics for automotive parts using ETKA system.'
  },
  {
    company: 'The Federal',
    role: 'Expo/Host',
    date: '2011 - 2012',
    location: 'Durham, NC',
    description: 'Managed operations within a high-volume restaurant environment.'
  },
  {
    company: 'Guitar Center',
    role: 'Assistant Manager',
    date: '2007 - 2011',
    location: 'Durham, NC',
    description: 'Won regional sales awards while managing customer relationships and negotiations.'
  },
  {
    company: 'EspressOasis',
    role: 'Asst. & Catering Manager',
    date: '2003 - 2007',
    location: 'Durham, NC',
    description: 'Managed operations at Duke University location.'
  },
  {
    company: 'AIG-Valic',
    role: 'Intern',
    date: 'May-Aug 2002',
    location: 'Durham, NC',
    description: 'Gained experience in finance, investments, and cloud technology.'
  }
];

export const bioText = `👋 Hey there, I'm Rosean Frank-Alexander.
I'm a Product Thinker and Designer dedicated to building intuitive, elegant digital experiences. My journey into tech started with a classic: a childhood discovery on a Compaq Presario (and yes, Weezer was involved). That moment sparked an enduring passion for software, design, and music—the three pillars of my professional approach.

💡 What I Do
I sit at the intersection of UI/UX Design, Front-end Engineering, and Brand Strategy.

My focus is crafting scalable digital products by ensuring the user's experience is seamless and the underlying code is robust. I leverage diverse industry experience—from PCI-DSS Compliance and E-Commerce logistics to Music & Entertainment—to build solutions that solve real business problems, not just aesthetic ones.

🎸 The Edge I Bring
With over a decade as a professional bass guitarist and deep knowledge in audio/visual production, I approach every project with a musician's discipline: finding the rhythm, establishing the structure, and ensuring every component plays together perfectly. I bring creativity, technical precision, and a unique perspective to every team.`;
