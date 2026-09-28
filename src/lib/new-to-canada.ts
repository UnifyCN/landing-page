// Content for the /new-to-canada checklist (what to do in your first 30 days).
// Every step links to the official page it was checked against (IRCC, CBSA, ESDC,
// CRA, FCAC, CRTC, provinces). Checked September 2026. When a rule changes, edit
// the step and CHECKLIST_LAST_VERIFIED, never the template.
// Deliberate wording choices (official pages disagree or are stale):
// - Money at the border: "$10,000 or more" (CBSA), not "more than" (one IRCC page).
// - PR card address: "180 days of becoming a permanent resident" (card pages).
// - No promise of an airport SIN counter: the only source is a 2023 news release.
// - The GST/HST credit is now the Canada Groceries and Essentials Benefit (CGEB),
//   since July 2026; RC151 was retitled. Some CRA form pages still say GST/HST.

export type Audience = "pr" | "worker" | "student";
export type PhaseId = "landing" | "week1" | "month1" | "year1";

export interface ChecklistStep {
  id: string;
  phase: PhaseId;
  title: string;
  who: Audience[];
  /** Short timing line shown under the title. */
  timing: string;
  body: string;
  bring?: string[];
  official: { label: string; url: string };
  guides?: { label: string; href: string }[];
  confidence: "high" | "medium" | "low";
}

export const CHECKLIST_LAST_VERIFIED = "September 2026";

export const AUDIENCES: { id: Audience; label: string; short: string }[] = [
  { id: "pr", label: "Permanent resident", short: "PR" },
  { id: "worker", label: "Worker", short: "Workers" },
  { id: "student", label: "Student", short: "Students" },
];

export const CHECKLIST_PHASES: { id: PhaseId; when: string; title: string; intro: string }[] = [
  {
    id: "landing",
    when: "Day 1",
    title: "At the airport or border",
    intro:
      "Most mistakes that are hard to fix later happen here. Have your documents in your hand luggage, and check every paper the officer gives you before you leave the counter.",
  },
  {
    id: "week1",
    when: "Week 1",
    title: "Your first week",
    intro:
      "These steps unlock everything else: you need a SIN to work, a bank account to get paid, and a health card application in as soon as possible because some provinces make you wait.",
  },
  {
    id: "month1",
    when: "Weeks 2 to 4",
    title: "The rest of your first month",
    intro:
      "Now set up the parts of daily life that take longer: your licence, benefit payments, a home, school for your children, free settlement help, and your first steps toward a job.",
  },
  {
    id: "year1",
    when: "Your first year",
    title: "Before your first tax season",
    intro: "Two things to put in your calendar now so they do not surprise you later.",
  },
];

export const CHECKLIST_LEAD =
  "Do these steps in order. <strong>On day 1, check your documents at the border. In week 1, apply for your SIN and your provincial health card, open a bank account, and (for permanent residents) confirm your address for the PR card.</strong> In weeks 2 to 4, exchange your driver's licence, apply for benefits, and book free settlement services. Each step links to the official page and to our full guide.";

