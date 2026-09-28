// Content for /newcomer-benefits: government payments and free services newcomers can get,
// what they cannot get yet, and a fact check of the rumours in Google's "People also ask".
// Checked September 2026 against CRA, ESDC, IRCC, the provinces, Parks Canada, and canoo.ca.
// Amounts are for the July 2026 to June 2027 benefit year; update them every July.
// - The Canada Groceries and Essentials Benefit (CGEB) replaced the GST/HST credit in July
//   2026: one 25% increase that stays for 2026 to 2031 (NOT 25% more every year).
// - CCB 6-17 maximum is $6,883 (CRA page modified 2026-06-23).
// - "Welcome to Canada" $500 is General Motors' car discount, not a government payment.

export type BenefitGroup = "payment" | "provincial" | "free" | "not-yet";

export interface Benefit {
  id: string;
  group: BenefitGroup;
  name: string;
  /** Short, for tables. */
  upTo: string;
  whoShort: string;
  who: string;
  temporaryResidents?: string;
  howToApply: string;
  note?: string;
  source: string;
  guide?: { label: string; href: string };
  confidence: "high" | "medium" | "low";
}

export interface Myth {
  claim: string;
  verdict: "False" | "Misleading";
  answer: string;
  source: string;
}

export const BENEFITS_LAST_VERIFIED = "September 2026";
export const BENEFIT_YEAR = "July 2026 to June 2027";

export const BENEFITS_LEAD =
  "<strong>Canada does not give new immigrants a welcome payment.</strong> What you can get are the same tax-free benefits as other residents: the Canada Groceries and Essentials Benefit (up to $679 a year for a single person), the Canada Child Benefit (up to $8,157 a year per child under 6), and the provincial payments that come with them. Apply soon after you arrive with form RC151 or RC66; you do not have to wait for your first tax return.";

export const BENEFITS_AT_A_GLANCE: { label: string; value: string }[] = [
  { label: "Welcome bonus", value: "None exists" },
  { label: "Apply with", value: "RC151 or RC66" },
  { label: "To keep them", value: "File taxes every year" },
];

