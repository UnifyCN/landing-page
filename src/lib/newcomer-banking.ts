// Content for the /banking pillar guide (how to open a bank account as a newcomer).
// Rules come from FCAC (the Bank Act access-to-banking rules, ss. 627.17-627.24, which
// replaced the Access to Basic Banking Services Regulations in 2022), CDIC, and CRA; each
// bank's row comes from that bank's own newcomer page. Checked September 2026.
// Bank offers change often: re-check each row against its `url` and update
// BANKING_LAST_VERIFIED. RBC is a Unify partner, so every bank keeps the same fields.
// Cash bonuses are left out on purpose: they expire every few weeks.

export interface BankOffer {
  slug: string;
  bank: string;
  program: string;
  url: string;
  whoQualifies: string | null;
  arrivalWindow: string | null;
  /** Short, for the comparison table. */
  feeWaiver: string | null;
  feeWaiverDetail: string | null;
  creditCard: string | null;
  openBeforeArrival: string | null;
  students: string | null;
  otherPerks: string[];
  confidence: "high" | "medium" | "low";
}

export interface BankingRule {
  text: string;
  source: string;
  short?: string;
}

export const BANKING_LAST_VERIFIED = "September 2026";

/** Answer-first lead paragraph (HTML allowed). */
export const BANKING_LEAD = "Bring your passport and your immigration document (PR card or confirmation of PR, or your work or study permit). <strong>A bank must open a basic account for you even with no job, no deposit, and no credit history</strong>, and since December 2025 the six largest banks must offer newcomers a no-cost account in their first year in Canada. You do not need a SIN to open an account, but you must give it for an account that earns interest.";

export const BANKING_DOCUMENTS: string[] = [
  "Your passport. A foreign passport is on the federal list of ID a bank must accept.",
  "Your immigration document from IRCC: PR card or Confirmation of Permanent Residence, or your work permit or study permit.",
  "Proof of your Canadian address if you have it, such as a recent utility bill. If you just arrived, ask the bank what it accepts.",
  "Your SIN, only for an account that earns interest (a savings account, TFSA, or GIC).",
  "For a newcomer offer or the first-year no-cost account: proof of when you arrived. Your immigration document usually shows it.",
];

export const BANKING_RULES: Record<
  "rightToAccount" | "idRequirements" | "sinRule" | "lowCostAccounts" | "chequeHold" | "depositInsurance" | "creditHistory",
  BankingRule
