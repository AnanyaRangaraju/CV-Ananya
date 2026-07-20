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
      context: "+Two years+ in production, then Dartmouth to sharpen the thinking behind it.",
      reflections: ['I like building things that work.', "So that's what I build."],
      hookParagraphs: [
        ["I build AI products, and I genuinely love doing it."],
        [
          "Whatever I'm working on, I care about whether it actually holds up for the people using it.",
          "If you need someone who will sit with a *hard problem* and genuinely care about getting it right, that's me.",
        ],
      ],
      why: "I've shipped clinical systems at Oracle Health, built an AI evaluation platform from scratch, and designed data governance architecture for regulated industries. At Dartmouth, coursework in machine learning, business analytics, operations, and finance helped me think more clearly about the decisions behind the engineering.",
      seeking: [
        "I'm most excited about AI for work.",
        'The products and infrastructure that make AI something people can actually rely on.',
        "That's the work I want to be doing.",
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
      p2: "I've worked across the full",
      p2Highlight: 'AI delivery lifecycle',
      p2End: ', from building pipelines to sitting across the table from stakeholders who need to understand what we shipped and why. I like that combination, and I want to keep doing it.',
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
      intro: 'These are things I actually built, because I wanted to solve a real problem.',
      githubLink: 'github.com/AnanyaRangaraju',
      viewCode: 'View code',
      viewPrototype: 'View prototype',
      items: [
        {
          title: 'Clearance',
          badge: 'Autonomy Readiness Console',
          desc: "I built Clearance because I kept noticing the same gap: benchmark scores and real-world reliability are not the same thing, and teams were finding that out the hard way. It's an evaluation platform that tests whether LLM agents are ready for unsupervised operation, running real API calls with edge-case injection across GPT-4o, GPT-4o mini, Claude Sonnet 4.5, and Gemini 2.5 Flash. The largest gap I found between benchmark and production was 61 points. That number is what the platform is for.",
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
          desc: "While looking at Everpure's published case studies in healthcare and banking, I noticed there was no clean way to separate regulated data from data safe for AI use. So I designed the Trust Passport, a portable metadata record that existing systems can act on automatically, covering sensitivity, legal basis, retention, AI eligibility, and protection tier. I checked that it holds under both HIPAA and GDPR/DORA. This is the kind of problem I find genuinely interesting.",
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
          desc: "I built this to answer one question: does explaining AI usage in plain English, the way a budgeting app explains spending, change how people use these tools? The routing is deterministic, the caching is verified against real requests, and the dashboard is careful to separate actual savings from estimated ones. Getting that last part honest felt important.",
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
        desc: "Built observability and reliability into clinical AI agents running in production, across regulated healthcare data pipelines for federal clients.",
        skills: ['Observability', 'HL7/FHIR', 'ANSI X12', 'Federal Data (VA/DoD)', 'Debugging & Reliability'] as readonly string[],
      },
      keanyProduce: {
        company: 'Keany Produce and Gourmet',
        location: 'Landover, MD',
        role: 'Operations Intern',
        period: '2025',
        desc: "Applied predictive modeling and built a live dashboard for warehouse operations and fulfillment.",
        skills: ['Predictive Modeling', 'Operations Dashboarding', 'Warehouse Analytics'] as readonly string[],
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
      desc: "I'm excited about AI for work, and about finding a team that's building it seriously. If that's you, I'd love to talk.",
      contact: 'Contact',
      footnote: 'Everything is just one email away.',
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