export const BENEFITS: Benefit[] = [
  // Federal payments
  {
    id: "cgeb",
    group: "payment",
    name: "Canada Groceries and Essentials Benefit (CGEB)",
    upTo: "$679 single · $890 couple · +$234 per child",
    whoShort: "Tax residents with low or modest income",
    who: "You are a resident of Canada for tax purposes, 19 or older (or younger with a spouse or a child), and your income is low or modest. There is no immigration-status test.",
    temporaryResidents: "Workers and international students can get it once they are tax residents.",
    howToApply: "Without children, use the online RC151 form. With children under 19, mail form RC151 (and RC66 if you can get the Canada Child Benefit) with proof of birth. After that, file a tax return every year; there is no new application.",
    note: "It replaced the GST/HST credit in July 2026 with the same rules. The 25% increase in July 2026 stays for 5 years; it does not grow 25% every year. Paid four times a year: July, October, January, and April.",
    source: "https://www.canada.ca/en/revenue-agency/services/child-family-benefits/canada-groceries-essentials-benefit.html",
    confidence: "high",
  },
  {
    id: "ccb",
    group: "payment",
    name: "Canada Child Benefit (CCB)",
    upTo: "$8,157 per child under 6 · $6,883 per child 6 to 17",
    whoShort: "Parents of children under 18",
    who: "You live with a child under 18, are mainly responsible for the child, and are a tax resident. You or your spouse must be a citizen, permanent resident, protected person, or a temporary resident who meets the 18-month rule. The amount goes down as family income goes up (from $38,237).",
    temporaryResidents: "Only after you have lived in Canada for the previous 18 months and have a valid permit in the 19th month. If you apply earlier, the CRA registers your children for the groceries benefit only, and you apply again later.",
    howToApply: "Apply in CRA My Account, or mail form RC66 with schedule RC66SCH and proof of birth for each child. The CRA aims to pay within 8 weeks of an online application (11 weeks on paper).",
    note: "Tax-free and paid every month. You report your world income for the part of the year before you arrived.",
    source: "https://www.canada.ca/en/revenue-agency/services/child-family-benefits/canada-child-benefit-overview/canada-child-benefit-we-calculate-your-ccb.html",
    confidence: "high",
  },
  {
    id: "cwb",
    group: "payment",
    name: "Canada Workers Benefit (CWB)",
    upTo: "$1,633 single · $2,813 family (2025 tax year)",
    whoShort: "Low-income workers, from your first full year",
    who: "You earn working income, are 19 or older (or live with a spouse or child), your income is low, and you were a resident of Canada for the whole year. So most newcomers claim it for their first full calendar year, not the year they arrive.",
    temporaryResidents: "No status test, but full-time students for more than 13 weeks of the year are usually excluded.",
    howToApply: "Claim it on your tax return (line 45300, Schedule 6). After your first claim, the CRA pays up to half of it in advance.",
    source: "https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/about-your-tax-return/tax-return/completing-a-tax-return/deductions-credits-expenses/line-45300-canada-workers-benefit-cwb/who-is-eligible.html",
    confidence: "high",
  },
  {
    id: "dental",
    group: "payment",
    name: "Canadian Dental Care Plan (CDCP)",
    upTo: "Part of the cost of dental care",
    whoShort: "After your first tax return",
    who: "You have no private dental insurance, your adjusted family net income is under $90,000, you are a tax resident, and you (and your spouse) filed a Canadian tax return for the previous year. Because of the tax-return rule, most newcomers can apply only after their first return.",
    howToApply: "Apply online or by phone with Service Canada. Your spouse applies separately.",
    source: "https://www.canada.ca/en/services/benefits/dental/dental-care-plan/qualify.html",
    confidence: "high",
  },
  {
    id: "resp",
    group: "payment",
    name: "RESP grants for your children (CESG and Canada Learning Bond)",
    upTo: "$500 a year per child · up to $2,000 extra for low income",
    whoShort: "Children with a SIN and an RESP",
    who: "The government adds 20% of the first $2,500 you save each year in a Registered Education Savings Plan (up to $7,200 per child in total). Low-income families also get the Canada Learning Bond: $500 the first year and $100 a year after, up to $2,000, with no savings needed.",
    howToApply: "Get your child a SIN, open an RESP at a bank, and ask the provider to apply for the grant and the bond.",
    source: "https://www.canada.ca/en/services/benefits/education/education-savings/estimating-amounts.html",
    confidence: "high",
  },
  {
    id: "ei",
    group: "payment",
    name: "Employment Insurance (EI)",
    upTo: "Part of your pay if you lose your job",
    whoShort: "After 420 to 700 hours of insured work",
    who: "You lost your job through no fault of your own, worked 420 to 700 insured hours in the last 52 weeks (it depends on your region), and are available for work.",
    temporaryResidents: "Work permit holders who paid EI premiums can qualify if they can still legally work.",
    howToApply: "Apply online with Service Canada as soon as you stop working.",
    source: "https://www.canada.ca/en/services/benefits/ei/ei-regular-benefit/eligibility.html",
    confidence: "high",
  },

  // Provincial payments
  {
    id: "bc-family",
    group: "provincial",
    name: "British Columbia: B.C. Family Benefit",
    upTo: "$1,750 first child · $1,100 second · $900 each after",
    whoShort: "Families with children in B.C.",
    who: "Income-tested, for families with children under 18 in B.C.",
    howToApply: "Automatic once your child is registered for the Canada Child Benefit. File a tax return each year.",
    source: "https://www2.gov.bc.ca/gov/content/family-social-supports/affordability/family-benefit",
    confidence: "high",
  },
  {
    id: "on-child",
    group: "provincial",
    name: "Ontario: Ontario Child Benefit",
    upTo: "$1,760 per child",
    whoShort: "Families with children in Ontario",
    who: "Low- and moderate-income families with children under 18 in Ontario.",
    howToApply: "Automatic with the Canada Child Benefit and your tax return.",
    source: "https://www.ontario.ca/page/ontario-child-benefit",
    confidence: "high",
  },
  {
    id: "on-trillium",
    group: "provincial",
    name: "Ontario: Ontario Trillium Benefit",
    upTo: "Depends on income, rent, and region",
    whoShort: "Ontario residents who pay rent or property tax",
    who: "Combines Ontario's energy and property tax credit, sales tax credit, and northern energy credit.",
    howToApply: "File your tax return with the ON-BEN form by April 30, even with no income. Your first payment comes after your first Ontario return.",
    source: "https://www.ontario.ca/page/ontario-trillium-benefit",
    confidence: "high",
  },
  {
    id: "ab-family",
    group: "provincial",
    name: "Alberta: Alberta Child and Family Benefit",
    upTo: "$1,529 + $782 for one child (more for more children)",
    whoShort: "Families with children in Alberta",
    who: "Income-tested, for Alberta parents of children under 18 who get the Canada Child Benefit.",
    howToApply: "Automatic when you file your tax return and qualify for the Canada Child Benefit.",
    source: "https://www.alberta.ca/alberta-child-and-family-benefit",
    confidence: "medium",
  },
  {
    id: "qc-family",
    group: "provincial",
    name: "Quebec: Family Allowance (Retraite Québec)",
    upTo: "$3,068 per child (2026)",
    whoShort: "Families with children in Quebec",
    who: "You or your spouse must be a citizen, permanent resident, protected person, or a temporary resident who has lived in Canada for the last 18 months. Both spouses file a Quebec tax return.",
    howToApply: "Not automatic for newcomers: apply to Retraite Québec separately from the Canada Child Benefit. Payments can go back up to 11 months.",
    source: "https://www.retraitequebec.gouv.qc.ca/en/citizens/children/family-allowance",
    confidence: "high",
  },
  {
    id: "qc-solidarity",
    group: "provincial",
    name: "Quebec: Solidarity Tax Credit (Revenu Québec)",
    upTo: "Depends on income and housing",
    whoShort: "Quebec residents with low or modest income",
    who: "You live in Quebec and are a citizen, permanent resident, protected person, or a temporary resident who has lived in Canada for the last 18 months, and you met the rules on December 31 of the previous year.",
    howToApply: "Claim it on your Quebec tax return (Schedule D) and register for direct deposit.",
    source: "https://www.revenuquebec.ca/en/citizens/tax-credits/solidarity-tax-credit/eligibility/",
    confidence: "high",
  },

  // Free services and perks
  {
    id: "settlement",
    group: "free",
    name: "Settlement services and language classes",
    upTo: "Free",
    whoShort: "Permanent residents and protected persons",
    who: "Job help, help with forms and housing, a language assessment, and English or French classes. Economic-class permanent residents can use them for 6 years after becoming a PR (5 years from April 1, 2027). Most students and workers are not eligible.",
    howToApply: "Find a provider near you with IRCC's service finder.",
    source: "https://www.canada.ca/en/immigration-refugees-citizenship/services/settle-canada/newcomer-services/eligibility.html",
    guide: { label: "Who counts as a newcomer", href: "/who-is-a-newcomer" },
    confidence: "high",
  },
  {
    id: "canoo",
    group: "free",
    name: "Canoo: free museums and a year of free Parks Canada entry",
    upTo: "Free or discounted entry to 2,000+ places",
    whoShort: "PRs in their first 5 years, and new citizens",
    who: "Adults who became permanent residents in the past 5 years, or citizens in the year after their ceremony. Includes one full year of free entry to Parks Canada places, for you and up to 4 children.",
    howToApply: "Download the free Canoo app from the Institute for Canadian Citizenship and verify your PR card or citizenship certificate.",
    source: "https://canoo.ca/eligibility",
    confidence: "high",
  },
  {
    id: "library",
    group: "free",
    name: "Public library card",
    upTo: "Free",
    whoShort: "Anyone who lives in the city",
    who: "Libraries are free for local residents whatever your immigration status, and many run free newcomer programs, English conversation circles, and job-search help.",
    howToApply: "Bring ID and proof of your address to a branch.",
    source: "https://tpl.ca/using-the-library/your-library-card/",
    confidence: "high",
  },

  // Not yet
  {
    id: "oas",
    group: "not-yet",
    name: "Old Age Security (OAS) pension",
    upTo: "Not until 10 years in Canada",
    whoShort: "Age 65+, after 10 years in Canada",
    who: "You must have lived in Canada for at least 10 years after age 18. A social security agreement with your former country can sometimes help you qualify.",
    howToApply: "Service Canada, when you are close to 65.",
    source: "https://www.canada.ca/en/services/benefits/publicpensions/old-age-security/eligibility.html",
    confidence: "high",
  },
  {
    id: "rap",
    group: "not-yet",
    name: "Resettlement Assistance Program (RAP)",
    upTo: "Only for government-assisted refugees",
    whoShort: "Government-assisted refugees only",
    who: "The only program that gives monthly money because you arrived. It is for government-assisted refugees resettled from abroad, for up to one year. Economic and family-class immigrants, workers, students, and people who claim asylum inside Canada do not get it.",
    howToApply: "Arranged by IRCC before arrival; the public cannot apply.",
    source: "https://www.canada.ca/en/immigration-refugees-citizenship/services/refugees/help-within-canada/government-assisted-refugee-program.html",
    confidence: "high",
  },
];