> = {
  rightToAccount: {
    text: "You have the right to open a personal bank account at a bank, a federal credit union, or an authorized foreign bank, even if you do not have a job, do not have money to deposit right away, or have been bankrupt. The bank cannot ask for a minimum opening deposit or a minimum balance. A bank can refuse only if it has reasonable grounds to believe the account will be used for illegal or fraudulent purposes, you have a history of fraud with financial service providers in the last 7 years, you knowingly gave false information, it must protect its customers or staff from harm or harassment, the branch only offers accounts linked to an account at another institution, you do not let it verify your ID, or (at a federal credit union) you do not agree to become a member. If a bank refuses, it must tell you in writing and give you its complaint procedure plus contact details for OBSI and FCAC.",
    source: "https://www.canada.ca/en/financial-consumer-agency/services/banking/opening-bank-account.html",
  },
  idRequirements: {
    text: "A bank must accept either of 2 options, and you must show original documents, not photocopies. Option 1: 2 documents from a reliable source, one with your name and address and one with your name and date of birth, from this list: ID issued by the Government of Canada or a province, recent tax assessment notices, recent government benefit statements, recent Canadian utility bills, recent bank or credit card statements, or a foreign passport. Option 2: 1 document with your name and date of birth, if a customer in good standing with the bank or a person of good standing in the community also confirms who you are. If the bank has reasonable grounds to suspect you misrepresent your identity, it can also ask for 1 federal or provincial photo ID that shows your signature.",
    source: "https://www.canada.ca/en/financial-consumer-agency/services/banking/opening-bank-account.html",
  },
  sinRule: {
    text: "No federal rule lists a SIN as ID you need to open an account, and the Government of Canada says a SIN card or SIN letter is not an identity document. The law requires you to give your SIN to a financial institution for accounts that earn income such as interest or dividends, because the institution reports that income for tax purposes.",
    source: "https://www.canada.ca/en/employment-social-development/services/sin/protection.html",
    short: "Not to open an account",
  },
  lowCostAccounts: {
    text: "Since December 1, 2025, banks that signed FCAC's modernized Commitment on Low-Cost and No-Cost Accounts must offer anyone a low-cost chequing account for no more than $4.00 per month, with at least 18 debit transactions per month (for example, 12 core transactions plus 6 more) and no minimum balance. The $4.00 fee is waived (no-cost account) for youth aged 18 and under, students, seniors who receive the Guaranteed Income Supplement, RDSP beneficiaries, and newcomers in their first year in Canada (permanent residents, protected persons, and temporary residents such as students, workers, and temporary resident permit holders); each bank must also add 1 optional group (Indigenous peoples, people on select provincial or territorial social assistance, or Disability Tax Credit recipients). 14 institutions signed, including Canada's 6 largest banks, and you may need to show documents to prove you qualify.",
    source: "https://www.canada.ca/en/financial-consumer-agency/news/2025/11/canadians-can-now-access-free-and-low-cost-bank-accounts-featuring-more-monthly-transactions.html",
  },
  chequeHold: {
    text: "For a paper Canadian-dollar cheque drawn on a Canadian branch, a federally regulated institution can hold the funds for at most 4 business days (in person) or 5 (ATM or mobile) if the cheque is $1,500 or less, and 7 or 8 business days if it is more than $1,500; it must give you the first $100 (or the full cheque, if it is $100 or less) immediately in person or on the next business day by other methods. These limits may not apply if your account has been open for less than 90 days, and foreign cheques are often held for 30 days.",
    source: "https://www.canada.ca/en/financial-consumer-agency/services/banking/cashing-cheques.html",
  },
  depositInsurance: {
    text: "CDIC insures eligible deposits, in Canadian or foreign currency, at each member institution for free and automatically, up to $100,000 (principal and interest) in each category, such as deposits in one name, joint deposits, TFSAs, RRSPs, and FHSAs.",
    source: "https://www.cdic.ca/your-coverage/whats-covered/",
  },
  creditHistory: {
    text: "Canada's 2 main credit bureaus, Equifax and TransUnion, only collect information about your credit activity in Canada, so you start with little or no Canadian credit history; some lenders may look at a credit report from another country if you bring it and meet a bank officer. To start, you can use a secured credit card (you pay a deposit up front) or a student card, become an authorized user, or get a co-signer, and you must ask if the lender reports to Equifax and TransUnion, because an account that is not reported does not build your history.",
    source: "https://www.canada.ca/en/financial-consumer-agency/services/credit-reports-score/credit-report-score-basics.html",
  },
};