export const CHECKLIST_STEPS: ChecklistStep[] = [
  // Day 1
  {
    id: "border-documents",
    phase: "landing",
    title: "Show your documents and check your permit",
    who: ["pr", "worker", "student"],
    timing: "At the border",
    body:
      "Permanent residents show a passport and the Confirmation of Permanent Residence (COPR) before it expires; IRCC cannot extend a COPR. If you are already in Canada, you confirm PR online in the Permanent Residence Portal instead. Workers and students show the port of entry letter, and the officer prints the work or study permit. Read your permit before you leave: your name, the \"valid until\" date, and the conditions. Ask the officer to fix a mistake on the spot; after you leave, a fix takes a formal request.",
    bring: [
      "Passport for each family member",
      "COPR (permanent residents) or port of entry letter (workers, students)",
      "Letter of acceptance (students)",
      "Proof of funds, unless you are exempt",
    ],
    official: {
      label: "IRCC: Crossing the border",
      url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/settle-canada/border-crossing.html",
    },
    confidence: "high",
  },
  {
    id: "declare-money",
    phase: "landing",
    title: "Declare money of $10,000 or more",
    who: ["pr", "worker", "student"],
    timing: "At the border",
    body:
      "You must declare cash and other money of CAN$10,000 or more, in total, when you enter Canada. This counts cash, cheques, bank drafts, traveller's cheques, stocks, and bonds together. Declaring is not a tax. If you do not declare, the border agency can seize the money and fine you.",
    official: {
      label: "CBSA: Declare money",
      url: "https://www.cbsa-asfc.gc.ca/travel-voyage/declare-eng.html",
    },
    confidence: "high",
  },
  {
    id: "goods-list",
    phase: "landing",
    title: "Give the officer your list of goods, including goods to follow",
    who: ["pr"],
    timing: "At the border",
    body:
      "Make two copies of a list of everything you are bringing to settle, split into goods you have with you and goods to follow (with value, make, model, and serial number). Give it to the officer at your first point of entry, even if you have nothing with you. The officer prepares form BSF186. Goods that arrive later enter free of duty only if they are on this original list.",
    official: {
      label: "CBSA: Settling in Canada",
      url: "https://www.cbsa-asfc.gc.ca/travel-voyage/mrc-drc-eng.html",
    },
    confidence: "high",
  },

  // Week 1
  {
    id: "sin",
    phase: "week1",
    title: "Apply for your Social Insurance Number (SIN)",
    who: ["pr", "worker", "student"],
    timing: "First week, before you start work",
    body:
      "You need a SIN to work and to get government benefits. Apply online, by mail, or in person at a Service Canada Centre, where you usually get the number during your visit if your documents are in order. Students need a study permit that says you may work. A SIN for a temporary resident starts with 9 and ends when your permit ends.",
    bring: ["PR card or COPR (up to 1 year after it was issued)", "Or your work permit, or study permit that allows work"],
    official: {
      label: "Service Canada: Apply for a SIN",
      url: "https://www.canada.ca/en/employment-social-development/services/sin/apply.html",
    },
    guides: [{ label: "How to get a SIN", href: "/blog/how-to-get-a-sin-number-in-canada-newcomer-guide" }],
    confidence: "high",
  },
  {
    id: "health-card",
    phase: "week1",
    title: "Apply for your provincial health card",
    who: ["pr", "worker", "student"],
    timing: "First week",
    body:
      "Apply the week you arrive. Ontario, Alberta, Manitoba, New Brunswick, and Nova Scotia have no waiting period for most newcomers from abroad. British Columbia (the rest of the month plus two months), Quebec (up to 3 months, not for children under 18), and Saskatchewan make you wait, so buy private health insurance for the gap. Workers and students qualify in some provinces and not in others.",
    bring: ["Your immigration document (originals)", "Proof of your address in the province", "Proof of identity"],
    official: {
      label: "IRCC: Health care in Canada",
      url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/settle-canada/health-care.html",
    },
    guides: [{ label: "Health card rules in every province", href: "/health-card" }],
    confidence: "high",
  },
  {
    id: "bank-account",
    phase: "week1",
    title: "Open a bank account",
    who: ["pr", "worker", "student"],
    timing: "First week",
    body:
      "A bank must open a basic account for you even if you have no job and no money to deposit. You do not need a SIN to open it; you give your SIN only for an account that earns interest. Most big banks have a newcomer package with no monthly fee for the first year.",
    bring: ["Passport", "Your immigration document (PR card, COPR, or permit)"],
    official: {
      label: "FCAC: Opening a bank account",
      url: "https://www.canada.ca/en/financial-consumer-agency/services/banking/opening-bank-account.html",
    },
    guides: [{ label: "Newcomer bank accounts compared", href: "/banking" }],
    confidence: "high",
  },
  {
    id: "pr-card-address",
    phase: "week1",
    title: "Make sure IRCC has your address for your PR card",
    who: ["pr"],
    timing: "Within 180 days of becoming a PR",
    body:
      "IRCC mails your first PR card only if it has your Canadian mailing address and photo within 180 days of your becoming a permanent resident. You can give it at the border or with IRCC's online form. The current processing time is 35 days plus up to 6 weeks for mail, and you cannot track it. You need the card (or a PR travel document) to fly back to Canada, so plan trips abroad around it. To keep PR status, live in Canada at least 730 days in every 5 years.",
    official: {
      label: "IRCC: Get your first PR card",
      url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/permanent-residents/card/apply.html",
    },
    confidence: "high",
  },
  {
    id: "phone-plan",
    phase: "week1",
    title: "Get a Canadian phone number",
    who: ["pr", "worker", "student"],
    timing: "First days",
    body:
      "Banks, employers, and landlords will ask for a Canadian number. A prepaid plan needs no credit check. If you sign a contract with a cancellation fee, the Wireless Code gives you a trial period of at least 15 days, and any phone the provider gives you must be unlocked.",
    official: {
      label: "CRTC: The Wireless Code",
      url: "https://crtc.gc.ca/eng/phone/mobile/codesimpl.htm",
    },
    guides: [{ label: "Choosing a phone plan", href: "/blog/how-to-get-a-cell-phone-plan-in-canada-as-a-newcomer" }],
    confidence: "high",
  },

  // Weeks 2 to 4
  {
    id: "drivers-licence",
    phase: "month1",
    title: "Exchange your driver's licence before your grace period ends",
    who: ["pr", "worker", "student"],
    timing: "Ontario 60 days · BC and Alberta 90 days · Quebec 6 months",
    body:
      "You can drive on a valid foreign licence only for a short time after you become a resident of the province. Some countries' licences exchange without a road test; others need the full test. Bring proof of your driving experience to get credit for it, and a translation if your licence is not in English or French.",
    official: {
      label: "ICBC: Moving to BC from another country",
      url: "https://www.icbc.com/driver-licensing/moving-bc/moving-from-another-country",
    },
    guides: [{ label: "Licence exchange in every province", href: "/drivers-licence" }],
    confidence: "high",
  },
  {
    id: "benefits",
    phase: "month1",
    title: "Apply for the Canada Child Benefit and the groceries benefit",
    who: ["pr", "worker", "student"],
    timing: "As soon as you arrive; no need to wait for a tax return",
    body:
      "With children, apply for the Canada Child Benefit with form RC66 and schedule RC66SCH; this also covers the Canada Groceries and Essentials Benefit, which replaced the GST/HST credit in July 2026. Without children, apply for the groceries benefit with form RC151. Temporary residents can get the child benefit only after 18 months in Canada. You also report your income from outside Canada for the 2 years before you arrived.",
    official: {
      label: "CRA: Newcomers to Canada",
      url: "https://www.canada.ca/en/revenue-agency/services/tax/international-non-residents/individuals-leaving-entering-canada-non-residents/newcomers-canada-immigrants.html",
    },
    confidence: "high",
  },
  {
    id: "home",
    phase: "month1",
    title: "Find a long-term home and learn your tenant rights",
    who: ["pr", "worker", "student"],
    timing: "First two months",
    body:
      "Each province has its own tenancy law that sets how much rent can go up, what a deposit can be, and when a landlord can evict you. Read your province's rules before you sign. Never pay a deposit for a place you have not seen or a landlord you cannot verify.",
    official: {
      label: "IRCC: Renting a home",
      url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/settle-canada/housing/renting.html",
    },
    guides: [
      { label: "Renting with no credit history", href: "/blog/how-to-rent-your-first-apartment-in-canada-as-a-newcomer-with-no-credit-history" },
    ],
    confidence: "high",
  },
  {
    id: "school",
    phase: "month1",
    title: "Enrol your children in school",
    who: ["pr", "worker", "student"],
    timing: "As early as you can; it can take weeks",
    body:
      "School is required by law, and each province runs its own system. Contact your local school board to enrol. Children of a parent who is allowed to work or study in Canada can attend school without their own study permit. Whether school is free for temporary residents' children depends on the province and the board.",
    bring: ["Birth certificate or passport", "Proof of guardianship", "Proof of address", "Immunization record"],
    official: {
      label: "IRCC: Enrol your children in school",
      url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/settle-canada/education/enroll.html",
    },
    confidence: "medium",
  },
  {
    id: "settlement-services",
    phase: "month1",
    title: "Book free settlement services",
    who: ["pr"],
    timing: "Early; the time to use them is now limited",
    body:
      "Government-funded settlement agencies help with jobs, housing, forms, and language, at no cost. Permanent residents and protected persons can use them; most students and work permit holders cannot. Since April 1, 2026, economic-class permanent residents and their families can use them for 6 years after becoming a PR, and for 5 years from April 1, 2027.",
    official: {
      label: "IRCC: Find free newcomer services",
      url: "https://ircc.canada.ca/english/newcomers/services/index.asp",
    },
    guides: [{ label: "Our settlement partners in BC", href: "/partners" }],
    confidence: "high",
  },
  {
    id: "language",
    phase: "month1",
    title: "Book a free language assessment",
    who: ["pr"],
    timing: "Any time; book early",
    body:
      "Permanent residents and protected persons can take English or French classes at no cost. First book a language assessment at a newcomer organization; it places you in the right class on the Canadian Language Benchmarks. A level of 4 or higher can later meet the language requirement for citizenship.",
    official: {
      label: "IRCC: Free language classes",
      url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/settle-canada/language-skills/classes.html",
    },
    guides: [{ label: "Language for work programs", href: "/blog/language-for-work-programs-in-canada-beyond-linc-what-newcomers-actually-need" }],
    confidence: "high",
  },
  {
    id: "jobs-credentials",
    phase: "month1",
    title: "Check if your job is regulated, and start your job search",
    who: ["pr", "worker"],
    timing: "Start now; licensing can take months",
    body:
      "Some jobs, such as nursing, engineering, teaching, and many trades, need a Canadian licence before you can work in them. Find out now, because assessments take time. At the same time, rewrite your resume in the Canadian format and start building local experience.",
    official: {
      label: "Job Bank: Find a job as a newcomer",
      url: "https://www.jobbank.gc.ca/findajob/newcomers",
    },
    guides: [
      { label: "Licensing by profession", href: "/credentials" },
      { label: "Canadian resume format", href: "/canadian-resume" },
      { label: "No Canadian experience?", href: "/blog/how-to-find-a-job-in-canada-with-no-canadian-experience" },
    ],
    confidence: "high",
  },
  {
    id: "credit",
    phase: "month1",
    title: "Start your Canadian credit history",
    who: ["pr", "worker", "student"],
    timing: "First month",
    body:
      "Your credit history from another country usually does not follow you. Many newcomer bank packages include a credit card with no credit history. Use it for small purchases and pay the full balance every month; that builds the score landlords and lenders check.",
    official: {
      label: "FCAC: Credit reports and scores",
      url: "https://www.canada.ca/en/financial-consumer-agency/services/credit-reports-score.html",
    },
    guides: [{ label: "How to build credit as a newcomer", href: "/blog/how-to-build-credit-in-canada-as-a-newcomer" }],
    confidence: "high",
  },
  {
    id: "fraud",
    phase: "month1",
    title: "Learn the scams that target newcomers",
    who: ["pr", "worker", "student"],
    timing: "Always",
    body:
      "IRCC never asks you to pay with gift cards, prepaid credit cards, Western Union, or MoneyGram, never threatens arrest or deportation, and never contacts you from Gmail, Hotmail, Yahoo, or social media. The CRA never demands immediate payment by e-transfer, cryptocurrency, or gift cards. If someone does, hang up.",
    official: {
      label: "IRCC: Protect yourself from fraud",
      url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/protect-fraud/newcomers.html",
    },
    confidence: "high",
  },

  // First year
  {
    id: "tax-return",
    phase: "year1",
    title: "File your first tax return by April 30",
    who: ["pr", "worker", "student"],
    timing: "April 30 of the year after you arrive",
    body:
      "For most newcomers, tax residency starts the day you settle in Canada. File a return for your first year by April 30 of the next year (for example, arrived in 2026, file by April 30, 2027). Report your income from anywhere in the world from the date you became a resident. File even with no income, because the CRA uses your return to pay your benefits.",
    official: {
      label: "CRA: Your first tax return",
      url: "https://www.canada.ca/en/revenue-agency/services/tax/international-non-residents/individuals-leaving-entering-canada-non-residents/newcomers-canada-immigrants/completing-return-newcomers.html",
    },
    guides: [
      { label: "First tax return, step by step", href: "/blog/how-do-newcomers-file-their-first-tax-return-in-canada-step-by-step-guide" },
      { label: "The 90% rule for tax credits", href: "/blog/when-newcomers-can-claim-full-non-refundable-tax-credits-in-canada-the-90-rule-explained" },
    ],
    confidence: "high",
  },
  {
    id: "family-doctor",
    phase: "year1",
    title: "Register for a family doctor",
    who: ["pr", "worker", "student"],
    timing: "Once you have your health card",
    body:
      "Wait lists for a family doctor can be long, so join your province's registry as soon as your health card arrives. Until then, use walk-in clinics and your province's free health phone line (811 in most provinces) for advice that is not an emergency. For an emergency, call 911.",
    official: {
      label: "IRCC: Health care in Canada",
      url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/settle-canada/health-care.html",
    },
    guides: [{ label: "Finding a family doctor in BC", href: "/blog/how-to-find-a-family-doctor-in-bc-as-a-newcomer" }],
    confidence: "medium",
  },
];