export const BENEFIT_MYTHS: Myth[] = [
  {
    claim: "Canada gives new immigrants a \"Welcome Canada\" bonus of $500 or $1,000.",
    verdict: "Misleading",
    answer: "No government program by that name exists. The name comes from General Motors Canada's Welcome to Canada Program: a $500 bonus toward buying or leasing a new GM vehicle, for holders of a PR card issued from 2023 to 2026 or a valid work permit. It is a car discount with no cash value; older dealer ads showed $1,000. A message that offers you a \"newcomer bonus\" from the CRA or IRCC is a scam.",
    source: "https://www.chevrolet.ca/en/programs/welcome-to-canada",
  },
  {
    claim: "There is a $7,500 tax credit for newcomers.",
    verdict: "Misleading",
    answer: "The number comes from the Multigenerational Home Renovation Tax Credit, for building a separate unit so a senior or a relative with a disability can live with family. It is now 14.5% of costs, up to $7,250 for 2025. It has nothing to do with immigration and is not a payment to newcomers.",
    source: "https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/about-your-tax-return/tax-return/completing-a-tax-return/deductions-credits-expenses/line-45355-mhrtc.html",
  },
  {
    claim: "Canada gives money to new immigrants when they arrive.",
    verdict: "False",
    answer: "There is no general arrival payment. Only government-assisted refugees get monthly support, through the Resettlement Assistance Program, for up to one year. Other newcomers can get income-tested benefits, like the groceries benefit and the Canada Child Benefit, but only if they apply and meet the rules.",
    source: "https://www.canada.ca/en/immigration-refugees-citizenship/services/refugees/help-within-canada/government-assisted-refugee-program.html",
  },
  {
    claim: "The groceries benefit goes up 25% every year for five years.",
    verdict: "False",
    answer: "The Canada Groceries and Essentials Benefit went up 25% once, in July 2026, and that higher amount stays for five years (2026 to 2031).",
    source: "https://www.canada.ca/en/revenue-agency/services/child-family-benefits/canada-groceries-essentials-benefit.html",
  },
];