export const BANK_OFFERS: BankOffer[] = [
  {
    slug: "rbc",
    bank: "RBC Royal Bank",
    program: "RBC Newcomer Advantage",
    url: "https://www.rbcroyalbank.com/new-to-canada/",
    whoQualifies: "Newcomers who arrived in Canada in the last 5 years, live in Canada, are of age of majority, and have no RBC personal banking account.",
    arrivalWindow: "Arrived in the last 5 years",
    feeWaiver: "No monthly fee on RBC Advantage Banking for 12 months",
    feeWaiverDetail: "RBC waives the monthly fee on RBC Advantage Banking for the first 12 months. After that, the fee is $12.95 per month.",
    creditCard: "No credit history needed; limit up to $15,000, based on income",
    openBeforeArrival: "Yes, online from eligible countries; activate at a branch after landing",
    students: "RBC Advantage Banking for Students: no monthly fee for full-time students. Card limit up to $2,000, no credit history.",
    otherPerks: [
      "$0 transfer fee on RBC International Money Transfers",
      "Pre-arrival account: transfer up to $75,000 before landing",
      "Support in up to 200 languages",
    ],
    confidence: "high",
  },
  {
    slug: "td",
    bank: "TD Canada Trust",
    program: "TD New to Canada Banking Package",
    url: "https://www.td.com/ca/en/personal-banking/solutions/new-to-canada",
    whoQualifies: "Permanent residents, international students, or temporary residents in Canada 5 years or less, with proof of status. Never held a TD chequing account.",
    arrivalWindow: "In Canada 5 years or less",
    feeWaiver: "No monthly fee on TD Unlimited Chequing for 12 months",
    feeWaiverDetail: "TD rebates the monthly fee on a new TD Unlimited Chequing Account for the first 12 months ($17.95 per month in TD's value calculation). After that, the regular monthly fee applies unless you keep the minimum monthly balance.",
    creditCard: "Up to $15,000 limit without Canadian credit history, after full credit review",
    openBeforeArrival: "From China or India by phone; activate in branch within 75 days",
    students: "TD International Student Banking Package: $0 monthly fee student chequing and $150 cash. Offer ends Nov 2, 2026.",
    otherPerks: [
      "No TD Global Transfer fees for up to 12 months",
      "4% bonus savings interest for 90 days",
      "Support in over 80 languages",
    ],
    confidence: "high",
  },
  {
    slug: "scotiabank",
    bank: "Scotiabank",
    program: "Scotiabank StartRight Program",
    url: "https://startright.scotiabank.com/ca/en.html",
    whoQualifies: "Permanent residents in Canada 5 years or less, international students, and foreign workers. You must show documents to register as a newcomer.",
    arrivalWindow: "Permanent residents: in Canada 5 years or less",
    feeWaiver: "No monthly fee on Preferred Package chequing for 12 months",
    feeWaiverDetail: "Scotiabank waives the $16.95 monthly fee on a new Preferred Package for the first 12 months. After that, the fee applies unless you keep a $4,000 minimum daily closing balance. Not available if you held a Scotiabank chequing account in the last 2 years.",
    creditCard: "No Canadian credit history needed; limit up to $15,000, subject to approval",
    openBeforeArrival: "Yes: open an International Account online, transfer up to $50,000 CAD",
    students: "Student chequing with no monthly fee. Scene+ Visa limit up to $5,000, no credit history needed.",
    otherPerks: [
      "Unlimited no-fee international money transfers (StartRight)",
      "10 free Scotia iTRADE equity trades",
      "Nova Credit: use home credit history for higher limit",
    ],
    confidence: "high",
  },
  {
    slug: "bmo",
    bank: "BMO",
    program: "BMO NewStart Program",
    url: "https://www.bmo.com/en-ca/main/personal/newcomers-to-canada/newcomer-bank-account-offers/",
    whoQualifies: "Permanent residents and foreign workers who got status in the last 5 years, at the age of majority. Proof: PR card, confirmation of PR, or work permit.",
    arrivalWindow: "Status received in the last 5 years",
    feeWaiver: "No monthly plan fee for 2 years",
    feeWaiverDetail: "BMO waives the monthly bank plan fee for 24 months under the NewStart Program (BMO values the plan at $17.95 a month). The offer page does not say what applies after 24 months.",
    creditCard: "No Canadian credit history needed, subject to approval; secured card otherwise",
    openBeforeArrival: "Yes, online from qualifying countries; send up to $75,000 before you move",
    students: "International students from qualifying countries can open an account and a GIC before they arrive.",
    otherPerks: [
      "No-fee BMO Global Money Transfer",
      "$60 bonus when you rent a safety deposit box",
      "Walmart+ membership for up to 12 months",
    ],
    confidence: "medium",
  },
  {
    slug: "cibc",
    bank: "CIBC",
    program: "CIBC Smart Account for Newcomers",
    url: "https://www.cibc.com/en/special-offers/newcomers.html",
    whoQualifies: "Permanent residents with status received in the last 5 years, or foreign workers with a work permit of at least 12 months. Age 25 or over.",
    arrivalWindow: "Permanent residents: status received in the last 5 years. No arrival limit stated for foreign workers.",
    feeWaiver: "No monthly fee on the Smart Account for 2 years",
    feeWaiverDetail: "The $16.95 monthly fee on the CIBC Smart Account for Newcomers is rebated for 2 years. After that the fee is $16.95 per month, or $0 if you keep a $4,000 minimum daily balance.",
    creditCard: "Yes, no credit history or deposit needed; limit up to $15,000",
    openBeforeArrival: "Yes, CIBC Smart Arrival, up to 12 months before, eligible countries",
    students: "International students get the Best Student Life Bundle. CIBC Smart Start has no monthly fee until age 25.",
    otherPerks: [
      "$0 fee transfers to 130+ countries (Global Money Transfer)",
      "Free Costco Gold Star membership, open by November 16, 2026",
      "Unlimited transactions and free Interac e-Transfers",
    ],
    confidence: "high",
  },
  {
    slug: "national-bank",
    bank: "National Bank of Canada",
    program: "Newcomers Privilege Offer (bank account for newcomers)",
    url: "https://www.nbc.ca/personal/accounts/newcomers.html",
    whoQualifies: "Age 18 or over, permanent or temporary resident with a valid work or study permit, in Canada 5 years or less.",
    arrivalWindow: "Arrived in the last 5 years, or arriving within 90 days",
    feeWaiver: "No monthly fee in year 1; years 2 and 3 conditional",
    feeWaiverDetail: "Year 1 has no flat monthly fee (normally $15.95). Years 2 and 3 cost $7.98 and $11.96 per month, or $0 with a $4,500 minimum daily balance or a credit card plus e-statements plus payroll deposit or 2 bill payments; in year 4 the account moves to The Connected package.",
    creditCard: null,
    openBeforeArrival: "Yes, online form up to 90 days before; finish in branch",
    students: "Same newcomer offer applies to international students; no separate newcomer student offer.",
    otherPerks: [
      "12 months free legal advice by phone (FBA Solutions)",
      "Online international transfers, $5.95 per transfer",
      "First cheque order free",
    ],
    confidence: "high",
  },
  {
    slug: "desjardins",
    bank: "Desjardins",
    program: "Everyday account offer for newcomers to Canada",
    url: "https://www.desjardins.com/en/offers/newcomers-canada.html",
    whoQualifies: "Age 25 or over, permanent resident or work permit valid over 8 months, in Canada 3 years or less, new member.",
    arrivalWindow: "Lived in Canada 3 years or less",
    feeWaiver: "Free Unlimited plan on everyday account for 2 years",
    feeWaiverDetail: "The Unlimited plan (unlimited regular transactions) is free for 2 years for newcomers aged 25 or over. After that the $15.95 monthly fee applies, or $0 if you keep a $4,000 minimum balance for the whole month.",
    creditCard: null,
    openBeforeArrival: "Yes, online form from abroad; finish at a caisse within 12 months",
    students: "Ages 18 to 24, or 25 to 30 full-time students in Canada, keep the free plan while eligible.",
    otherPerks: [
      "2 years free legal information service by phone",
      "One incoming wire transfer before arrival (fees apply)",
      "Free Interac e-Transfers in the Unlimited plan",
    ],
    confidence: "high",
  },
];

