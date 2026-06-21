// TEER (Training, Education, Experience and Responsibilities) cluster data.
// Powers the /teer hub + /teer/[tier] pages. Facts are from NOC 2021 (Statistics
// Canada / ESDC) and IRCC Express Entry rules. Every example NOC code is verified
// by the NOC 2021 rule that the 2nd digit of the 5-digit code IS the TEER tier
// (e.g. 65200 -> 2nd digit 5 -> TEER 5). Keep that invariant when editing.

export const NOC_FINDER_URL =
  "https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/eligibility/find-national-occupation-code.html";

// IRCC is consolidating FSW/CEC/FST into one Federal High-Skilled stream (announced
// for 2026, timeline under consultation). TEER 0-3 remain the high-skilled basis.
export const EE_2026_NOTE =
  "In 2026 the Federal Skilled Worker, Canadian Experience Class, and Federal Skilled Trades programs are being merged into a single Federal High-Skilled pathway. TEER 0-3 remain the eligible, high-skilled basis for it.";

export interface TeerOccupation {
  noc: string;
  title: string;
}

export interface TeerFaq {
  q: string;
  a: string;
}

export interface TeerTier {
  tier: 0 | 1 | 2 | 3 | 4 | 5;
  slug: string;
  /** SERP <title>, kept under 60 chars. */
  seoTitle: string;
  /** Meta description, 140-160 chars. */
  seoDescription: string;
  h1: string;
  /** Answer-first 40-60 word lead block (AEO-extractable). */
  lead: string;
  skillLevel: "High-skilled" | "Lower-skilled";
  expressEntryEligible: boolean;
  /** One-line eligibility verdict for the comparison table. */
  eeVerdict: string;
  requirements: string;
  prPathways: string;
  /** Short editorial, newcomer-focused guidance (the proprietary value). */
  newcomerGuidance: string;
  occupations: TeerOccupation[];
  /** Optional related Unify blog slug to cross-link (avoids cannibalization). */
  relatedPost?: { slug: string; label: string };
  faqs: TeerFaq[];
}