export const BENEFITS_FAQS: { q: string; a: string }[] = [
  {
    q: "What benefits do newcomers get in Canada?",
    a: "Once you are a resident of Canada for tax purposes, you can apply for the Canada Groceries and Essentials Benefit (up to $679 for a single person, $890 for a couple, plus $234 per child, from July 2026 to June 2027). With children, you can apply for the Canada Child Benefit (up to $8,157 a year per child under 6 and $6,883 per child 6 to 17) if you are a citizen, permanent resident, or protected person, or a temporary resident after 18 months. Most provinces add a child benefit that comes with it. You can also get free settlement services and language classes (permanent residents), a free library card, and, as a new PR, free museum and Parks Canada entry through Canoo.",
  },
  {
    q: "Does Canada give money to new immigrants?",
    a: "Not as a welcome payment. The only program that pays monthly support because you arrived is the Resettlement Assistance Program, and it is only for government-assisted refugees, for up to one year. Other newcomers can get the same income-tested benefits as other residents, such as the groceries benefit and the Canada Child Benefit, if they apply and meet the rules.",
  },
  {
    q: "Is the \"Welcome Canada\" $500 or $1,000 bonus real?",
    a: "It is not a government payment. It is General Motors Canada's Welcome to Canada Program: a $500 discount on a new GM vehicle for people with a PR card issued from 2023 to 2026 or a valid work permit. It has no cash value, and older dealer ads showed $1,000. The Government of Canada has no welcome bonus, so treat any message offering one from the CRA or IRCC as a scam.",
  },
  {
    q: "Can temporary residents (workers, students) get the Canada Child Benefit?",
    a: "Yes, after 18 months. You or your spouse must have lived in Canada for the previous 18 months and have a valid permit in the 19th month, and you must be a tax resident. If you apply earlier, the CRA registers your children for the groceries benefit only. The groceries benefit itself has no immigration-status test.",
  },
  {
    q: "How do I apply for benefits before my first tax return?",
    a: "Without children, use the online RC151 form for the groceries benefit. With children, apply for the Canada Child Benefit in CRA My Account or mail form RC66 with schedule RC66SCH, and mail form RC151 with proof of birth for each child. You report your world income for the part of the year before you arrived. Provincial child benefits in B.C., Ontario, and Alberta start automatically with the Canada Child Benefit; in Quebec you apply to Retraite Québec separately.",
  },
  {
    q: "Do I need to file taxes to keep getting benefits?",
    a: "Yes. After your first year, you and your spouse must file a tax return every year by April 30, even with no income. The CRA recalculates your benefits every July from the previous year's return, and payments stop if you do not file. The Canadian Dental Care Plan also needs a return for the previous year.",
  },
  {
    q: "What is the Canada Groceries and Essentials Benefit?",
    a: "A tax-free payment the CRA sends four times a year to people with low and modest incomes. It replaced the GST/HST credit in July 2026 with the same rules, and the amount went up 25% for 2026 to 2031. From July 2026 to June 2027 it is up to $679 for a single person, $890 for a couple, and $234 for each child under 19. Newcomers apply with form RC151.",
  },
  {
    q: "Can newcomers get free dental care?",
    a: "Usually not in the first year. The Canadian Dental Care Plan needs a Canadian tax return for the previous year, family income under $90,000, no private dental insurance, and tax residency. Most newcomers can apply after they file their first return.",
  },
];
