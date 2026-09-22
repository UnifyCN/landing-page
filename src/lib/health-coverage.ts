// Provincial / territorial public health insurance for newcomers.
// Powers the /health-card hub + /health-card/[province] pages.
// Facts were checked against each plan's official page in September 2026
// (see `officialUrl` + `lastVerified` per entry). PEI's site blocks automated
// reads, so that entry is confirmed by three agreeing secondary sources and is
// flagged in its `notes`. When a rule changes, update the entry and the date.

export interface HealthFaq {
  q: string;
  a: string;
}

export interface HealthPlan {
  code: string;
  slug: string;
  name: string;
  /** Short form for pills, titles, and sibling nav. */
  shortName: string;
  planName: string;
  /** Abbreviation used in titles ("OHIP", "MSP"). */
  planShort: string;
  administeredBy: string;
  hasWait: boolean;
  /** Short label, e.g. "None" or "Up to 3 months". */
  waitingPeriod: string;
  /** Short phrase for the verdict box, e.g. "Day you arrive". */
  coverageStarts: string;
  /** Answer-first lead paragraph (HTML allowed). */
  lead: string;
  permanentResidents: string;
  workPermitHolders: string;
  internationalStudents: string;
  /** Hub table cells. Keep under ~8 words. */
  workPermitSummary: string;
  studentSummary: string;
  exemptions: string[];
  /** Ordered steps (HTML allowed). */
  howToApply: string[];
  documents: string[];
  /** HTML allowed. */
  interimAdvice: string;
  /** HTML allowed. */
  newcomerGuidance: string;
  changes?: string;
  officialUrl: string;
  officialLabel: string;
  lastVerified: string;
  relatedPost?: { slug: string; label: string };
  faqs: HealthFaq[];
}

const STUDENT_POST = {
  slug: "how-does-health-insurance-work-for-international-students-in-canada",
  label: "How health insurance works for international students in Canada",
};