export const BANKING_BY_STATUS: { status: string; text: string; source: string }[] = [
  {
    status: "Permanent resident",
    text: "The same right to an account and the same ID rules apply to you as to a Canadian citizen, and a federal ID document counts as one of your 2 documents. In your first year in Canada, you qualify for a no-cost account at banks that signed the low-cost commitment.",
    source: "https://www.canada.ca/en/financial-consumer-agency/services/industry/laws-regulations/low-cost-no-cost-accounts.html",
  },
  {
    status: "Work permit holder",
    text: "IRCC tells temporary residents to bring their IMM 1442 document (here, the work permit) and their passport to open an account. Workers with temporary resident status count as newcomers for the no-cost account in their first year in Canada.",
    source: "https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/ukraine-measures/settlement/welcome-canada/finances-assistance.html",
  },
  {
    status: "International student",
    text: "IRCC lists the study permit (IMM 1442) together with your passport as the documents to open an account. You qualify for a no-cost account both as a student and, in your first year, as a newcomer at banks that signed the low-cost commitment.",
    source: "https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/ukraine-measures/settlement/welcome-canada/finances-assistance.html",
  },
  {
    status: "Visitor or non-resident",
    text: "FCAC says you may be able to open a bank account in Canada with the proper ID even if you are not a Canadian citizen or you live in another country, but you may need to go to the bank in person. The bank will ask you to certify whether you are a non-resident of Canada for tax reporting, and it can report the account to the CRA, which can share the information with your country of tax residence.",
    source: "https://www.canada.ca/en/financial-consumer-agency/services/banking/opening-bank-account.html",
  },
  {
    status: "US citizen",
    text: "A US citizen can open an account with the same ID rules, but under the Canada-US tax agreement (FATCA) the bank will ask you to certify whether you are a US citizen and to show documents that support what you declare; it reports accounts of US citizens to the CRA, which sends the information to the IRS. The agreement does not change your US filing duties, which include annual US tax returns and the FBAR.",
    source: "https://www.canada.ca/en/revenue-agency/services/tax/international-non-residents/enhanced-financial-account-information-reporting/information-individuals-holding-accounts-canadian-financial-institutions.html",
  },
];

