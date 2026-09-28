// Content for /who-is-a-newcomer: how each institution defines a "newcomer" in Canada.
// There is no legal definition (the IRCC glossary has no "newcomer" entry), so each row
// quotes the program's own rule and links to it. Checked September 2026.
// Bank windows are NOT here: the page reads them from src/lib/newcomer-banking.ts so the
// two pages never disagree.
// Notes from the research:
// - The FCAC no-cost account rule is a voluntary Commitment (14 signers incl. the 6 largest
//   banks), in force December 1, 2025. Its "newcomer" includes temporary residents.
// - Sagen and Canada Guaranty no longer state the 60-month window that third-party sites
//   still quote; CMHC says "No minimum period of residency required". Do not add a 5-year
//   mortgage claim without a current official source.

export interface NewcomerDefinition {
  id: string;
  institution: string;
  /** The term the institution itself uses. */
  term: string;
  /** Short answer for the comparison table. */
  window: string;
  rule: string;
  whoCounts: string;
  unlocks: string;
  source: string;
  guide?: { label: string; href: string };
  confidence: "high" | "medium" | "low";
}

export const NEWCOMER_LAST_VERIFIED = "September 2026";

export const NEWCOMER_LEAD =
  "<strong>There is no single legal definition of a newcomer in Canada.</strong> Each program sets its own rule: the CRA counts your first year as a tax resident, the no-cost bank account rule counts your first year in Canada, most banks' newcomer offers count 5 years, and IRCC's free settlement services last until citizenship (6 years for economic-class permanent residents). As a rule of thumb, you are a newcomer for about your first 5 years.";

export const NEWCOMER_AT_A_GLANCE: { label: string; value: string }[] = [
  { label: "Usual window", value: "About 5 years" },
  { label: "For tax (CRA)", value: "Your first year" },
  { label: "Ends for IRCC programs", value: "At citizenship" },
];

