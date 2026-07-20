export type AboutLang = 'en'

export const aboutContent = {
  en: {
    slug: 'about',
    seo: {
      title: 'Ananya Rangaraju | AI Systems & Product Engineer',
      description: 'AI Systems & Product Engineer. Two years shipping clinical AI agent observability at Oracle Health (formerly Cerner). Builder of Clearance, an AI agent reliability benchmark. Dartmouth MEM graduate.',
    },
    heading: 'Ananya Rangaraju',
    manifesto: "I enjoy building things, and solving a genuinely hard problem is what motivates me most.",
    subtitle: 'AI Systems & Product Engineer · Ex-Oracle Health · Dartmouth MEM',
    location: 'Hanover, NH · Open to relocate',
    lastUpdated: 'July 2026',
    bio: [
      "I'm a software developer and AI builder. I spent two years shipping production AI at Oracle Health (formerly Cerner), and I've since built Clearance, my own AI agent evaluation platform, from the ground up.",
      "I've been to Dartmouth College, where I completed a Master of Engineering Management and learned the business and strategy side of building AI products, on top of a B.Tech in Computer Science & Engineering from Manipal University Jaipur (CGPA 3.9/4.0).",
      "I genuinely enjoy building things. There's a particular kind of satisfaction in taking a hard, messy problem and turning it into something that actually works, and that's what keeps me coming back. I want what I build to scale and to hold up for the people actually using it.",
      "I'm also someone who listens. If you're sitting with a hard problem of your own, or just want to talk shop, I'd love to hear about it, so feel free to reach out.",
    ],
    seeking: 'Open to roles in:',
    roles: ['AI Product Manager', 'AI GTM Engineer', 'Applied AI Product Engineer', 'Solutions Architect'],
    timelineHeading: 'Experience',
    timeline: [
      { period: '2024–2026', role: 'MEM Graduate', company: 'Dartmouth College', desc: 'Master of Engineering Management, machine learning, business analytics, operations' },
      { period: '2025', role: 'Operations Intern', company: 'Keany Produce and Gourmet', desc: 'Predictive modeling and operations dashboarding for warehouse fulfillment' },
      { period: '2022–2024', role: 'Software Developer', company: 'Oracle Health (formerly Cerner)', desc: 'Observability and reliability for clinical AI agents in production' },
    ],
    projectsHeading: 'Projects',
    projects: [
      { name: 'Clearance', desc: 'AI agent evaluation platform benchmarking GPT-4o, Claude Sonnet 4.5, and Gemini 2.5 Flash on real-world reliability', href: '/#projects' },
    ],
    certificationsHeading: 'Certifications',
    certifications: [] as { org: string; items: string[] }[],
    educationHeading: 'Education',
    education: [
      'Dartmouth College, Master of Engineering Management (2024–2026)',
      'Manipal University Jaipur, B.Tech, Computer Science & Engineering, CGPA 3.9/4.0 (2018–2022)',
    ],
    pressHeading: 'Press',
    press: [] as { title: string; publisher: string; date: string; href: string }[],
    communityHeading: 'Community',
    community: [] as { title: string; platform: string; href: string }[],
    faqHeading: 'Frequently Asked Questions',
    faq: [
      { q: 'Who is Ananya Rangaraju?', a: 'Ananya Rangaraju is a software developer and AI systems engineer who completed a Master of Engineering Management at Dartmouth College. She spent two years as a Software Developer at Oracle Health (formerly Cerner), where she owned observability for clinical AI agents deployed across 100+ client sites and 1M+ monthly interactions. She holds a B.Tech in Computer Science & Engineering from Manipal University Jaipur (CGPA 3.9/4.0).' },
      { q: 'What has Ananya built?', a: 'Ananya built Clearance, an AI agent evaluation platform that benchmarks LLMs including GPT-4o, GPT-4o mini, Claude Sonnet 4.5, and Gemini 2.5 Flash across simulated business workflows, separating benchmark accuracy from real-world deployment reliability. At Oracle Health, she built structured validation frameworks that caught 5-7% of data quality failures before they reached the model layer, cutting downstream prediction inconsistencies by 25%.' },
      { q: 'What does Ananya work on now?', a: 'Ananya completed her Master of Engineering Management at Dartmouth College (2024-2026), focused on machine learning, business analytics, and operations. She continues building Clearance and is open to full-time roles in applied AI, product management, and solutions architecture.' },
    ],
    connectHeading: 'Connect',
    email: 'ananya.rangaraju@gmail.com',
  },
} as const
