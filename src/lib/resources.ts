export type ResourceCategory =
  | "employment"
  | "finance"
  | "healthcare"
  | "indigenous"
  | "transportation"
  | "other";

export interface Resource {
  slug: string;
  title: string;
  category: ResourceCategory;
  description: string;
  creatorName: string;
  creatorRole: string;
  whatYoullLearn: string[];
  thumbnail?: string;
  youtubeId?: string;
  order: number;
}

export const resources: Resource[] = [
  {
    slug: "how-to-write-a-resume",
    title: "How to Write a Resume for Canadian Jobs?",
    category: "employment",
    description:
      "Learn the structure of a Canadian resume (highlights, experience, etc.) to land your first job in Canada.",
    creatorName: "Matthias Chun",
    creatorRole: "Career Coach",
    whatYoullLearn: [
      "What Is A Resume?",
      "Structure Of A Resume",
      "Header",
      "Highlights",
      "Education",
      "Experience",
      "Interests",
    ],
    thumbnail: "/assets/images/resources/resume.png",
    youtubeId: "hCOEbRQ6vUI",
    order: 1,
  },
  {
    slug: "how-to-write-a-cover-letter",
    title: "How to Write a Cover Letter for Canadian Jobs?",
    category: "employment",
    description:
      "Learn the structure of a Canadian cover letter and get real samples to help you stand out for jobs in Canada.",
    creatorName: "Talya Eryilmaz",
    creatorRole: "Career Advisor",
    whatYoullLearn: [
      "What Is A Cover Letter?",
      "Structure Of A Cover Letter",
      "How To Write A Cover Letter",
      "Cover Letter Samples",
    ],
    thumbnail: "/assets/images/resources/cover-letter.png",
    youtubeId: "ncjKS6cqogo",
    order: 2,
  },
  {
    slug: "how-to-prepare-for-a-job-interview",
    title: "How to Prepare for a Job Interview in Canada?",
    category: "employment",
    description:
      "Learn what to expect in a Canadian job interview, how to answer common interview questions, what questions to ask employers, and get sample answers to get hired in Canada.",
    creatorName: "Rachel Oh",
    creatorRole: "Recruitment Specialist",
    whatYoullLearn: [
      "What To Expect In An Interview?",
      "Common Interview Questions + How To Prepare For Them",
      "What Questions Can You Ask To Stand Out In An Interview?",
      "Sample Interview Answers",
    ],
    thumbnail: "/assets/images/resources/interview.png",
    youtubeId: "dFNAFOd67QY",
    order: 3,
  },
  {
    slug: "how-to-budget-your-money",
    title: "How to Budget Your Money in Canada?",
    category: "finance",
    description:
      "Learn how to manage your income and expenses, set financial goals, and explore budgeting methods, savings, interest, and debt management to take control of your finances in Canada.",
    creatorName: "Matthias Chun",
    creatorRole: "Financial Educator",
    whatYoullLearn: [
      "What Is Budgeting and How Does It Help?",
      "Income, Expenses, and Goal Setting",
      "What Is The Smart Framework?",
      "Budgeting Methods and Categories",
      "Savings, Interest, and Debt",
    ],
    thumbnail: "/assets/images/resources/budgeting-basics.png",
    youtubeId: "wP0KwjVE0BM",
    order: 1,
  },
  {
    slug: "how-does-healthcare-work-in-bc",
    title: "How Does Healthcare Work in British Columbia (BC)?",
    category: "healthcare",
    description:
      "Learn how British Columbia's healthcare system works, what MSP is and how to apply, how to find doctors and clinics, and access mental health support and prescriptions in BC.",
    creatorName: "Talya Eryilmaz",
    creatorRole: "Settlement Advisor",
    whatYoullLearn: [
      "How the Healthcare System Works in British Columbia (BC)?",
      "What Is MSP and Who Is Eligible For It?",
      "How To Apply For MSP?",
      "Doctors, Clinics, and Urgent Care",
      "Walk-In Clinic vs Emergency Room",
      "Prescriptions and Pharmacies",
      "Mental Health Support in BC",
    ],
    thumbnail: "/assets/images/resources/healthcare.png",
    youtubeId: "WpSvYMEqEW4",
    order: 1,
  },
  {
    slug: "how-does-public-transit-work-in-metro-vancouver",
    title: "How Does Public Transit Work in Metro Vancouver",
    category: "transportation",
    description:
      "Learn what TransLink is, the types of public transit services available, how to pay your fare, plan your trips, and get tips on riding public transport safely in Metro Vancouver.",
    creatorName: "Alonso Yang",
    creatorRole: "Community Guide",
    whatYoullLearn: [
      "What is TransLink?",
      "Types of Transit Services in Metro Vancouver",
      "Paying Your Fare & Zones",
      "How To Plan A Trip in Metro Vancouver?",
      "Transit Etiquette & Safety",
      "Tips on Riding Public Transport in Metro Vancouver",
    ],
    thumbnail: "/assets/images/resources/public-transit.png",
    order: 1,
  },
];

export function getResourceBySlug(slug: string): Resource | undefined {
  return resources.find((r) => r.slug === slug);
}

export const categoryLabels: Record<ResourceCategory, string> = {
  employment: "Employment",
  finance: "Finance",
  healthcare: "Healthcare",
  indigenous: "Indigenous",
  transportation: "Transportation",
  other: "Other",
};