export const NEWCOMER_DEFINITIONS: NewcomerDefinition[] = [
  {
    id: "cra",
    institution: "Canada Revenue Agency (CRA)",
    term: "Newcomer to Canada",
    window: "Your first year as a resident for tax",
    rule: "\"The Canada Revenue Agency (CRA) considers you a newcomer to Canada for the first year you are a resident of Canada for income tax purposes.\" For most newcomers, tax residency starts the first day you live in Canada.",
    whoCounts: "Anyone who becomes a tax resident, whatever the immigration status: permanent residents, protected persons, and temporary residents such as students and workers.",
    unlocks: "You can apply for the Canada Child Benefit and the Canada Groceries and Essentials Benefit (formerly the GST/HST credit) before your first tax return, and your first return has special rules.",
    source: "https://www.canada.ca/en/revenue-agency/services/tax/international-non-residents/individuals-leaving-entering-canada-non-residents/newcomers-canada-immigrants.html",
    guide: { label: "Your first tax return and the 90% rule", href: "/blog/when-newcomers-can-claim-full-non-refundable-tax-credits-in-canada-the-90-rule-explained" },
    confidence: "high",
  },
  {
    id: "no-cost-account",
    institution: "Federal no-cost bank account (FCAC)",
    term: "Newcomers to Canada (for 1st year in Canada)",
    window: "Your first year in Canada",
    rule: "Since December 1, 2025, the banks that signed FCAC's Commitment on Low-Cost and No-Cost Accounts, including the 6 largest, waive the $4 monthly fee on their low-cost account for newcomers in their first year in Canada. It is a public commitment by the banks, not a law.",
    whoCounts: "Permanent residents (including people approved in principle), protected persons, and temporary residents such as students, workers, and temporary resident permit holders.",
    unlocks: "A chequing account with no monthly fee, at least 18 debit transactions a month, and no minimum balance. The bank can ask for documents to prove you qualify.",
    source: "https://www.canada.ca/en/financial-consumer-agency/services/industry/laws-regulations/low-cost-no-cost-accounts.html",
    guide: { label: "Bank accounts for newcomers", href: "/banking" },
    confidence: "high",
  },
  {
    id: "banks",
    institution: "Banks' newcomer packages",
    term: "Newcomer / New to Canada",
    window: "Usually 5 years (Desjardins: 3)",
    rule: "Each bank sets its own window, counted from the date on your immigration document when you open the account. TD, for example, says \"A newcomer is someone who has immigrated to Canada within 5 years.\" See the table below for every bank.",
    whoCounts: "Always permanent residents. Most banks also accept workers and international students; BMO sends students to a separate account, and CIBC needs a work permit of at least 12 months.",
    unlocks: "No monthly fee for 1 to 3 years, a credit card with no Canadian credit history, and other welcome offers.",
    source: "https://www.td.com/ca/en/personal-banking/products/banking-offers-for-newcomers",
    guide: { label: "Newcomer bank offers compared", href: "/banking" },
    confidence: "high",
  },
  {
    id: "ircc-services",
    institution: "IRCC free newcomer services",
    term: "Eligible for newcomer services",
    window: "Until citizenship; economic-class PRs 6 years (5 from April 2027)",
    rule: "Permanent residents outside Quebec can use IRCC's free newcomer services. Starting April 1, 2026, economic-class permanent residents (Express Entry, provincial nominees, and others), with their spouses and children, can use them for up to 6 years from the date they became a PR, and up to 5 years from April 1, 2027. There is no time limit for family-class PRs, resettled refugees, or protected persons.",
    whoCounts: "Permanent residents and PR applicants approved in principle, resettled refugees, protected persons, and temporary residents in a few programs such as the Atlantic Immigration Program. Most students and workers are not eligible. Canadian citizens are not eligible.",
    unlocks: "Free help with jobs, housing, forms, and community connections, a free language assessment, and support such as child care during classes.",
    source: "https://www.canada.ca/en/immigration-refugees-citizenship/services/settle-canada/newcomer-services/eligibility.html",
    guide: { label: "Our settlement partners in BC", href: "/partners" },
    confidence: "high",
  },
  {
    id: "language",
    institution: "Free language classes (LINC and CLIC)",
    term: "Permanent resident or protected person",
    window: "Until citizenship; the economic-class limit also applies",
    rule: "\"If you're a permanent resident or a protected person, you can take language classes at no cost.\" Language training is part of IRCC's settlement services, so the 6-year limit (5 years from April 2027) for economic-class permanent residents applies here too.",
    whoCounts: "Permanent residents, PR applicants approved in principle, resettled refugees, and protected persons. Not citizens, and not most temporary residents.",
    unlocks: "Free English (LINC) or French (CLIC) classes. A level of 4 or higher in speaking and listening can prove your language for citizenship.",
    source: "https://www.canada.ca/en/immigration-refugees-citizenship/services/new-immigrants/new-life-canada/improve-english-french/classes.html",
    guide: { label: "Language for work programs", href: "/blog/language-for-work-programs-in-canada-beyond-linc-what-newcomers-actually-need" },
    confidence: "high",
  },
  {
    id: "statcan",
    institution: "Statistics Canada",
    term: "Recent immigrant",
    window: "PR status in the 5 years before the census",
    rule: "\"A recent immigrant refers to a person who obtained landed immigrant or permanent resident status up to five years prior to a given census year.\" Statistics Canada uses \"immigrant\" and \"recent immigrant\", not \"newcomer\".",
    whoCounts: "People who became permanent residents in the 5-year window, including those who are now citizens. Students, workers, and asylum claimants are counted separately as non-permanent residents.",
    unlocks: "Nothing for you directly. It is the category behind most newcomer statistics and many funding formulas.",
    source: "https://www12.statcan.gc.ca/census-recensement/2021/ref/98-500/007/98-500-x2021007-eng.cfm",
    confidence: "high",
  },
  {
    id: "mortgage",
    institution: "Mortgage insurers (CMHC, Sagen, Canada Guaranty)",
    term: "Newcomers / New to Canada",
    window: "No fixed window on their current pages",
    rule: "CMHC Newcomers says \"No minimum period of residency required.\" Sagen's New to Canada program is for people who \"recently immigrated or relocated to Canada\", and Canada Guaranty's is for \"new immigrants\"; neither states a number of years on its current page. Some websites still quote 60 months, but the insurers' own pages no longer do.",
    whoCounts: "Permanent residents, and people with a valid work permit (for a home loan).",
    unlocks: "Buying a home with as little as 5% down, using proof other than a Canadian credit history.",
    source: "https://www.cmhc-schl.gc.ca/professionals/project-funding-and-mortgage-financing/mortgage-loan-insurance/mortgage-loan-insurance-homeownership-programs/newcomers",
    confidence: "medium",
  },
  {
    id: "bc",
    institution: "British Columbia (BC Newcomer Services Program)",
    term: "Newcomers on a temporary permit and new citizens",
    window: "No time limit stated",
    rule: "The province funds services for the people the federal program leaves out: temporary workers, international post-secondary students (if their school does not offer the service), provincial nominees waiting for PR, refugee claimants, displaced Ukrainians, and naturalized citizens.",
    whoCounts: "Temporary workers, students, nominees, refugee claimants, and new citizens in B.C.",
    unlocks: "Free settlement, job, and language help in B.C. when you do not qualify for IRCC services.",
    source: "https://www.welcomebc.ca/start-your-life-in-b-c/find-newcomer-services/services-for-newcomers-on-a-temporary-work-or-study-permit-and-new-citizens%C2%A0(bc-nsp)",
    guide: { label: "Our settlement partners in BC", href: "/partners" },
    confidence: "high",
  },
  {
    id: "citizenship",
    institution: "Citizenship (IRCC)",
    term: "When newcomer programs end",
    window: "Earliest: 1,095 days in Canada in the last 5 years",
    rule: "You can apply for citizenship when you have been physically in Canada for at least 1,095 days in the 5 years before you apply, with at least 730 days as a permanent resident. Days as a temporary resident or protected person count as half days, up to 365. You may also need 3 years of tax filing, and adults aged 18 to 54 must prove English or French and pass the test.",
    whoCounts: "Permanent residents.",
    unlocks: "Citizenship. It also ends your access to IRCC newcomer services and free language classes. Some provinces, such as B.C. and Ontario, still serve new citizens.",
    source: "https://www.canada.ca/en/immigration-refugees-citizenship/services/canadian-citizenship/become-canadian-citizen/eligibility.html",
    confidence: "high",
  },
];

