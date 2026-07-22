export type Project = {
  slug: string;
  index: string;
  title: string;
  eyebrow: string;
  summary: string;
  impact: string;
  description: string;
  stack: string[];
  signals: string[];
  github?: string;
  live?: string;
  accent: "cyan" | "amber" | "mint";
};

export const navigation = [
  { label: "Work", href: "/work" },
  { label: "About", href: "/about" },
  { label: "Writing", href: "/blog" },
  { label: "Contact", href: "/#contact" },
];

export const projects: Project[] = [
  {
    slug: "budgit-buddy",
    index: "01",
    title: "BudgitBuddy",
    eyebrow: "AI-native personal finance",
    summary: "A production finance platform with a guarded MCP interface for natural-language access to real financial data.",
    impact: "Three independently deployable services, one permission-aware system.",
    description: "I designed the web app, FastAPI service, and MCP server as separate deployable units. OAuth, scoped access, and explicit confirmation on every write operation keep AI assistance useful without surrendering control.",
    stack: ["Next.js", "FastAPI", "PostgreSQL", "MCP", "Plaid", "AWS"],
    signals: ["Human confirmation for AI writes", "OAuth 2.0 provider", "Live bank synchronization"],
    github: "https://github.com/Sosa-IQ/PFT",

    accent: "cyan",
  },
  {
    slug: "invoice-assistant",
    index: "02",
    title: "InvoiceAssistant",
    eyebrow: "Voice, retrieval, and documents",
    summary: "An AI invoicing workflow that turns natural speech and historical documents into structured, editable invoices.",
    impact: "Speech-to-text, retrieval, extraction, and PDF generation in one workflow.",
    description: "The system combines a FastAPI backend, speech transcription, semantic retrieval over prior invoices, resilient PDF extraction, and a responsive editing surface. The result is a practical AI feature chain—not a chatbot attached to a form.",
    stack: ["React", "FastAPI", "ChromaDB", "OpenAI", "Speechmatics", "SQLite"],
    signals: ["RAG over prior invoices", "Structured PDF extraction", "Local vector lifecycle management"],
    github: "https://github.com/Sosa-IQ/InvoiceAssistant",
    accent: "amber",
  },
  {
    slug: "psg-trades",
    index: "03",
    title: "PSGTrades",
    eyebrow: "Multi-account trading operations",
    summary: "A focused trading utility that routes one decision across multiple authenticated brokerage accounts.",
    impact: "Reduced a repetitive multi-account workflow from roughly 50 minutes to seconds.",
    description: "I built the Angular interface and AWS-backed order routing around the Tradier API, with Cognito authentication and token management. It demonstrates the same principle that guides my AI work: automate repetition while preserving explicit human intent.",
    stack: ["Angular", "TypeScript", "AWS Lambda", "API Gateway", "Cognito", "Tradier"],
    signals: ["Multi-account order fan-out", "Managed authentication", "AWS serverless order routing"],
    github: "https://github.com/Sosa-IQ/PSGTrades",

    accent: "mint",
  },
];

export const publicExperience = [
  {
    period: "2025 — now",
    role: "AI Engineer",
    organization: "Infosys",
    summary: "Designing agentic systems for enterprise workflows where perception, automation, and human review must work together reliably.",
    details: [
      "Built a computer-use testing system for a legacy desktop application using multimodal perception, OCR, and parallel execution.",
      "Created a human-approved remediation pipeline connecting issue intake, coding agents, pull requests, and closure tracking.",
      "Prototyped retrieval workflows with Python, LangChain, and vector search to turn support signals into development priorities.",
    ],
  },
  {
    period: "2024",
    role: "Python Flask Developer",
    organization: "University of Connecticut",
    summary: "Developed database-backed workflows and interfaces for a university research group.",
    details: [
      "Connected Flask services to MySQL and evolved schemas as research workflows changed.",
      "Built interfaces for profiles, activity records, projects, and collaboration data.",
    ],
  },
  {
    period: "2024",
    role: "InStep Technology Intern",
    organization: "Infosys",
    summary: "Built a full-stack application with a small engineering team using Spring Boot, Angular, and MySQL.",
    details: [
      "Designed REST endpoints, data models, and responsive application views.",
      "Collaborated across backend, frontend, and database responsibilities.",
    ],
  },
];

export const capabilities = [
  { label: "Agent systems", detail: "MCP, computer use, tool orchestration, human-in-the-loop controls" },
  { label: "Applied AI", detail: "RAG, multimodal models, OCR, speech, evaluation-minded workflows" },
  { label: "Product engineering", detail: "Python, Java, TypeScript, FastAPI, Spring Boot, React, Next.js" },
  { label: "Cloud & data", detail: "AWS, PostgreSQL, Supabase, Docker, APIs, authentication" },
];