export const HEALTH_PLANS: HealthPlan[] = [
  {
    code: "BC",
    slug: "british-columbia",
    name: "British Columbia",
    shortName: "BC",
    planName: "Medical Services Plan (MSP)",
    planShort: "MSP",
    administeredBy: "Health Insurance BC",
    hasWait: true,
    waitingPeriod: "Up to 3 months",
    coverageStarts: "1st of the 3rd month after arrival",
    lead:
      "New residents of BC wait <strong>the rest of the month you arrive, plus two more months</strong>, before MSP covers them. Apply the week you land: the wait runs from your arrival date, and the BC Services Card is ready when it ends.",
    permanentResidents:
      "Eligible. You must make BC your home and be physically in the province at least six months of the calendar year. Coverage starts after the wait.",
    workPermitHolders:
      "Eligible as a 'deemed resident' if the work permit is valid for six months or more, including Working Holiday permits. Same wait.",
    internationalStudents:
      "Eligible after the wait if the study permit is valid for six months or more. Study permit holders also pay BC's international student health fee of $75 a month.",
    workPermitSummary: "Yes, 6+ month permit",
    studentSummary: "Yes, after wait + $75/mo fee",
    exemptions: [
      "Ukrainians arriving under the CUAET program, and some returning Canadians and permanent residents.",
      "Babies born in BC to refugee-claimant parents covered by the federal Interim Federal Health Program.",
    ],
    howToApply: [
      "<strong>Enrol in MSP online</strong> through Health Insurance BC's Application for Health and Drug Coverage. You can also apply in person at a Service BC office or by mail.",
      "<strong>Get your BC Services Card</strong> at an ICBC driver licensing office once MSP confirms your enrolment. Bring two pieces of ID; they take your photo there.",
      "<strong>Mark the date</strong> your wait ends. Coverage starts on the first day of the third month after the month you arrived.",
    ],
    documents: [
      "Passport",
      "Permanent Resident Card, or your signed Confirmation of Permanent Residence, or a work or study permit valid for six months or more",
      "Proof of a BC address once you have one (lease, utility bill)",
    ],
    interimAdvice:
      "Buy private newcomer health insurance for the gap. A three-month plan costs far less than one emergency visit, and BC itself recommends it. Walk-in clinics and hospitals will treat you during the wait, but you pay the full bill.",
    newcomerGuidance:
      "The most common BC mistake is waiting to apply until the three months are up. The clock runs from arrival, not from your application, so a late application only extends the gap. Apply first, then find a family doctor through the Health Connect Registry while you wait.",
    officialUrl:
      "https://www2.gov.bc.ca/gov/content/health/health-drug-coverage/msp/bc-residents/eligibility-and-enrolment/how-to-enrol",
    officialLabel: "Health Insurance BC, how to enrol",
    lastVerified: "September 2026",
    relatedPost: {
      slug: "bc-msp-wait-period-for-newcomers-how-to-stay-covered-during-the-gap",
      label: "The BC MSP wait period: how to stay covered during the gap",
    },
    faqs: [
      {
        q: "How long is the MSP waiting period for newcomers to BC?",
        a: "The rest of the month you establish residence, plus two full months. If you arrive on March 10, MSP covers you from June 1. The wait starts on your arrival date, so apply as soon as you land.",
      },
      {
        q: "Are international students covered by MSP in BC?",
        a: "Yes, if the study permit is valid for six months or more. Coverage starts after the same wait, and study permit holders pay a separate international student health fee of $75 a month.",
      },
      {
        q: "What should I do if I get sick during the MSP wait?",
        a: "Go to a walk-in clinic or hospital; you will be treated but billed. Private newcomer insurance bought before you arrive, or in your first days, covers those bills.",
      },
    ],
  },
  {
    code: "AB",
    slug: "alberta",
    name: "Alberta",
    shortName: "Alberta",
    planName: "Alberta Health Care Insurance Plan (AHCIP)",
    planShort: "AHCIP",
    administeredBy: "Alberta Health",
    hasWait: false,
    waitingPeriod: "None if you apply within 3 months",
    coverageStarts: "Date you became a resident",
    lead:
      "Alberta covers newcomers from abroad <strong>from the date you established residency, with no waiting period, as long as you apply within three months of arriving</strong>. Apply late and Alberta sets your start date when it processes the form.",
    permanentResidents:
      "Eligible from your residency date. You must intend to live in Alberta for at least 12 months.",
    workPermitHolders:
      "Eligible if the permit is for an Alberta employer or location, has at least six months left before it expires, and you intend to stay in Alberta for 12 consecutive months.",
    internationalStudents:
      "Eligible with a study permit of 12 months or more for an Alberta institution, or a permit of 6 to 12 months plus a letter confirming enrolment and intent to stay 12 months. Full-time enrolment letter required.",
    workPermitSummary: "Yes, 6+ months left on permit",
    studentSummary: "Yes, 12-month permit",
    exemptions: [],
    howToApply: [
      "<strong>Complete the AHCIP application form</strong> (Alberta Health Care Insurance Plan application) before you visit.",
      "<strong>Go to a registry agent office in person</strong> with the form and your original documents. Registry agents are the private offices that also handle driver's licences.",
      "<strong>Watch the mail.</strong> Alberta Health mails the card; processing takes up to five business days.",
    ],
    documents: [
      "Proof of identity: passport, PR card, or driver's licence",
      "Proof of legal entitlement to be in Canada: PR card or Confirmation of Permanent Residence, or a work or study permit",
      "Proof of an Alberta address: lease, utility bill, Alberta driver's licence, or vehicle registration",
    ],
    interimAdvice:
      "You are covered from your residency date once the application is approved, so the main risk is a late application. If you were treated between arrival and approval, keep the receipts; claims may be reimbursed for the covered period.",
    newcomerGuidance:
      "Alberta is one of the easiest provinces for health coverage. Apply in your first week, and do not confuse the interprovincial rule (first day of the third month) with the rule for arrivals from outside Canada; it does not apply to you. Refugee claimants are not eligible for AHCIP and use the federal interim program instead.",
    officialUrl: "https://www.alberta.ca/ahcip-moving-to-alberta",
    officialLabel: "Alberta.ca, moving to Alberta",
    lastVerified: "September 2026",
    relatedPost: STUDENT_POST,
    faqs: [
      {
        q: "Is there a waiting period for Alberta health care for new immigrants?",
        a: "No, not if you apply within three months of establishing residency. Coverage is backdated to the date you became an Alberta resident. If you apply after three months, Alberta decides the start date when it processes your application.",
      },
      {
        q: "Can I get AHCIP on a work permit?",
        a: "Yes. The permit must be for an Alberta employer or location, must have at least six months remaining, and you must intend to live in Alberta for 12 consecutive months.",
      },
      {
        q: "Where do I apply for an Alberta health card?",
        a: "In person at any registry agent office with the completed form and original identity, status, and address documents. There is no general online application.",
      },
    ],
  },
  {
    code: "SK",
    slug: "saskatchewan",
    name: "Saskatchewan",
    shortName: "Saskatchewan",
    planName: "Saskatchewan Health Services Card",
    planShort: "Sask Health",
    administeredBy: "eHealth Saskatchewan",
    hasWait: true,
    waitingPeriod: "Up to 3 months",
    coverageStarts: "By the 1st of the 3rd month after arrival",
    lead:
      "Newcomers to Saskatchewan from outside Canada qualify for coverage <strong>on or before the first day of the third month after arriving in Canada</strong>. Apply on arrival so the card is ready when that date comes.",
    permanentResidents:
      "Eligible. You must live in Saskatchewan, plan to stay, and be physically present at least five months a year.",
    workPermitHolders:
      "Eligible with a valid work permit as a person allowed to live in Canada temporarily for work. The official page states no minimum permit length.",
    internationalStudents:
      "Eligible with a valid study permit and proof of full-time enrolment at an accredited institution.",
    workPermitSummary: "Yes, valid permit",
    studentSummary: "Yes, full-time",
    exemptions: ["Refugee claimants are not eligible and use the federal Interim Federal Health Program."],
    howToApply: [
      "<strong>Apply online</strong> through a Saskatchewan Account at services.saskatchewan.ca. This is the fastest route.",
      "<strong>Or mail or drop off</strong> the paper Health Card Application to eHealth Saskatchewan, 1901 Scarth Street, Regina.",
      "<strong>Allow four to five weeks.</strong> eHealth was working through a backlog in late summer 2026; apply early.",
    ],
    documents: [
      "Proof you can legally be in Canada: PR card or Confirmation of Permanent Residence, passport, or work or study permit",
      "Proof you live in Saskatchewan: lease, utility bill, or employer letter",
      "Students: proof of full-time enrolment",
    ],
    interimAdvice:
      "Private newcomer insurance for the first three months is the safe choice. Some employers' group plans start on day one; ask HR before you buy.",
    newcomerGuidance:
      "Saskatchewan's rule reads 'on or before' the first day of the third month, and in practice many newcomers are covered from that date. Apply the week you arrive, keep the confirmation email, and use walk-in clinics with your private insurance until the card comes.",
    officialUrl: "https://www.ehealthsask.ca/residents/health-cards/Pages/Apply-for-a-Health-Card.aspx",
    officialLabel: "eHealth Saskatchewan, apply for a health card",
    lastVerified: "September 2026",
    relatedPost: STUDENT_POST,
    faqs: [
      {
        q: "How long do newcomers wait for a Saskatchewan health card?",
        a: "Up to three months. Arrivals from outside Canada qualify on or before the first day of the third month after arriving in Canada. Processing itself takes another four to five weeks, so apply on arrival.",
      },
      {
        q: "Do international students get Saskatchewan health coverage?",
        a: "Yes. A valid study permit plus proof of full-time enrolment at an accredited institution qualifies you, after the same wait.",
      },
    ],
  },
  {
    code: "MB",
    slug: "manitoba",
    name: "Manitoba",
    shortName: "Manitoba",
    planName: "Manitoba Health",
    planShort: "Manitoba Health",
    administeredBy: "Manitoba Health, Seniors and Long-Term Care",
    hasWait: false,
    waitingPeriod: "None",
    coverageStarts: "Date you arrive",
    lead:
      "Permanent residents arriving in Manitoba from outside Canada can be covered <strong>from the date of arrival, with no waiting period</strong>. Work permit holders are covered from the date the permit was issued. The three-month rule you may have read about applies only to people moving from another province.",
    permanentResidents: "Eligible from the date you arrive in Manitoba.",
    workPermitHolders:
      "Eligible with a work permit of at least 12 consecutive months, from the permit's issue date. A spouse or minor children on the same permit need status valid for at least six months.",
    internationalStudents:
      "Not eligible. Since September 1, 2018, study permit holders are excluded from Manitoba Health and use the plan offered by their school.",
    workPermitSummary: "Yes, 12+ month permit",
    studentSummary: "No (school plan)",
    exemptions: [],
    howToApply: [
      "<strong>Register online</strong> at healthcardweb.manitoba.ca and upload copies of your documents.",
      "<strong>Use a public access computer</strong> at a listed library or service centre if you do not have one.",
      "<strong>Wait about two weeks</strong> for the registration certificate to arrive by mail.",
    ],
    documents: [
      "Copy of your passport",
      "All your IRCC documents: PR card or Confirmation of Permanent Residence, or a work permit valid 12 months or more",
      "Proof of a Manitoba address",
    ],
    interimAdvice:
      "Coverage is backdated to your arrival date, so an early application means no gap. Convention refugees and protected persons can apply after a positive decision from the Immigration and Refugee Board.",
    newcomerGuidance:
      "Manitoba is generous on timing but strict on permits: a work permit shorter than 12 months does not qualify, and no study permit does. If you are a student, buy your school's plan before you arrive. If you are on a short work permit, private insurance is your only option until you extend it.",
    officialUrl: "https://www.gov.mb.ca/health/mhsip/movingtomanitoba.html",
    officialLabel: "Manitoba Health, moving to Manitoba",
    lastVerified: "September 2026",
    relatedPost: STUDENT_POST,
    faqs: [
      {
        q: "Is there a waiting period for Manitoba Health for new immigrants?",
        a: "No. Canadian citizens and permanent residents arriving from outside Canada may apply for coverage from the date of arrival. The 'first day of the third month' rule applies to moves from another province, not to international arrivals.",
      },
      {
        q: "Can international students get a Manitoba health card?",
        a: "No. Study permit holders have been excluded from Manitoba Health since September 1, 2018. Universities and colleges provide a mandatory student plan instead.",
      },
    ],
  },
  {
    code: "ON",
    slug: "ontario",
    name: "Ontario",
    shortName: "Ontario",
    planName: "Ontario Health Insurance Plan (OHIP)",
    planShort: "OHIP",
    administeredBy: "Ontario Ministry of Health",
    hasWait: false,
    waitingPeriod: "None",
    coverageStarts: "Immediately if eligible",
    lead:
      "Ontario removed its three-month wait in 2020. <strong>Eligible newcomers get OHIP coverage immediately</strong>, from the day they apply at a ServiceOntario centre. The catch is eligibility: permanent residents qualify, work permit holders need a full-time job of six months or more, and study permit holders do not qualify at all.",
    permanentResidents:
      "Eligible immediately. Make Ontario your primary home and be present at least 153 days in any 12-month period; you can apply on arrival.",
    workPermitHolders:
      "Eligible if you hold a valid work permit and work full-time in Ontario for an Ontario employer for at least six months. Bring an employer letter on letterhead. Spouses and dependants of eligible workers may also qualify.",
    internationalStudents:
      "Not eligible on a study permit alone. University students are enrolled in UHIP (the University Health Insurance Plan); college students use their institution's plan.",
    workPermitSummary: "Yes, 6+ month full-time job",
    studentSummary: "No (UHIP)",
    exemptions: [
      "Protected persons and convention refugees, and some refugee claimants who hold a work permit, may be eligible.",
    ],
    howToApply: [
      "<strong>Gather three original documents</strong>: one proving OHIP-eligible status, one proving Ontario residency, one proving identity. Ontario's list is strict; check it before you go.",
      "<strong>Visit a ServiceOntario centre in person.</strong> There is no online application. Some centres take appointments online.",
      "<strong>Leave with a temporary document</strong> and receive the photo health card by mail.",
    ],
    documents: [
      "Status: PR card, Confirmation of Permanent Residence (IMM 5292 or IMM 5688), or work permit plus an employer letter",
      "Residency: lease, utility bill, or bank statement showing an Ontario address",
      "Identity: passport or another listed photo ID",
    ],
    interimAdvice:
      "There is no waiting period, but you are not covered until you apply and are accepted. Book the ServiceOntario visit in your first days. If you arrive on a work permit and your employer letter is not ready yet, buy short private coverage until it is.",
    newcomerGuidance:
      "Ontario's rule surprises people in both directions: newcomers expect a wait that no longer exists, and students expect coverage that does not exist. If you are on a study permit, your UHIP or college plan is your public-style coverage, and it starts on your enrolment date.",
    changes: "The three-month waiting period was abolished in March 2020 and has not returned.",
    officialUrl: "https://www.ontario.ca/page/apply-ohip-and-get-health-card",
    officialLabel: "Ontario.ca, apply for OHIP",
    lastVerified: "September 2026",
    relatedPost: STUDENT_POST,
    faqs: [
      {
        q: "Is there still a 3-month waiting period for OHIP?",
        a: "No. Ontario states that there is no longer a waiting period; eligible applicants have immediate coverage. The wait was removed in March 2020.",
      },
      {
        q: "Can I get OHIP on a work permit?",
        a: "Yes, if you work full-time in Ontario, for an Ontario employer, for at least six months. Bring a letter from the employer on letterhead that confirms this.",
      },
      {
        q: "Are international students eligible for OHIP?",
        a: "No. A study permit is not an OHIP-eligible document. University students are covered by UHIP; college students by their institution's plan.",
      },
    ],
  },
  {
    code: "QC",
    slug: "quebec",
    name: "Quebec",
    shortName: "Quebec",
    planName: "Régie de l'assurance maladie du Québec (RAMQ)",
    planShort: "RAMQ",
    administeredBy: "RAMQ",
    hasWait: true,
    waitingPeriod: "Up to 3 months",
    coverageStarts: "After up to 3 months from registration",
    lead:
      "Most newcomers to Quebec wait <strong>up to three months from the date they register with RAMQ</strong>. Children under 18 skip the wait, and so do arrivals from the 11 countries with a social security agreement with Quebec. Registration itself is mostly online.",
    permanentResidents:
      "Eligible as a person settled in Quebec: your main residence is in Quebec and you are present 183 days or more a year. Standard wait applies.",
    workPermitHolders:
      "Eligible as a person temporarily staying if your work permit is valid for more than six months and you are not absent more than 21 consecutive days. Standard wait applies.",
    internationalStudents:
      "Eligible only if you come from one of the social security agreement countries, or you hold a fellowship from Quebec's education ministry. All other students must buy the institution's private plan.",
    workPermitSummary: "Yes, permit over 6 months",
    studentSummary: "Only agreement countries",
    exemptions: [
      "Citizens of the 11 agreement countries: Belgium, Denmark, Finland, France, Greece, Luxembourg, Norway, Portugal, Romania, Serbia, and Sweden. Get a certificate of coverage from your home plan before you leave.",
      "Children under 18.",
      "Refugees and protected persons.",
      "Recipients of last-resort financial assistance, and fellowship recipients from the education ministry.",
      "Seasonal and primary agricultural stream workers from Mexico, Guatemala, Honduras, or El Salvador.",
    ],
    howToApply: [
      "<strong>Start the online registration</strong> on ramq.gouv.qc.ca; the wizard tells you if your situation needs a phone call instead.",
      "<strong>Submit one form per person</strong>: the adult form for you, the child form for each minor.",
      "<strong>Send missing documents within 12 months</strong> of registering. Your wait starts on the registration date only if you are in Quebec and hold all required documents.",
    ],
    documents: [
      "Immigration document: PR card or Confirmation of Permanent Residence, work permit, or study permit with a CAQ",
      "Passport",
      "Proof of a Quebec address",
      "Agreement countries: the certificate of coverage from your home plan",
      "Certified translation of any document not in French or English",
    ],
    interimAdvice:
      "Buy private coverage for the wait. Even during the wait RAMQ covers pregnancy and childbirth care, care related to domestic violence, and treatment of infectious diseases. If you are from an agreement country, the certificate of coverage is worth a phone call home before you fly: it removes the wait entirely.",
    newcomerGuidance:
      "Quebec is the province where your passport matters most. French citizens, for example, skip the wait and, as students, get RAMQ; students from India or Nigeria do not. Register in your first week with all your documents in hand, because the clock starts at registration, not arrival.",
    officialUrl: "https://www.ramq.gouv.qc.ca/en/citizens/health-insurance/know-eligibility-conditions",
    officialLabel: "RAMQ, eligibility conditions",
    lastVerified: "September 2026",
    relatedPost: STUDENT_POST,
    faqs: [
      {
        q: "How long is the RAMQ waiting period for newcomers?",
        a: "Up to three months, counted from the date you register with all required documents while in Quebec. Children under 18 and people from the 11 social security agreement countries are exempt.",
      },
      {
        q: "Which countries have a health agreement with Quebec?",
        a: "Belgium, Denmark, Finland, France, Greece, Luxembourg, Norway, Portugal, Romania, Serbia, and Sweden. You need a certificate of coverage from your home plan, issued before departure.",
      },
      {
        q: "Are international students covered by RAMQ?",
        a: "Only students from the agreement countries and Quebec education ministry fellowship recipients. Everyone else must buy their institution's mandatory private plan.",
      },
    ],
  },
  {
    code: "NB",
    slug: "new-brunswick",
    name: "New Brunswick",
    shortName: "New Brunswick",
    planName: "New Brunswick Medicare",
    planShort: "NB Medicare",
    administeredBy: "NB Department of Health",
    hasWait: false,
    waitingPeriod: "None",
    coverageStarts: "First day of arrival",
    lead:
      "Newcomers who make New Brunswick their permanent home <strong>may be covered from their first day of arrival, with no waiting period</strong>. Permanent residents, work permit holders, and full-time international students all qualify.",
    permanentResidents:
      "Eligible from arrival if New Brunswick is your permanent and principal home.",
    workPermitHolders:
      "Eligible with a valid work permit if New Brunswick is your permanent and principal home. No minimum permit length is stated; coverage ends when the permit expires.",
    internationalStudents:
      "Eligible with a study permit plus proof of enrolment as a full-time post-secondary student for a full academic year. An acceptance letter alone is not accepted.",
    workPermitSummary: "Yes, valid permit",
    studentSummary: "Yes, full academic year",
    exemptions: [],
    howToApply: [
      "<strong>Apply online</strong> through the Medicare application on gnb.ca (MyHealthNB), or download the PDF form.",
      "<strong>Or deliver the form</strong> by mail, email, or at a Service New Brunswick office.",
      "<strong>Keep the acknowledgement.</strong> It is your proof of pending coverage while the card is printed.",
    ],
    documents: [
      "Status in Canada: Confirmation of Permanent Residence, PR card (both sides), or your valid permit",
      "Passport, including the page with your most recent entry stamp",
      "Proof of a New Brunswick address: lease, utility bill, employer letter, or NB driver's licence",
      "Students: proof of full-year enrolment",
    ],
    interimAdvice:
      "Coverage is effective from arrival once the Director confirms you have established permanent residence, so apply early with complete documents. Keep receipts for any care before the card arrives.",
    newcomerGuidance:
      "New Brunswick is one of the friendliest provinces for newcomer coverage, including for students. The one trap is the interprovincial rule: if you first landed in another province and later moved to NB, your old province covers you until the first day of the third month, and you should tell Medicare that.",
    officialUrl:
      "https://www2.gnb.ca/content/gnb/en/departments/health/DrugPlans/content/medicare/ApplyingforaCard.html",
    officialLabel: "GNB, applying for a Medicare card",
    lastVerified: "September 2026",
    relatedPost: STUDENT_POST,
    faqs: [
      {
        q: "Is there a waiting period for New Brunswick Medicare for newcomers?",
        a: "No. Newcomers arriving from another country may be covered from their first day of arrival if they meet the eligibility requirements and have established a permanent residence in New Brunswick.",
      },
      {
        q: "Do international students get NB Medicare?",
        a: "Yes, with a study permit and proof of full-time enrolment for a full academic year. Coverage ends on the permit's expiry date.",
      },
    ],
  },
  {
    code: "NS",
    slug: "nova-scotia",
    name: "Nova Scotia",
    shortName: "Nova Scotia",
    planName: "Nova Scotia Health Insurance Program (MSI)",
    planShort: "MSI",
    administeredBy: "MSI Resident Services",
    hasWait: false,
    waitingPeriod: "None for PRs and workers",
    coverageStarts: "Date you become a resident",
    lead:
      "Permanent residents arriving from outside Canada are covered by MSI <strong>from the date they become Nova Scotia residents</strong>. Work permit holders (12-month permits) are covered from arrival or the permit's issue date, whichever is later. <strong>International students wait 12 months.</strong>",
    permanentResidents:
      "Eligible from your residency date. You must be present in Nova Scotia 183 days a year.",
    workPermitHolders:
      "Eligible if the work permit or Nova Scotia employment contract is for 12 months or more, from the later of your arrival date and the permit's issue date.",
    internationalStudents:
      "Eligible only with a study permit of 12 months or more, and only from the first day of the 13th month after arrival. Students employed as teaching or research assistants at a Nova Scotia university skip the wait.",
    workPermitSummary: "Yes, 12+ month permit",
    studentSummary: "After 12 months",
    exemptions: [
      "Military families moving with the Canadian Armed Forces.",
      "Convention refugees and persons in need of protection, with proof of a PR application.",
    ],
    howToApply: [
      "<strong>Fill in the Registration for Health Services form</strong> (PDF) from the MSI site.",
      "<strong>Submit the online contact form</strong>, then upload the form and documents through the link MSI emails you within 24 hours. Mail, fax, or the secure drop box also work; there is no walk-in counter.",
      "<strong>Allow about four weeks</strong> for the card to arrive by mail.",
    ],
    documents: [
      "Proof you are legally entitled to remain in Canada: PR card or Confirmation of Permanent Residence, or a work or study permit of 12 months or more, plus passport",
      "Proof of your current civic address in Nova Scotia",
    ],
    interimAdvice:
      "Coverage starts on your residency date once approved, so there is no true gap for permanent residents and 12-month workers. Students face a full year without MSI; your university's health plan is your coverage for that year.",
    newcomerGuidance:
      "Nova Scotia's 12-month student wait is the strictest in Canada, so international students should budget for the university plan and any dependants. Workers should check the permit length before signing: an 11-month contract does not qualify.",
    changes: "In April 2026 Nova Scotia announced a new online service for MSI and Pharmacare applications.",
    officialUrl: "https://www.novascotia.ca/healthcare-coverage-if-you-move-nova-scotia-health-card",
    officialLabel: "Nova Scotia, health coverage if you move",
    lastVerified: "September 2026",
    relatedPost: STUDENT_POST,
    faqs: [
      {
        q: "Is there a waiting period for a Nova Scotia health card for new immigrants?",
        a: "Not for permanent residents arriving from outside Canada; coverage usually starts on the date you become a resident. People moving from another province wait until the first day of the third month.",
      },
      {
        q: "Do international students get MSI in Nova Scotia?",
        a: "Only with a study permit of 12 months or more, and only from the first day of the 13th month after arrival. Teaching and research assistants at a Nova Scotia university are exempt from the wait.",
      },
    ],
  },
  {
    code: "PE",
    slug: "prince-edward-island",
    name: "Prince Edward Island",
    shortName: "PEI",
    planName: "PEI Hospital and Medical Services Plan",
    planShort: "PEI Health Card",
    administeredBy: "Health PEI, Medicare Services",
    hasWait: false,
    waitingPeriod: "None for PRs",
    coverageStarts: "First day of residency",
    lead:
      "Permanent residents arriving on PEI from outside Canada are eligible <strong>from the first day they become residents</strong>. Work permit holders with permits of 183 days or more get a temporary card once a complete application is received.",
    permanentResidents:
      "Eligible from your residency date. You must live on PEI at least six months and one day a year.",
    workPermitHolders:
      "Eligible if the work permit is valid for at least 183 days; a temporary card is issued for the length of the permit.",
    internationalStudents:
      "Eligible only if the study permit allows off-campus work. Submit the study permit, passport, and an enrolment letter. Otherwise, use your institution's plan.",
    workPermitSummary: "Yes, 183+ day permit",
    studentSummary: "Only if permit allows work",
    exemptions: [],
    howToApply: [
      "<strong>Apply online</strong> through eServices PEI (PEI Health Card Application for New Residents).",
      "<strong>Or mail the form</strong> to PEI Medicare in Montague, or visit an Access PEI centre.",
      "<strong>Allow up to eight weeks.</strong> The acknowledgement letter is your proof of pending coverage.",
    ],
    documents: [
      "PR card (both sides) or Confirmation of Permanent Residence, or a work permit, or a study permit plus enrolment letter",
      "Passport",
      "Proof of a PEI address: lease or utility bill",
    ],
    interimAdvice:
      "Processing can take eight weeks, so apply in your first days and keep the acknowledgement letter with you; clinics accept it as proof that coverage is pending.",
    newcomerGuidance:
      "PEI's rules are simple for permanent residents and workers. Students should check the off-campus work condition on their permit before assuming coverage. PEI's website blocks automated checks, so this entry was confirmed against three independent guides; call Medicare Services at 1-800-321-5492 if your situation is unusual.",
    officialUrl: "https://www.princeedwardisland.ca/en/service/apply-for-pei-health-card-new-residents",
    officialLabel: "Prince Edward Island, apply for a PEI health card",
    lastVerified: "September 2026",
    relatedPost: STUDENT_POST,
    faqs: [
      {
        q: "Is there a waiting period for a PEI health card for newcomers?",
        a: "Not for permanent residents arriving from outside Canada; you are eligible from the first day you become a resident. Moves from another province wait until the first day of the third month.",
      },
      {
        q: "How long does a PEI health card take?",
        a: "Up to eight weeks. The acknowledgement letter Medicare Services sends serves as proof of pending coverage in the meantime.",
      },
    ],
  },
  {
    code: "NL",
    slug: "newfoundland-and-labrador",
    name: "Newfoundland and Labrador",
    shortName: "Newfoundland",
    planName: "Medical Care Plan (MCP)",
    planShort: "MCP",
    administeredBy: "NL Health and Community Services",
    hasWait: false,
    waitingPeriod: "None published",
    coverageStarts: "Arrival, or job start for workers",
    lead:
      "Newfoundland and Labrador publishes <strong>no waiting period for newcomers from outside Canada</strong>. Permanent residents register on arrival. International workers are covered from the later of their arrival date and the start of full-time work; students from their arrival or approval date.",
    permanentResidents:
      "Eligible; register with your PR card or Confirmation of Permanent Residence. The first registration is valid for one year, then up to five years.",
    workPermitHolders:
      "Eligible with a work permit valid for at least 12 months plus an employer letter confirming full-time work of 12 months or more in the province. Six months is enough for Provincial Nominee and Atlantic Immigration Program participants; any length for international health care workers.",
    internationalStudents:
      "Eligible with a study permit valid for at least 12 months for a full-time degree program at Memorial University, a program of 365 days or more at College of the North Atlantic, or a registered private institution. An institution letter is required.",
    workPermitSummary: "Yes, 12+ month permit (6 for PNP/AIP)",
    studentSummary: "Yes, 12-month permit",
    exemptions: ["Ukrainians under CUAET or the special family reunification stream register with visa and passport."],
    howToApply: [
      "<strong>Complete the Application for Newfoundland and Labrador Health Care Coverage</strong> form.",
      "<strong>Send it by mail, email, or fax</strong>, or use the 24-hour drop slot at the MCP office in St. John's or Grand Falls-Windsor. There is no walk-in service.",
      "<strong>Allow 10 to 14 days</strong> for processing.",
    ],
    documents: [
      "PR card (both sides) or Confirmation of Permanent Residence; or work permit plus an employer letter dated within 30 days; or study permit plus institution letter",
      "Unexpired foreign passport identity pages",
      "Proof of intent to remain: lease, employment letter, or utility bill",
    ],
    interimAdvice:
      "Permanent residents still waiting for IRCC documents can ask MCP about interim coverage. Immigration medical exams are not covered by MCP; budget for that separately.",
    newcomerGuidance:
      "Newfoundland ties worker coverage to a 12-month full-time job, so get the employer letter before you apply and make sure it is dated within 30 days. Refugee claimants are not eligible for MCP.",
    officialUrl: "https://www.gov.nl.ca/hcs/mcp/",
    officialLabel: "NL Medical Care Plan",
    lastVerified: "September 2026",
    relatedPost: STUDENT_POST,
    faqs: [
      {
        q: "Is there a waiting period for MCP in Newfoundland for newcomers?",
        a: "None is published for arrivals from outside Canada. Workers are covered from the later of arrival and the start of full-time employment; permanent residents register on arrival.",
      },
      {
        q: "Can international students get MCP?",
        a: "Yes, with a study permit of 12 months or more for a full-time degree at Memorial University, a program of 365 days or more at College of the North Atlantic, or a registered private institution, plus a letter from the institution.",
      },
    ],
  },
  {
    code: "YT",
    slug: "yukon",
    name: "Yukon",
    shortName: "Yukon",
    planName: "Yukon Health Care Insurance Plan (YHCIP)",
    planShort: "YHCIP",
    administeredBy: "Yukon Insured Health Services",
    hasWait: true,
    waitingPeriod: "3 months",
    coverageStarts: "3 months after arrival",
    lead:
      "New Yukon residents <strong>wait three months for coverage to start</strong>. Apply when you arrive: delays in applying can push your eligibility date later.",
    permanentResidents:
      "Eligible after the three-month wait. You must make Yukon your permanent home and not be absent for more than six months.",
    workPermitHolders:
      "Eligible with an open work permit, or a Yukon employer-specific permit, valid for at least one year. The wait may vary with the permit's issue date and your arrival date.",
    internationalStudents: "Not eligible. Yukon does not accept applications from people on a study or tourist visa.",
    workPermitSummary: "Yes, 1+ year permit",
    studentSummary: "No",
    exemptions: ["Refugee-status holders may be eligible; call Insured Health Services at 867-667-5209."],
    howToApply: [
      "<strong>Apply in person</strong> at Insured Health Services, 4th floor, 204 Lambert Street, Whitehorse. Rural residents can get forms from a Territorial Agent.",
      "<strong>Apply on arrival.</strong> You do not need to have lived in Yukon for three months first.",
      "<strong>Expect the card</strong> once the three-month wait ends.",
    ],
    documents: [
      "PR card, or a work permit valid one year or more (Canadians: birth certificate or citizenship card)",
      "A second piece of ID",
      "Proof of residency: utility bill, Yukon pay stub or offer letter, or a signed one-year lease",
    ],
    interimAdvice:
      "Buy private newcomer insurance for the three months. Whitehorse General Hospital treats everyone, but bills the uninsured.",
    newcomerGuidance:
      "Yukon has a fixed three-month wait and no student coverage at all, so students should arrange private insurance before arriving. Workers on permits shorter than a year do not qualify either.",
    officialUrl: "https://yukon.ca/en/health-and-wellness/care-services/apply-health-care-card",
    officialLabel: "Yukon.ca, apply for a health care card",
    lastVerified: "September 2026",
    faqs: [
      {
        q: "How long is the waiting period for Yukon health care?",
        a: "Three months for new and returning residents. Apply when you arrive because delays can affect your eligibility date.",
      },
      {
        q: "Can international students get Yukon health coverage?",
        a: "No. People on a study or tourist visa cannot apply to the Yukon Health Care Insurance Plan.",
      },
    ],
  },
  {
    code: "NT",
    slug: "northwest-territories",
    name: "Northwest Territories",
    shortName: "NWT",
    planName: "NWT Health Care Plan",
    planShort: "NWT Health Care Plan",
    administeredBy: "NWT Health Services Administration",
    hasWait: true,
    waitingPeriod: "Up to 3 months (confirm)",
    coverageStarts: "1st of the 3rd month (published for interprovincial moves)",
    lead:
      "The NWT publishes a waiting period only for people moving from another province: <strong>coverage starts on the first day of the third month after you become a resident</strong>. For arrivals from outside Canada on a work or study permit, the plan asks you to contact its office directly, so treat three months as the planning assumption and call to confirm.",
    permanentResidents:
      "Eligible if you are lawfully entitled to remain in Canada, your home is in the NWT, and you are physically present 153 days or more a year.",
    workPermitHolders:
      "Case by case. The plan asks work permit holders to contact the Health Services Administration Office; no minimum permit length is published.",
    internationalStudents:
      "Case by case. A study permit plus confirmation of enrolment is accepted as proof of legal status; contact the office.",
    workPermitSummary: "Case by case (call)",
    studentSummary: "Case by case (call)",
    exemptions: ["Military families moving with the Canadian Armed Forces skip the wait."],
    howToApply: [
      "<strong>Apply online</strong> through NWT eServices, or email the form to healthcarecard@gov.nt.ca, or mail it to Health Services Administration in Inuvik.",
      "<strong>Call 1-800-661-0830</strong> if you are on a work or study permit; the office confirms your eligibility and start date.",
      "<strong>Provide two proofs of address.</strong> A driver's licence is not accepted as one of them.",
    ],
    documents: [
      "One proof of legal right to be in Canada: passport, PR card, or work or study permit",
      "Two documents showing your name and current NWT address: lease, utility bill, or pay stub",
    ],
    interimAdvice:
      "Assume a three-month gap and buy private coverage until the office confirms your start date. Many NWT employers, including the territorial government, provide group benefits from day one; ask before you buy.",
    newcomerGuidance:
      "The NWT is the one jurisdiction where you cannot read the rule online for international arrivals. A single phone call to the Inuvik office, made in your first week, settles it and starts the paperwork.",
    officialUrl: "https://www.hss.gov.nt.ca/en/services/nwt-health-care-plan/general-information-residents",
    officialLabel: "NWT Health and Social Services, general information for residents",
    lastVerified: "September 2026",
    faqs: [
      {
        q: "Is there a waiting period for the NWT Health Care Plan?",
        a: "For moves from another province, coverage starts on the first day of the third month after you become a resident. For arrivals from outside Canada on a permit, the plan asks you to contact the Health Services Administration Office; plan for three months and confirm.",
      },
      {
        q: "Who do I contact about NWT health coverage on a work permit?",
        a: "The Health Services Administration Office in Inuvik at 1-800-661-0830 or healthcarecard@gov.nt.ca.",
      },
    ],
  },
  {
    code: "NU",
    slug: "nunavut",
    name: "Nunavut",
    shortName: "Nunavut",
    planName: "Nunavut Health Care Plan (NHCP)",
    planShort: "NHCP",
    administeredBy: "Nunavut Health Insurance Programs",
    hasWait: false,
    waitingPeriod: "None published",
    coverageStarts: "When your application is approved",
    lead:
      "Nunavut publishes <strong>no waiting period</strong>. Coverage starts when the Health Insurance Programs Office approves your application. Eligibility turns on one thing: a permit of one year or more that shows a Nunavut address.",
    permanentResidents: "Eligible if Nunavut is your primary residence and you intend to stay more than 12 months.",
    workPermitHolders:
      "Eligible with a work permit valid for one year or more that shows a Nunavut address. Rotational or contract workers under one year are not eligible.",
    internationalStudents:
      "Eligible with a study permit valid for one year or more and a Nunavut address. Students whose permanent residence is elsewhere are not eligible.",
    workPermitSummary: "Yes, 1+ year, Nunavut address",
    studentSummary: "Yes, 1+ year, Nunavut address",
    exemptions: [],
    howToApply: [
      "<strong>Complete the Application for Nunavut Health Care Coverage</strong>; forms are at community health centres, Qikiqtani General Hospital, and the Rankin Inlet office.",
      "<strong>Email it with document copies</strong> to nhip@gov.nu.ca, or mail it to Box 889, Rankin Inlet. Toll-free 1-800-661-0833.",
      "<strong>Wait for the eligibility letter.</strong> Coverage begins on approval.",
    ],
    documents: [
      "Two pieces of ID, one of which must be a birth certificate, valid passport, or valid immigration document",
      "Proof of residency showing intent to live in Nunavut for more than 12 months: employer letter or job contract showing the term",
    ],
    interimAdvice:
      "Because coverage starts at approval, apply before or on the day you arrive if you can. Most Nunavut employers fly-in staff with group benefits; confirm what starts on day one.",
    newcomerGuidance:
      "Nunavut is simple if your permit is a year or longer and names a Nunavut address, and closed if it is not. Short contracts do not qualify, so contract workers need private coverage for the full term.",
    officialUrl: "https://www.gov.nu.ca/en/health/applying-health-care",
    officialLabel: "Government of Nunavut, applying for health care",
    lastVerified: "September 2026",
    faqs: [
      {
        q: "Is there a waiting period for Nunavut health care?",
        a: "None is published. Coverage starts when the Health Insurance Programs Office approves your application, so apply as early as you can.",
      },
      {
        q: "Can I get Nunavut health coverage on a one-year work contract?",
        a: "Yes, if the permit is valid for one year or more and shows a Nunavut address. Contracts under one year, and rotational workers who live elsewhere, are not eligible.",
      },
    ],
  },
];

