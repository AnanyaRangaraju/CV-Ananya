export const seo = {
  en: {
    title:
      'Ananya Rangaraju | AI Systems & Product Engineer',
    description:
      'AI Systems & Product Engineer. 2+ years shipping clinical AI agent observability at Oracle Health (formerly Cerner). Builder of Clearance, an AI agent reliability benchmark. Dartmouth MEM graduate.',
  },
};

export const translations = {
  en: {
    greeting: 'who ships AI at scale',
    greetingRoles: ['AI Systems & Product Engineer'],
    pillLabels: ['Builder', 'AI Systems & Product Engineer'],
    email: 'ananya.rangaraju@gmail.com',
    role: '',
    story: {
      context: "+Two years+ shipping AI in production, then a Dartmouth MEM to sharpen the strategy behind it.",
      reflections: ['I like building things that work.', "So that's what I build."],
      hookParagraphs: [
        ["I build AI products. I've shipped systems into production and built my own AI evaluation platform from scratch."],
        [
          "I'm also someone who genuinely listens.",
          'If you need someone to sit with a *hard problem* and actually care about getting it right, that\'s me.',
        ],
      ],
      why: 'Before Dartmouth, I spent two years at Oracle Health shipping production AI for clinical systems.',
      seeking: [
        'What motivates me is building things that scale globally and solve real problems.',
        'I want what I build to hold up once real people are using it.',
        "That's still the work I want to be doing.",
      ],
      nav: [
        { icon: 'briefcase', label: 'My path', href: '#experience' },
        { icon: 'folder', label: 'What I build', href: '#projects' },
        { icon: 'mail', label: "Let's talk", href: '#contact' },
        { icon: 'bot', label: 'Ask me', href: '#chat', highlight: true },
      ],
      skills: [
        'Agentic Workflows',
        'LLM Observability',
        'RAG Architecture',
        'Full-Stack Delivery',
        'Data & Analytics',
        'Stakeholder Ownership',
      ],
      skipButton: 'Skip intro',
    },
    taglines: [] as readonly string[],
    summary: {
      title: 'Professional Summary',
      p1: 'Software developer and product-minded builder focused on',
      p1Highlight: 'applied AI and LLM systems',
      p1End:
        "in production. After two years shipping clinical AI agents at Oracle Health (formerly Cerner), I completed Dartmouth's Engineering Management program, deepening the product and strategy side of that work.",
      p2: 'End-to-end ownership across',
      p2Highlight: 'observability → evaluation → delivery → adoption',
      p2End: ', collaborating closely with engineering, product, and non-technical stakeholders.',
      cards: [
        {
          title: 'Builder Mindset',
          desc: 'Ships fast, instruments everything, iterates from real production signal',
        },
        {
          title: 'Strengths',
          desc: 'Translating LLM agent behavior into product decisions for non-technical stakeholders',
        },
        {
          title: 'Technical Fluency',
          desc: 'LLM / agent workflows, RAG pipelines, full-stack delivery, and data infrastructure',
        },
      ],
    },
    coreCompetencies: {
      title: 'Core Competencies',
      items: [
        {
          title: 'Stakeholder & Delivery',
          desc: 'Customer-facing technical communication, cross-functional implementation ownership, UAT, SLA monitoring',
        },
        {
          title: 'LLMs & Agentic Systems',
          desc: 'Agentic workflow design, LLM prompt engineering, tool-calling integrations, agent observability & debugging',
        },
        {
          title: 'RAG & Model Evaluation',
          desc: 'RAG pipeline architecture, multi-model benchmarking, reliability scoring',
        },
        {
          title: 'Full-Stack Development',
          desc: 'Next.js, FastAPI, TypeScript, Python, REST APIs, PostgreSQL',
        },
        {
          title: 'Data & Cloud Infrastructure',
          desc: 'SQL (CTEs, window functions), Pandas / NumPy / scikit-learn, AWS (Athena, Redshift, Glue, Lambda), Snowflake',
        },
        {
          title: 'Reporting & Analytics',
          desc: 'Power BI, Tableau, JIRA, rapid prototyping',
        },
      ],
    },
    techStack: {
      title: 'Tech Stack',
      categories: [
        {
          name: 'AI / LLM',
          items: [
            'Agentic Workflows',
            'Prompt Engineering',
            'RAG Pipelines',
            'Tool-Calling Integrations',
            'Multi-Model Benchmarking',
          ],
        },
        {
          name: 'Full-Stack',
          items: ['Next.js', 'FastAPI', 'TypeScript', 'Python', 'REST APIs', 'PostgreSQL'],
        },
        {
          name: 'Data & ML',
          items: ['SQL', 'Pandas', 'NumPy', 'scikit-learn'],
        },
        {
          name: 'Cloud & Infra',
          items: ['AWS', 'Snowflake', 'Git', 'Kubernetes'],
        },
        { name: 'Delivery', items: ['Power BI', 'Tableau', 'JIRA', 'UAT', 'SLA Monitoring'] },
        { name: 'LLMOps', items: ['Observability', 'Evals', 'Langfuse'] },
      ],
    },
    projects: {
      title: 'Projects',
      githubLink: 'github.com/AnanyaRangaraju',
      viewCode: 'View code',
      viewPrototype: 'View prototype',
      items: [
        {
          title: 'Clearance',
          badge: 'Autonomy Readiness Console',
          desc: 'AI agent evaluation platform that certifies whether LLM agents are reliable enough for unsupervised operation, benchmarking GPT-4o, GPT-4o mini, Claude Sonnet 4.5, and Gemini 2.5 Flash across simulated business workflows.',
          tech: ['Next.js', 'FastAPI', 'TypeScript', 'Python'],
          highlights: [
            'Live evaluation pipeline making real per-trial LLM API calls with randomized edge-case injection, tracking per-trial latency and cost for cost-vs-reliability tradeoff analysis.',
            'Scoring system separating benchmark accuracy from real-world reliability, surfacing gaps as large as 61 points between the two.',
            'Automatic Cleared / Supervised / Not-Ready classification with configurable thresholds, tracking unsafe or irreversible actions as a distinct failure category.',
            'Full reporting layer with dashboards, leaderboards, and expected-vs-actual failure breakdowns to make results auditable.',
          ],
          link: 'https://ananyarangaraju.com/clearance',
          linkLabel: 'View live app',
        },
        {
          title: 'Everpure Trust Passport',
          badge: 'Technical Architecture Proposal',
          desc: "Self-directed architecture proposal extending Everpure's Data Intelligence platform with a portable data-governance layer, gating AI and RAG access by sensitivity, legal basis, and consent. Modeled across two real regulatory regimes using Everpure's own public customer case studies.",
          tech: ['HIPAA', 'GDPR', 'DORA', 'Data Governance'],
          highlights: [
            "Identified a real gap in Everpure's published healthcare and banking case studies: no automated way to separate regulated data from data safe for AI use.",
            'Designed the Trust Passport, a portable metadata record (sensitivity score, legal basis, retention, AI-eligibility, protection tier, carbon budget) that five existing Everpure systems can act on automatically.',
            'Proved the same architecture holds under both a US sectoral law (HIPAA) and an EU rights-based law (GDPR/DORA), evidence the pattern generalizes to any regulated industry.',
            'Benchmarked against named DSPM competitors (BigID, Varonis, Cyera, Securiti) to show none pair classification with the physical storage layer the way this design does.',
          ],
          link: '/everpure-trust-passport.pdf',
          linkLabel: 'View the deck',
        },
        {
          title: 'Personal AI Router',
          badge: 'AI Usage Explainability Layer',
          desc: 'Self-hosted LiteLLM proxy that routes personal AI API usage to the cheapest model tier that fits the task, explains every routing decision in plain English, and separates real metered savings from estimated flat-subscription opportunity on a personal dashboard.',
          tech: ['Python', 'TypeScript', 'LiteLLM', 'Redis'],
          highlights: [
            'Deterministic keyword/regex classifier decides routing with no LLM call spent on the decision itself, then routes to the cheapest model tier that fits the task.',
            'Exact-match and semantic caching (Redis Stack, similarity-tuned) verified end-to-end against real requests, confirmed via matching completion IDs on repeated queries.',
            'Full-stack dashboard (Express, Drizzle, React) clearly separates real dollars saved from estimated opportunity on flat-subscription tools, never conflating the two.',
            "Built to test one question: does seeing AI usage explained in plain English, the way a budgeting app explains spending, actually change how people use these tools.",
          ],
          link: 'https://github.com/AnanyaRangaraju/personal-ai-router',
          linkLabel: 'View on GitHub',
        },
      ] as {
        title: string
        badge: string
        desc: string
        tech: readonly string[]
        highlights: readonly string[]
        link: string
        linkLabel: string
      }[],
    },
    experience: {
      title: 'Work Experience',
      oracleHealth: {
        company: 'Oracle Health (formerly Cerner)',
        location: 'Bangalore, India',
        role: 'Software Developer',
        period: '2022 - 2024',
        desc: "Two years here taught me how to keep AI systems honest in production: observability, debugging distributed agents, and building the reliability layer clinical teams could actually trust.",
        highlights: [] as readonly string[],
      },
      keanyProduce: {
        company: 'Keany Produce and Gourmet',
        location: 'Landover, MD',
        role: 'Operations Intern',
        period: '2025',
        desc: "Here I got hands-on with predictive modeling and operations dashboarding, turning warehouse data into decisions the people on the floor could actually use.",
        highlights: [] as readonly string[],
      },
      note: "Want the full story, or my latest resume? Happy to share, just send me an email. I'm always up for working through a hard problem, whatever it is.",
    },
    education: {
      title: 'Education',
      items: [
        {
          year: '2024 - 2026',
          org: 'Dartmouth College',
          title: 'Master of Engineering Management',
          desc: 'Machine learning, business analytics, operations, strategy, finance.',
        },
        {
          year: '2018 - 2022',
          org: 'Manipal University Jaipur',
          title: 'B.Tech, Computer Science & Engineering',
          desc: 'CGPA 3.9 / 4.0. Data structures & algorithms, database management, statistical analysis, computer networks.',
        },
      ] as {
        year: string
        org: string
        title: string
        desc: string
        projectLink?: string
        projectLabel?: string
        testimonial?: { quote: string; author: string; role: string; photo: string; linkedin: string }
      }[],
    },
    certifications: {
      title: 'Certifications',
      items: [] as { year: string; title: string; org: string; logo: string; url: string }[],
    },
    skills: {
      title: 'Skills',
      technical: 'Technical Skills',
      soft: 'Soft Skills',
      softSkills: [
        'Customer-Facing Communication',
        'Cross-Functional Ownership',
        'Stakeholder Management',
        'UAT & SLA Monitoring',
        'Rapid Prototyping',
        'Systems Thinking',
      ],
    },
    cta: {
      title: "Let's talk",
      desc: "I like building AI products, things that scale and solve real problems. If you're working on something hard and want someone who'll actually listen and dig in, let's talk.",
      contact: 'Contact',
      footnote: "Want my latest resume, or something built? It's all just one email away.",
    },
    ui: {
      typingIndicator: 'Ananya is typing...',
    },
    chat: {
      placeholder: 'Type your question...',
      title: 'Ananya',
      subtitle: 'Ask me about my experience',
      greeting:
        "Hi! I'm **Ananya's AI**. Ask me anything: experience, projects, what drives me. Quick note: each message here costs real API credits, so make yours count! For a deeper conversation, my resume, or a call, email or LinkedIn works even better.",
      error: 'Error sending. Please try again.',
      offline: 'Looks like you\'re offline. Check your connection and try again.',
      prompts: [
        {
          icon: 'briefcase',
          label: 'AI Experience',
          query: "What is Ananya's experience with AI and automation?",
        },
        {
          icon: 'rocket',
          label: 'Top Projects',
          query: "What are Ananya's most notable projects?",
        },
        {
          icon: 'help',
          label: 'Why hire her?',
          query: 'Why should I hire Ananya?',
        },
        {
          icon: 'mail',
          label: 'Contact',
          query: 'How can I contact Ananya?',
        },
      ],
      contactCtaTitle: 'Want to talk directly?',
      voice: {
        start: 'Talk to Ananya',
        stop: 'End',
        connecting: 'Connecting...',
        listening: 'Listening...',
        thinking: 'Thinking...',
        searching: 'Searching my projects...',
        speaking: 'Speaking...',
        timeWarning: '15 seconds remaining',
        ended: 'Voice session ended',
        rateLimited: 'You have reached the limit of 3 voice sessions per day',
        unsupported: 'Your browser does not support audio input',
        micDenied: 'Microphone access is needed for voice mode',
        switchToText: 'Switch to text',
        connection: 'Connection error. Please try again.',
      },
    },
  },
} as const;

export type Lang = 'en';