const GLOSSARY = "https://www.canada.ca/en/services/immigration-citizenship/helpcentre/glossary.html";

export const STATUS_TERMS: { term: string; meaning: string; source: string }[] = [
  {
    term: "Newcomer",
    meaning: "Not a legal status. A time-limited label that each program defines for itself, from 1 year (CRA) to about 5 years (banks). The IRCC glossary has no entry for it.",
    source: GLOSSARY,
  },
  {
    term: "Immigrant",
    meaning: "Statistics Canada: anyone who is, or has ever been, a permanent resident, including people who later became citizens. You stay an immigrant for life; you are a newcomer only for your first years.",
    source: "https://www12.statcan.gc.ca/census-recensement/2021/ref/dict/az/Definition-eng.cfm?ID=pop221",
  },
  {
    term: "Permanent resident (PR)",
    meaning: "\"A person who has legally immigrated to Canada but is not yet a Canadian citizen.\" Older documents say \"landed immigrant\".",
    source: GLOSSARY,
  },
  {
    term: "Temporary resident",
    meaning: "\"A foreign national who is in Canada legally for a short period,\" such as a student, a worker, or a visitor.",
    source: GLOSSARY,
  },
  {
    term: "Protected person",
    meaning: "A person that Canada has found to be a Convention refugee or in need of protection, abroad or through the Immigration and Refugee Board.",
    source: GLOSSARY,
  },
  {
    term: "Refugee claimant",
    meaning: "A person who has asked for refugee protection in Canada and is waiting for a decision. Not yet a protected person, so not eligible for most federal newcomer services.",
    source: GLOSSARY,
  },
  {
    term: "Approved in principle",
    meaning: "You have a letter from IRCC that says you meet the PR requirements, but checks are not finished. You can already use IRCC newcomer services.",
    source: GLOSSARY,
  },
];

export const NEWCOMER_FAQS: { q: string; a: string }[] = [
  {
    q: "Who is considered a newcomer in Canada?",
    a: "There is no single legal definition, and the IRCC glossary has no entry for \"newcomer\". Each program sets its own rule. The CRA treats you as a newcomer for your first year as a tax resident. The no-cost bank account rule counts permanent residents, protected persons, and temporary residents in their first year in Canada. Most banks' newcomer offers use \"in Canada 5 years or less\". IRCC's free newcomer services are for permanent residents and protected persons until citizenship.",
  },
  {
    q: "How long are you considered a newcomer in Canada?",
    a: "It depends on the program: 1 year for the CRA and for the no-cost bank account, usually 5 years for bank newcomer packages (3 at Desjardins), and until citizenship for IRCC settlement services, except that economic-class permanent residents get 6 years from their PR date (5 years from April 1, 2027). As a rule of thumb, most programs treat you as a newcomer for about 5 years.",
  },
  {
    q: "What does \"new to Canada for less than 5 years\" mean for bank offers?",
    a: "Most banks count 5 years from a date you can prove, such as the date on your PR card, your Confirmation of Permanent Residence, or your permit. The window only matters on the day you open the account; the fee waiver then lasts 1 to 3 years depending on the bank. Desjardins uses 3 years, and CIBC accepts workers with a work permit of at least 12 months.",
  },
  {
    q: "Are international students and temporary workers newcomers?",
    a: "For some programs, yes. The CRA can treat them as newcomers once they are tax residents, the no-cost bank account rule includes them, and most banks accept them for newcomer offers. But IRCC's free settlement services and language classes are generally not for students and workers. Some provinces fill the gap: B.C.'s Newcomer Services Program serves temporary workers and international students.",
  },
  {
    q: "Is a newcomer the same as an immigrant?",
    a: "No. An immigrant (Statistics Canada) is anyone who is or ever was a permanent resident, including people who later became citizens, so you stay an immigrant for life. \"Newcomer\" is a time-limited label for your first months or years, and many programs include temporary residents who are not immigrants.",
  },
  {
    q: "Do I stop being a newcomer when I become a citizen?",
    a: "For federal programs, yes: Canadian citizens are not eligible for IRCC newcomer services or free LINC classes. Some provinces still help new citizens: B.C.'s Newcomer Services Program and Ontario's adult ESL classes both accept naturalized citizens.",
  },
  {
    q: "Can I still get free newcomer services if I became a PR years ago?",
    a: "If you came through a family or refugee program, yes, until you become a citizen. If you came through an economic program such as Express Entry or a provincial nominee program, the limit is 6 years from your PR date as of April 1, 2026, and 5 years as of April 1, 2027. The date is the \"Became P.R. on\" date on your Confirmation of Permanent Residence.",
  },
];