export const getHealthPlan = (slug: string): HealthPlan | undefined =>
  HEALTH_PLANS.find((p) => p.slug === slug);

// Hub-level FAQ (targets "health card waiting period canada", "which provinces have no waiting period").
export const HEALTH_HUB_FAQS: HealthFaq[] = [
  {
    q: "Which provinces have no waiting period for health coverage for newcomers?",
    a: "Ontario, Alberta (if you apply within three months of arrival), Manitoba, New Brunswick, Nova Scotia (for permanent residents and 12-month workers), Prince Edward Island, Newfoundland and Labrador, and Nunavut cover eligible newcomers with no published waiting period. British Columbia, Saskatchewan, Quebec, Yukon, and the Northwest Territories make most new arrivals wait up to about three months.",
  },
  {
    q: "Does the 3-month waiting period start when I arrive or when I apply?",
    a: "It depends on the province. In BC, Saskatchewan, and Yukon it runs from the date you establish residency, so a late application only extends the gap. In Quebec it runs from the date you register with all required documents. Apply in your first week everywhere.",
  },
  {
    q: "Are international students covered by provincial health insurance?",
    a: "Sometimes. BC, Alberta, Saskatchewan, New Brunswick, Newfoundland and Labrador, and Nunavut cover students who meet permit-length rules. Ontario, Manitoba, and Yukon do not; Quebec covers only students from its social security agreement countries; Nova Scotia covers students after a 12-month wait.",
  },
  {
    q: "What do I do for health care during the waiting period?",
    a: "Buy private newcomer or visitor health insurance for the gap, ideally before you fly. Clinics and hospitals will treat you but bill you the full cost. Some employer plans start on day one; ask HR before buying.",
  },
];