export const ONLINE_BANKS: { name: string; url: string; acceptsNewcomers: string; source: string }[] = [
  {
    name: "Simplii Financial",
    url: "https://www.simplii.com/en/banking-simplii/join-simplii/new-to-canada.html",
    acceptsNewcomers: "Apply online after you arrive, if arrived in the last 5 years. Needs passport and selfie; debit card mailed to Canadian address.",
    source: "https://www.simplii.com/en/banking-simplii/join-simplii/new-to-canada.html",
  },
  {
    name: "Tangerine",
    url: "https://www.tangerine.ca/en/personal/spend/chequing-account",
    acceptsNewcomers: "Photo ID list: Canadian driver's licence, provincial ID, Canadian passport or PR card. May ask for proof of Canadian address.",
    source: "https://www.tangerine.ca/en/faq/what-identification-documents-id-do-i-need-to-become-a-tangerine-client",
  },
  {
    name: "EQ Bank",
    url: "https://www.eqbank.ca/personal-banking/personal-account",
    acceptsNewcomers: "Must be a Canadian resident, age of majority, have a SIN and a Canadian mobile number.",
    source: "https://www.eqbank.ca/about-us/help/common-questions",
  },
];

export const BANKING_FAQS: { q: string; a: string }[] = [
  {
    q: "Can I open a bank account in Canada without a SIN?",
    a: "Yes. The federal ID rules for a personal account do not list a SIN, and the Government of Canada says a SIN is not an identity document. But the law requires you to give your SIN for accounts that earn interest or dividends, because the bank must report that income for tax. Ask the bank which of its accounts need a SIN before you apply.",
  },
  {
    q: "What ID do I need to open a bank account in Canada as a newcomer?",
    a: "Bring original documents. A bank must accept 2 documents: one with your name and address and one with your name and date of birth, such as a foreign passport, ID issued by the federal or a provincial government, your IRCC IMM 1442 permit, a utility bill, or a bank statement. Or bring 1 document if a trusted customer or community member confirms who you are.",
  },
  {
    q: "Can a bank refuse to open an account for me?",
    a: "A bank can refuse only for specific reasons: it suspects fraud or illegal use, you had fraud with a financial provider in the last 7 years, you gave false information, it must protect people from harm, or you will not let it verify your ID. Having no job, no money to deposit, or a past bankruptcy is not a reason. A refusal must be in writing.",
  },
  {
    q: "Are there free bank accounts for newcomers in Canada?",
    a: "Yes. Since December 1, 2025, the 14 banks that signed FCAC's low-cost commitment, including the 6 largest, must offer a no-cost account to newcomers in their first year in Canada. This includes permanent residents, protected persons, and temporary residents such as students and workers. Everyone else can get a low-cost account for at most $4 per month.",
  },
  {
    q: "How long can a Canadian bank hold my cheque?",
    a: "For a Canadian-dollar cheque from a Canadian bank, the maximum hold is 4 to 8 business days, depending on the amount and how you deposit it. You get the first $100 right away in person, or the next business day at an ATM or by phone. These limits may not apply if your account is less than 90 days old.",
  },
];