export const TEER_TIERS: TeerTier[] = [
  {
    tier: 0,
    slug: "teer-0",
    seoTitle: "TEER 0 Jobs in Canada: Management & PR Eligibility",
    seoDescription:
      "TEER 0 covers management jobs in Canada and is high-skilled and Express Entry eligible. See example TEER 0 occupations, NOC codes, and PR pathways.",
    h1: "TEER 0 Jobs in Canada: Management Occupations & PR Eligibility",
    lead: "TEER 0 covers management occupations in Canada, such as restaurant, financial, and engineering managers. These roles direct organizations, departments, or teams. TEER 0 is high-skilled, so experience in a TEER 0 job can qualify you for Canadian permanent residency through Express Entry.",
    skillLevel: "High-skilled",
    expressEntryEligible: true,
    eeVerdict: "Eligible (Express Entry)",
    requirements:
      "TEER 0 jobs are defined by management responsibility rather than one specific credential. Employers usually expect substantial experience in the field being managed, and often a related degree or diploma.",
    prPathways:
      "TEER 0 experience counts for the Federal Skilled Worker Program, the Canadian Experience Class (minimum CLB 7), and most Provincial Nominee Program streams.",
    newcomerGuidance:
      "Few newcomers land a TEER 0 role on arrival. A common route is to start in a TEER 1-3 role, build Canadian experience, then move into management. Because TEER 0 is assessed on responsibility, document the scope you managed abroad (budgets, headcount, decisions), not just your job title.",
    occupations: [
      { noc: "60030", title: "Restaurant and food service managers" },
      { noc: "60020", title: "Retail and wholesale trade managers" },
      { noc: "10010", title: "Financial managers" },
      { noc: "20010", title: "Engineering managers" },
      { noc: "70010", title: "Construction managers" },
      { noc: "30010", title: "Managers in health care" },
    ],
    faqs: [
      {
        q: "Is TEER 0 eligible for Express Entry?",
        a: "Yes. TEER 0 is a high-skilled category, so qualifying TEER 0 work experience counts for the Federal Skilled Worker Program and the Canadian Experience Class under Express Entry.",
      },
      {
        q: "What is a TEER 0 job in Canada?",
        a: "TEER 0 jobs are management occupations, such as restaurant managers, financial managers, and construction managers. They are classified by management responsibility rather than a single required credential.",
      },
    ],
  },
  {
    tier: 1,
    slug: "teer-1",
    seoTitle: "TEER 1 Jobs in Canada: Degree Roles & PR Eligibility",
    seoDescription:
      "TEER 1 occupations usually need a university degree and are Express Entry eligible. See example TEER 1 jobs, NOC codes, and Canadian PR pathways.",
    h1: "TEER 1 Jobs in Canada: University-Degree Roles & PR Eligibility",
    lead: "TEER 1 occupations usually require a university degree, such as software engineers, registered nurses, accountants, and lawyers. TEER 1 is high-skilled and Express Entry eligible, making it one of the strongest categories for Canadian permanent residency.",
    skillLevel: "High-skilled",
    expressEntryEligible: true,
    eeVerdict: "Eligible (Express Entry)",
    requirements:
      "TEER 1 occupations typically require a university degree (bachelor's, master's, or doctorate). Several are regulated professions that also need a Canadian licence to practise.",
    prPathways:
      "TEER 1 experience qualifies for the Federal Skilled Worker Program, the Canadian Experience Class (minimum CLB 7), and PNP streams, often with category-based Express Entry draws for fields like health care.",
    newcomerGuidance:
      "If your TEER 1 job is a regulated profession (nursing, law, engineering, teaching), start credential recognition and licensing early, since it can take months. You can often work in a related TEER 2-3 role while you complete licensing.",
    occupations: [
      { noc: "11100", title: "Financial auditors and accountants" },
      { noc: "21231", title: "Software engineers and designers" },
      { noc: "31301", title: "Registered nurses and registered psychiatric nurses" },
      { noc: "41101", title: "Lawyers and Quebec notaries" },
      { noc: "21200", title: "Architects" },
      { noc: "21300", title: "Civil engineers" },
    ],
    relatedPost: {
      slug: "credential-recognition-in-canada-a-step-by-step-guide-for-internationally-trained-professionals",
      label: "Credential Recognition in Canada: a step-by-step guide",
    },
    faqs: [
      {
        q: "Is TEER 1 eligible for Express Entry?",
        a: "Yes. TEER 1 is high-skilled, so TEER 1 work experience qualifies for the Federal Skilled Worker Program and the Canadian Experience Class. Many category-based draws also target TEER 1 fields.",
      },
      {
        q: "Do TEER 1 jobs always need a university degree?",
        a: "Usually. TEER 1 occupations are defined by typically requiring a university degree, and many are regulated professions that also require Canadian licensing to practise.",
      },
    ],
  },
  {
    tier: 2,
    slug: "teer-2",
    seoTitle: "TEER 2 Jobs in Canada: Diploma, Trades & PR",
    seoDescription:
      "TEER 2 covers college, apprenticeship, and supervisory jobs in Canada and is Express Entry eligible. See example TEER 2 occupations, NOC codes, and PR pathways.",
    h1: "TEER 2 Jobs in Canada: College, Trades & Supervisory Roles",
    lead: "TEER 2 occupations usually require a college diploma, an apprenticeship of two or more years, or carry supervisory responsibility. Examples include electricians, licensed practical nurses, and police officers. TEER 2 is high-skilled and Express Entry eligible.",
    skillLevel: "High-skilled",
    expressEntryEligible: true,
    eeVerdict: "Eligible (Express Entry)",
    requirements:
      "TEER 2 jobs usually require a college diploma, two or more years of apprenticeship training, or supervisory experience. Many skilled trades sit here and may need a provincial certificate of qualification or Red Seal.",
    prPathways:
      "TEER 2 experience qualifies for the Federal Skilled Worker Program, the Canadian Experience Class (minimum CLB 5), the Federal Skilled Trades Program for eligible trades, and many PNP streams.",
    newcomerGuidance:
      "For trades, getting certified provincially (and Red Seal where available) sharply improves both your job prospects and PR options. If you supervise a team, that responsibility alone can place a role at TEER 2 even without a diploma.",
    occupations: [
      { noc: "12200", title: "Accounting technicians and bookkeepers" },
      { noc: "22220", title: "Computer network and web technicians" },
      { noc: "32101", title: "Licensed practical nurses" },
      { noc: "42100", title: "Police officers (except commissioned)" },
      { noc: "72200", title: "Electricians (except industrial and power system)" },
      { noc: "72300", title: "Plumbers" },
    ],
    faqs: [
      {
        q: "Is TEER 2 eligible for Express Entry?",
        a: "Yes. TEER 2 is high-skilled, so TEER 2 experience qualifies for the Federal Skilled Worker Program, the Canadian Experience Class (CLB 5), and the Federal Skilled Trades Program for eligible trades.",
      },
      {
        q: "What language level do TEER 2 jobs need for the Canadian Experience Class?",
        a: "The Canadian Experience Class requires a minimum of CLB 5 for TEER 2 and TEER 3 occupations, compared with CLB 7 for TEER 0 and TEER 1.",
      },
    ],
  },
  {
    tier: 3,
    slug: "teer-3",
    seoTitle: "TEER 3 Jobs in Canada: Examples, NOC & PR Eligibility",
    seoDescription:
      "TEER 3 jobs need a short college program or 6+ months of training and are Express Entry eligible. See example TEER 3 occupations, NOC codes, and PR pathways.",
    h1: "TEER 3 Jobs in Canada: Examples, NOC Codes & PR Eligibility",
    lead: "TEER 3 occupations usually require a short college program, an apprenticeship under two years, or more than six months of on-the-job training. Examples include cooks, transport truck drivers, and dental assistants. TEER 3 is high-skilled and Express Entry eligible.",
    skillLevel: "High-skilled",
    expressEntryEligible: true,
    eeVerdict: "Eligible (Express Entry)",
    requirements:
      "TEER 3 jobs usually require a college program of less than two years, an apprenticeship under two years, or more than six months of on-the-job training plus relevant experience.",
    prPathways:
      "TEER 3 is the lowest TEER that still qualifies for Express Entry. It counts for the Federal Skilled Worker Program, the Canadian Experience Class (minimum CLB 5), and many PNP streams, which makes it a popular PR route for newcomers.",
    newcomerGuidance:
      "TEER 3 is often the most realistic high-skilled entry point for newcomers, because many roles train on the job. The key is to make sure your role is genuinely classified at TEER 3 (not TEER 4) under NOC 2021, since that single line decides Express Entry eligibility.",
    occupations: [
      { noc: "63200", title: "Cooks" },
      { noc: "73300", title: "Transport truck drivers" },
      { noc: "33100", title: "Dental assistants and dental laboratory assistants" },
      { noc: "13102", title: "Payroll administrators" },
      { noc: "73400", title: "Heavy equipment operators" },
      { noc: "63210", title: "Hairstylists and barbers" },
    ],
    relatedPost: {
      slug: "the-easiest-skilled-jobs-to-transition-into-teer-3-for-pr-purposes-in-canada",
      label: "The easiest TEER 3 jobs to transition into for PR",
    },
    faqs: [
      {
        q: "Is TEER 3 eligible for Express Entry?",
        a: "Yes. TEER 3 is the lowest TEER category that still qualifies for Express Entry. TEER 3 work experience counts for the Federal Skilled Worker Program and the Canadian Experience Class (minimum CLB 5).",
      },
      {
        q: "Is TEER 3 eligible for PR in Canada?",
        a: "Yes. Because TEER 3 is high-skilled, it qualifies for Express Entry and many Provincial Nominee Program streams, so it is one of the more accessible permanent residency routes for newcomers.",
      },
    ],
  },
  {
    tier: 4,
    slug: "teer-4",
    seoTitle: "TEER 4 Jobs in Canada: PR Pathways & Examples",
    seoDescription:
      "TEER 4 jobs need a high school diploma or weeks of training and are not Express Entry eligible. See example TEER 4 occupations, NOC codes, and other PR pathways.",
    h1: "TEER 4 Jobs in Canada: Examples & PR Pathways",
    lead: "TEER 4 occupations usually require a high school diploma or a few weeks of on-the-job training, such as retail salespersons, home support workers, and data entry clerks. TEER 4 is lower-skilled and is not eligible for Express Entry, but some provincial and sector programs offer PR pathways.",
    skillLevel: "Lower-skilled",
    expressEntryEligible: false,
    eeVerdict: "Not eligible (Express Entry)",
    requirements:
      "TEER 4 jobs usually require a high school diploma or a few weeks of on-the-job training. They are classified as lower-skilled under NOC 2021.",
    prPathways:
      "TEER 4 work does not qualify for the federal Express Entry programs. PR may still be possible through certain Provincial Nominee Program streams, the Atlantic Immigration Program, caregiver pathways (for roles like home support workers), and agri-food programs. Requirements vary by program and province.",
    newcomerGuidance:
      "Many newcomers start in a TEER 4 job to get established. To open up PR, aim to move into a TEER 2-3 role through promotion, certification, or a bridging program, or target a PNP or sector pilot that accepts your occupation.",
    occupations: [
      { noc: "64100", title: "Retail salespersons and visual merchandisers" },
      { noc: "44101", title: "Home support workers and related occupations" },
      { noc: "14111", title: "Data entry clerks" },
      { noc: "64410", title: "Security guards and related security service occupations" },
      { noc: "74100", title: "Mail, postal and related workers" },
      { noc: "94140", title: "Process control and machine operators, food and beverage processing" },
    ],
    relatedPost: {
      slug: "how-entry-level-jobs-can-lead-to-permanent-residency-pr-in-canada",
      label: "How entry-level jobs can lead to PR in Canada",
    },
    faqs: [
      {
        q: "Is TEER 4 eligible for Express Entry?",
        a: "No. TEER 4 is classified as lower-skilled, so it does not qualify for the Federal Skilled Worker Program or the Canadian Experience Class. PR may still be possible through some PNP streams, the Atlantic Immigration Program, or sector-specific pilots.",
      },
      {
        q: "How can a TEER 4 worker get PR in Canada?",
        a: "Common routes are moving into a TEER 0-3 role to qualify for Express Entry, or applying through a Provincial Nominee Program, the Atlantic Immigration Program, a caregiver pathway, or an agri-food program that accepts the occupation.",
      },
    ],
  },
  {
    tier: 5,
    slug: "teer-5",
    seoTitle: "TEER 5 Jobs in Canada: PR Pathways & Examples",
    seoDescription:
      "TEER 5 jobs need no formal education and are not Express Entry eligible. See example TEER 5 occupations, NOC codes, and the PR pathways that may still apply.",
    h1: "TEER 5 Jobs in Canada: Examples & PR Pathways",
    lead: "TEER 5 occupations need only short work demonstration and no formal education, such as cashiers, food and beverage servers, and labourers. TEER 5 is the lowest-skilled category and is not eligible for Express Entry, though some provincial and sector programs may still lead to PR.",
    skillLevel: "Lower-skilled",
    expressEntryEligible: false,
    eeVerdict: "Not eligible (Express Entry)",
    requirements:
      "TEER 5 jobs usually need only short-term work demonstration and no formal education credential. They are the lowest-skilled category under NOC 2021.",
    prPathways:
      "TEER 5 work does not qualify for Express Entry. PR can still be possible through specific Provincial Nominee Program streams, the Atlantic Immigration Program, and sector pilots (for example agri-food), each with their own requirements.",
    newcomerGuidance:
      "A TEER 5 job can be a stable first step, but it does not build Express Entry eligibility on its own. Use it to fund certification or a short college program that moves you into TEER 3, or apply through a provincial or sector program that accepts lower-skilled work.",
    occupations: [
      { noc: "65100", title: "Cashiers" },
      { noc: "65200", title: "Food and beverage servers" },
      { noc: "65310", title: "Light duty cleaners" },
      { noc: "75101", title: "Material handlers" },
      { noc: "85121", title: "Landscaping and grounds maintenance labourers" },
      { noc: "95100", title: "Labourers in processing, manufacturing and utilities" },
    ],
    faqs: [
      {
        q: "Is TEER 5 eligible for Express Entry?",
        a: "No. TEER 5 is the lowest-skilled category and does not qualify for the federal Express Entry programs. PR may still be possible through some Provincial Nominee Program streams, the Atlantic Immigration Program, or sector pilots.",
      },
      {
        q: "What are examples of TEER 5 jobs?",
        a: "TEER 5 jobs include cashiers, food and beverage servers, light duty cleaners, material handlers, and labourers. They typically need only short on-the-job demonstration and no formal education.",
      },
    ],
  },
];

export const getTier = (slug: string): TeerTier | undefined =>
  TEER_TIERS.find((t) => t.slug === slug);

// Hub-level FAQ (targets "what is teer", "which teer is eligible for pr").
export const TEER_HUB_FAQS: TeerFaq[] = [
  {
    q: "What does TEER mean in Canada's NOC?",
    a: "TEER stands for Training, Education, Experience and Responsibilities. Under the National Occupational Classification (NOC 2021), every job is assigned one of six TEER categories, from TEER 0 to TEER 5, based on how much training and responsibility it involves.",
  },
  {
    q: "Which TEER categories are eligible for PR in Canada?",
    a: "TEER 0, 1, 2, and 3 are high-skilled and eligible for Express Entry, the main route to permanent residency. TEER 4 and 5 are lower-skilled and are not eligible for Express Entry, though some provincial and sector programs may still apply.",
  },
  {
    q: "How do I find my TEER category?",
    a: "Find your job's 5-digit NOC 2021 code using the official IRCC NOC tool. The second digit of that code is your TEER category, so NOC 63200 (cooks) is TEER 3.",
  },
];