export const CHECKLIST_FAQS: { q: string; a: string }[] = [
  {
    q: "What should I do first when I arrive in Canada?",
    a: "At the border, show your passport and your COPR (permanent residents) or port of entry letter (workers and students), declare CAN$10,000 or more, and check your permit for mistakes before you leave. In your first week, apply for your SIN and your provincial health card, open a bank account, and make sure IRCC has your Canadian address for your PR card.",
  },
  {
    q: "How soon after landing should I apply for a SIN?",
    a: "In your first week, and before you start work. Apply online, by mail, or in person at a Service Canada Centre, where you usually get the number during the visit if your documents are in order. Permanent residents can use a COPR up to 1 year after it was issued.",
  },
  {
    q: "How long does the PR card take after landing, and can I travel before it arrives?",
    a: "IRCC shows a current processing time of 35 days for a first card, plus up to 6 more weeks for delivery, and you cannot track it. Give your Canadian address within 180 days of becoming a permanent resident. To come back to Canada by plane, train, bus, or boat you need the card, so if you leave before it arrives, you must apply for a PR travel document to return.",
  },
  {
    q: "Can I get provincial health coverage right away?",
    a: "It depends on the province. Ontario, Alberta, Manitoba, New Brunswick, and Nova Scotia have no waiting period for most newcomers from abroad. British Columbia, Quebec (not for children under 18), and Saskatchewan have a wait of up to about 3 months. Apply the week you arrive and buy private insurance for any gap.",
  },
  {
    q: "Do I have to file a tax return in my first year?",
    a: "Yes. File a return for the year you arrived by April 30 of the next year, and report your world income from the date you became a resident. File even if you had no income, because the CRA uses the return to calculate your benefits.",
  },
  {
    q: "Are settlement services free, and who can use them?",
    a: "Yes. Government-funded settlement services are free for permanent residents, protected persons, and people in some programs such as the Atlantic Immigration Program. Most students and work permit holders are not eligible. Since April 1, 2026, economic-class permanent residents can use them for 6 years after becoming a PR, and for 5 years from April 1, 2027.",
  },
  {
    q: "Is this checklist different for students and workers?",
    a: "Yes, a little. Students and workers do the same first-week steps (SIN, bank account, health card where eligible, phone), but they do not get a PR card, and most cannot use government-funded settlement services or free language classes. Use the filter at the top of the checklist to see only your steps.",
  },
];
