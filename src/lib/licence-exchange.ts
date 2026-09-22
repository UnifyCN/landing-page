// Foreign driver's licence exchange rules for newcomers, by province/territory.
// Powers the /drivers-licence hub + /drivers-licence/[province] pages.
// Facts were checked against each licensing authority's official page in
// September 2026 (see `officialUrl` + `lastVerified`). Quebec (SAAQ) and PEI
// block automated reads; those entries are corroborated by the Quebec regulation
// index / SAAQ brochure and by three agreeing PEI sources, and say so in
// `newcomerGuidance`. Reciprocal lists change often; update the list and the date.

export interface LicenceFaq {
  q: string;
  a: string;
}

export interface ReciprocalCountry {
  name: string;
  /** Class restriction or paperwork quirk. Omit when it is a plain full exchange. */
  note?: string;
}

export interface LicenceRule {
  code: string;
  slug: string;
  name: string;
  shortName: string;
  /** Short authority name for titles and tables ("ICBC"). */
  authority: string;
  /** Short grace period label ("90 days"). */
  gracePeriod: string;
  /** Answer-first lead (HTML allowed). */
  lead: string;
  reciprocalCountries: ReciprocalCountry[];
  /** Hub table cell, under ~8 words. */
  nonReciprocalSummary: string;
  /** Ordered steps for drivers from non-agreement countries (HTML allowed). */
  nonReciprocalSteps: string[];
  experienceCredit?: string;
  documents: string[];
  fees?: string;
  /** HTML allowed. */
  newcomerGuidance: string;
  changes?: string;
  officialUrl: string;
  officialLabel: string;
  lastVerified: string;
  relatedPost?: { slug: string; label: string };
  faqs: LicenceFaq[];
}

const US: ReciprocalCountry = { name: "United States (all states)" };
const c = (name: string, note?: string): ReciprocalCountry => (note ? { name, note } : { name });

// The 26 EU/EEA-style additions that Saskatchewan (2023), Manitoba (2024) and
// Alberta share. Notes are added per province where classes differ.
const EU_BLOCK = [
  "Austria", "Belgium", "Bulgaria", "Croatia", "Cyprus", "Czech Republic", "Denmark", "Estonia",
  "Finland", "France", "Germany", "Greece", "Hungary", "Iceland", "Italy", "Latvia",
  "Liechtenstein", "Lithuania", "Luxembourg", "Malta", "Netherlands", "Norway", "Poland",
  "Portugal", "Romania", "Slovakia", "Slovenia", "Spain", "Sweden",
];

export const LICENCE_RULES: LicenceRule[] = [
  {
    code: "BC",
    slug: "british-columbia",
    name: "British Columbia",
    shortName: "BC",
    authority: "ICBC",
    gracePeriod: "90 days",
    lead:
      "You can drive in BC on a valid foreign licence for <strong>90 days after you move here</strong>. Licences from the US and 14 other jurisdictions swap directly at an ICBC office. Everyone else takes a knowledge test and a road test, and <strong>two years of proven experience lets you skip the graduated licensing program</strong> and go straight to the Class 5 test.",
    reciprocalCountries: [
      c("United States (all states, DC, Puerto Rico)", "Passenger and motorcycle"),
      c("Australia"), c("Austria"), c("Belgium"), c("France"), c("Germany"),
      c("Guernsey, Isle of Man, Jersey"), c("Ireland"), c("Japan"),
      c("Netherlands", "Excludes the former Antilles territories"),
      c("New Zealand"),
      c("South Korea", "Passenger only, not motorcycles"),
      c("Switzerland"),
      c("Taiwan", "Passenger only; needs the red-seal Verification Certificate plus a TECO Vancouver translation"),
      c("United Kingdom", "England, Wales, Scotland, Northern Ireland"),
    ],
    nonReciprocalSummary: "Knowledge + road test; 2 yrs skips GLP",
    nonReciprocalSteps: [
      "<strong>Pass the knowledge test</strong> (from June 2026 you can take it online at home; offered in 12 languages) and a vision screening at a driver licensing office. You surrender all foreign licences.",
      "<strong>Prove your experience.</strong> Your original licence with a first-issue date, or a driver record or letter of experience from your home authority, decides which road test you take.",
      "<strong>Take the road test.</strong> With two or more years of full-privilege experience you book the Class 5 test directly. With less you enter the Graduated Licensing Program as a Class 7 novice.",
    ],
    experienceCredit:
      "Two years of non-learner driving, proven with your licence or an official record, exempts you from the Graduated Licensing Program. ICBC also credits up to 15 years of experience toward insurance discounts.",
    documents: [
      "Primary ID (your IRCC immigration document counts) and secondary ID",
      "Current foreign driver's licence, which you surrender",
      "Proof of driving experience: the licence showing the first-issue date, or an original driver record or letter from the licensing authority",
      "Translation only when ICBC asks for one, and only by an ICBC-approved translator",
    ],
    fees: "Knowledge test $15 per attempt; Class 5 road test $50; first two-year licence $31; five-year licence $75.",
    newcomerGuidance:
      "Get the letter of experience from your home licensing authority before you fly. It is the single document that separates a two-week exchange from a two-year graduated program, and it is much harder to obtain from Canada. Book the road test early; Lower Mainland wait times run for weeks.",
    changes:
      "June 9, 2026: knowledge tests moved online. October 19, 2026: the Graduated Licensing Program drops its second road test in favour of a driving record assessment.",
    officialUrl: "https://www.icbc.com/driver-licensing/moving-bc/moving-from-another-country",
    officialLabel: "ICBC, moving from another country",
    lastVerified: "September 2026",
    relatedPost: {
      slug: "bc-drivers-license-for-newcomers-icbc-exchange-guide",
      label: "BC driver's licence for newcomers: the full ICBC exchange guide",
    },
    faqs: [
      {
        q: "How long can I drive in BC on a foreign licence?",
        a: "90 days after you move to BC. Tourists can drive up to six months, and full-time students with a valid exemption longer. After 90 days as a resident you need a BC licence.",
      },
      {
        q: "Which countries can exchange a licence in BC without a road test?",
        a: "The United States, Australia, Austria, Belgium, France, Germany, Guernsey, Isle of Man, Jersey, Ireland, Japan, the Netherlands, New Zealand, South Korea (passenger only), Switzerland, Taiwan (passenger only), and the United Kingdom.",
      },
      {
        q: "Do I have to do BC's graduated licensing program as a newcomer?",
        a: "Not if you can prove at least two years of full-privilege driving experience with your licence or an official driver record. Then you take the Class 5 road test directly. Without that proof you start as a Class 7 novice.",
      },
    ],
  },
  {
    code: "AB",
    slug: "alberta",
    name: "Alberta",
    shortName: "Alberta",
    authority: "Alberta registries",
    gracePeriod: "90 days",
    lead:
      "New Alberta residents have <strong>90 days</strong> to exchange a foreign licence at a registry agent. The US, most of Europe, and a dozen other countries swap directly with only a vision test. Everyone else passes the Class 7 knowledge test, then applies for a <strong>GDL exemption</strong> with proof of experience so they can take the full Class 5 road test.",
    reciprocalCountries: [
      c("United States (all states)", "Classes 5, 6 and 7"),
      c("Australia", "Class 5 and 6"), c("Isle of Man", "Class 5 and 6"), c("Ireland", "Class 5 and 6"),
      c("Switzerland", "Class 5 and 6"), c("Northern Ireland", "Class 5 and 6"),
      ...EU_BLOCK.map((n) => c(n, "Class 5")),
      c("Guernsey", "Class 5"), c("Jersey", "Class 5"), c("Japan", "Class 5"), c("New Zealand", "Class 5"),
      c("South Korea", "Class 5"), c("Taiwan", "Class 5"),
      c("United Kingdom (England, Scotland, Wales)", "Class 5"),
      c("Ukraine", "Categories B and BE only; vision test required"),
    ],
    nonReciprocalSummary: "Knowledge test, then GDL exemption + road test",
    nonReciprocalSteps: [
      "<strong>Pass the Class 7 knowledge test</strong> and vision screening at any registry agent. You surrender all foreign licences and receive a Class 7 learner licence.",
      "<strong>Apply for a GDL exemption</strong> with your foreign licence and a driving record or confirmation letter from the issuing authority, translated by an Alberta-approved translator if needed. Verification takes about 10 business days.",
      "<strong>Take the road test.</strong> Approved with two or more years of experience, you take the Class 5 non-GDL (advanced) road test with no learner wait. With less experience you take the basic test and enter Class 5-GDL with credit for time held.",
    ],
    experienceCredit:
      "Two or more years as a fully licensed driver, confirmed by the GDL exemption review, unlocks the advanced Class 5 road test and skips the two-year GDL period.",
    documents: [
      "Original proof of legal presence in Canada and of Alberta residency",
      "Foreign driver's licence",
      "Proof of the date you were first licensed, or a driving history letter",
      "Written translation of every non-English document by an Alberta Approved Document Translator",
    ],
    fees: "Set by each registry agent and published online; a provincial licence fee plus the agent's service charge, with test fees extra.",
    newcomerGuidance:
      "Alberta's list is one of the longest in Canada, so check it before assuming you need tests. If you do need the GDL exemption, request the driving record from your home authority before you leave; the exemption cannot be approved without it, and the 90-day clock keeps running while you wait.",
    officialUrl: "https://www.alberta.ca/exchange-non-alberta-licences",
    officialLabel: "Alberta.ca, exchange a non-Alberta licence",
    lastVerified: "September 2026",
    faqs: [
      {
        q: "How long can a newcomer drive in Alberta on a foreign licence?",
        a: "90 days after becoming an Alberta resident, even if you travel outside Alberta in that time. After that you need an Alberta licence.",
      },
      {
        q: "Which countries have a driver's licence exchange with Alberta?",
        a: "The United States, Australia, Ireland, Switzerland, the Isle of Man, Northern Ireland, most EU and EEA countries, Guernsey, Jersey, Japan, New Zealand, South Korea, Taiwan, the rest of the United Kingdom, and Ukraine for categories B and BE. Most exchanges are Class 5 only.",
      },
      {
        q: "What is Alberta's GDL exemption for newcomers?",
        a: "A review of your foreign driving history. With two or more years of full licensing you can skip the learner stage and take the advanced Class 5 road test; with less you get credit for the time you held your licence.",
      },
    ],
  },
  {
    code: "SK",
    slug: "saskatchewan",
    name: "Saskatchewan",
    shortName: "Saskatchewan",
    authority: "SGI",
    gracePeriod: "90 days",
    lead:
      "Newcomers to Saskatchewan can drive on a foreign licence for <strong>90 days</strong>. SGI exchanges licences from the US and 40 other jurisdictions for a Class 5 with no tests. Drivers from other countries take knowledge, vision, and road tests, but <strong>proof of experience waives the nine-month learner period and the training requirement</strong>.",
    reciprocalCountries: [
      US, c("Australia"),
      ...EU_BLOCK.map((n) => c(n === "Czech Republic" ? "Czechia" : n)),
      c("Isle of Man"), c("Japan"), c("Jersey"), c("New Zealand"), c("Ireland"),
      c("South Korea", "Licences from Seoul, Gangwon, Gyeonggi, Chungcheong North and South, Gyeongsang North, and Jeolla North and South only"),
      c("Switzerland"), c("Taiwan"), c("Ukraine"), c("United Kingdom"),
    ],
    nonReciprocalSummary: "Knowledge + vision + road; experience waives learner wait",
    nonReciprocalSteps: [
      "<strong>Pass the knowledge tests</strong> (rules and signs) and a vision test at a motor licence issuer.",
      "<strong>Show your experience.</strong> A valid licence in English or French, or a translated one, waives the nine-month Class 7 learner period and the mandatory driver training.",
      "<strong>Book the Class 5 road test</strong> directly once the knowledge test is passed.",
    ],
    experienceCredit:
      "Any proven past driving experience waives the learner period and training. SGI may also honour a licence from an unlisted country case by case; call 1-844-855-2744.",
    documents: [
      "Proof of identity, Saskatchewan residency, and entitlement to be in Canada",
      "Foreign licence, plus a driver's abstract or record dated within 30 days for exchanges",
      "Translation acceptable to SGI if not in English or French; an International Driving Permit is accepted as a translation",
    ],
    newcomerGuidance:
      "Saskatchewan added 24 European countries in 2023, so older guides understate the list. Bring a driver's abstract dated within 30 days: it is required for an exchange and it is what gets the learner period waived if you must test.",
    changes: "September 2023: reciprocity extended to 24 more European countries, 41 jurisdictions in total.",
    officialUrl: "https://sgi.sk.ca/handbook/-/knowledge_base/drivers/saskatchewan-driver-s-licence-program",
    officialLabel: "SGI, Saskatchewan driver's licence program",
    lastVerified: "September 2026",
    faqs: [
      {
        q: "How long can I drive in Saskatchewan with a foreign licence?",
        a: "90 days after moving to Saskatchewan. After that you need a Saskatchewan licence.",
      },
      {
        q: "Do experienced newcomers have to do Saskatchewan's graduated licensing?",
        a: "Not the waiting part. SGI waives the nine-month learner period and the driver training when you prove past experience with a valid licence, so you can book the road test after passing the knowledge test.",
      },
    ],
  },
  {
    code: "MB",
    slug: "manitoba",
    name: "Manitoba",
    shortName: "Manitoba",
    authority: "MPI",
    gracePeriod: "3 months",
    lead:
      "A foreign licence is valid in Manitoba for <strong>three months after you move</strong>. Manitoba Public Insurance exchanges licences from the US and 40 other jurisdictions with a vision test only. Others take a knowledge test, vision test, and road test.",
    reciprocalCountries: [
      c("United States and territories", "Class 5 and 6; commercial classes if the licence is a CDL"),
      c("Australia", "Class 5 and 6; driver licence report dated within 90 days"),
      c("Austria", "Class 5"), c("Germany", "Class 5"), c("France", "Class 5"),
      c("Ireland", "Class 5 and 6"), c("Isle of Man", "Class 5 and 6"), c("Japan", "Class 5 and 6"),
      c("Northern Ireland", "Class 5 and 6"),
      c("South Korea", "Class 5; Certificate of Driver's Licence from the National Police Agency required"),
      c("Switzerland", "Class 5 and 6"),
      c("Taiwan", "Class 5; TECO Toronto translation plus Verification Certificate required"),
      c("United Kingdom", "Class 5 and 6"),
      ...EU_BLOCK.filter((n) => !["Austria", "Germany", "France"].includes(n)).map((n) => c(n, "Class 5 and 6")),
      c("Ukraine", "Class 5 only; category B including BE"),
    ],
    nonReciprocalSummary: "Knowledge + vision + road test",
    nonReciprocalSteps: [
      "<strong>Pass the knowledge test</strong> and vision test at an MPI Service Centre (Autopac brokers cannot do the vision test).",
      "<strong>Take the road test</strong> and bring your original foreign licence to it.",
      "<strong>Enter the Class 5 stages.</strong> An expired or invalid foreign licence means starting the full Graduated Driver Licensing program instead.",
    ],
    documents: [
      "Valid original foreign licence and identity documents that meet MPI's identity rules",
      "Translation of the licence and driving record if not in English or French, by an ATIM-certified translator, the Immigrant Centre or Accueil francophone, a Manitoba notary, or an embassy. International Driving Permits and online translations are not accepted",
      "Driving record for exchanges",
    ],
    fees: "Licence exchange $75; knowledge test $12; road test $35.",
    newcomerGuidance:
      "Manitoba is strict about translations: an International Driving Permit does not count. Book a certified translation in your first week so the three-month window does not run out while you wait.",
    changes: "December 2, 2024: 26 European countries added to the exchange list.",
    officialUrl: "https://www.mpi.mb.ca/countries-eligible-for-drivers-licence-exchange-in-manitoba/",
    officialLabel: "MPI, countries eligible for licence exchange",
    lastVerified: "September 2026",
    faqs: [
      {
        q: "How long can I drive in Manitoba on my foreign licence?",
        a: "Three months after moving to Manitoba. After that you need a Manitoba licence.",
      },
      {
        q: "Does Manitoba accept an International Driving Permit as a translation?",
        a: "No. MPI requires a translation by an ATIM-certified translator, the Immigrant Centre or Accueil francophone, a Manitoba notary, or an embassy or consulate.",
      },
    ],
  },
  {
    code: "ON",
    slug: "ontario",
    name: "Ontario",
    shortName: "Ontario",
    authority: "DriveTest",
    gracePeriod: "60 days",
    lead:
      "New Ontario residents have <strong>60 days</strong> to switch to an Ontario licence. Drivers from the US and 19 agreement countries exchange for a full Class G with a vision test. Everyone else takes the knowledge test, a G2 road test, and a G road test 12 months later, and <strong>since July 1, 2026 gets at most 12 months of foreign experience credit</strong>.",
    reciprocalCountries: [
      c("United States (all states)", "Not US territories"),
      c("Australia"), c("Austria"), c("Belgium"), c("Croatia"), c("Denmark"), c("France"), c("Germany"),
      c("Great Britain"), c("Hungary"), c("Isle of Man"), c("Japan"), c("Kosovo"), c("New Zealand"),
      c("Northern Ireland"), c("Ireland"), c("South Korea"), c("Switzerland"), c("Taiwan"), c("Ukraine"),
    ],
    nonReciprocalSummary: "Knowledge, G2 test, G test 12 months later",
    nonReciprocalSteps: [
      "<strong>Pass the vision and knowledge tests</strong> at a DriveTest centre. You receive a G1 licence.",
      "<strong>Pass the G2 road test.</strong> Up to 12 months of foreign experience counts toward the wait, but more than six months of credit needs an authentication letter from your home licensing authority.",
      "<strong>Pass the G road test</strong> at least 12 months after the G2. Both road tests are mandatory since July 1, 2026.",
    ],
    experienceCredit:
      "Maximum 12 months. Credit beyond six months requires a letter of authentication from the issuing government in English or French. Drivers from agreement countries with two or more years of experience get a full G; with less they get a G2 with time credited.",
    documents: [
      "Valid original foreign licence and identity documents showing legal name and date of birth",
      "Certified translation dated within six months if the licence is not in English or French (embassy, consulate, or an ATIO-certified translator)",
      "Authentication letter from the foreign licensing authority if you want experience credit",
      "From May 11, 2026: a declaration that Ontario is your primary residence and that you are legally in Canada",
    ],
    fees: "G1 package $159.75 (knowledge test, G2 road test, five-year licence); G road test $91.25; reciprocal exchange with a five-year licence $90.",
    newcomerGuidance:
      "Ontario's 2026 change closed the old fast track. If your country is not on the list, plan for two road tests and at least a year between them, and request the authentication letter before you leave so the first 12 months count. The 60-day window is the shortest of any large province.",
    changes:
      "July 1, 2026: foreign experience credit capped at 12 months and both G2 and G road tests made mandatory for non-agreement drivers. May 11, 2026: residency and legal-presence declaration required.",
    officialUrl: "https://www.ontario.ca/page/exchange-out-province-drivers-licence",
    officialLabel: "Ontario.ca, exchange an out-of-province licence",
    lastVerified: "September 2026",
    faqs: [
      {
        q: "How long can I drive in Ontario on a foreign licence?",
        a: "60 days after you move to Ontario. After that you must hold an Ontario licence.",
      },
      {
        q: "Which countries can exchange a driver's licence in Ontario?",
        a: "The United States, Australia, Austria, Belgium, Croatia, Denmark, France, Germany, Great Britain, Hungary, the Isle of Man, Japan, Kosovo, New Zealand, Northern Ireland, Ireland, South Korea, Switzerland, Taiwan, and Ukraine.",
      },
      {
        q: "What changed for foreign drivers in Ontario in 2026?",
        a: "From July 1, 2026, drivers from non-agreement countries get at most 12 months of experience credit and must pass both the G2 and the G road tests, with 12 months between them.",
      },
    ],
  },
  {
    code: "QC",
    slug: "quebec",
    name: "Quebec",
    shortName: "Quebec",
    authority: "SAAQ",
    gracePeriod: "6 months",
    lead:
      "A foreign licence is valid in Quebec for <strong>six consecutive months after you settle</strong>, the longest grace period in Canada. The SAAQ exchanges licences from the US and 12 other jurisdictions for a Class 5 with no tests. Others need <strong>12 months of licence history</strong>, then a knowledge test and a road test.",
    reciprocalCountries: [
      US, c("Austria"), c("Belgium"), c("France"), c("Germany"), c("Great Britain"), c("Northern Ireland"),
      c("Isle of Man"), c("Japan"), c("Netherlands"), c("South Korea"), c("Switzerland"), c("Taiwan"),
    ],
    nonReciprocalSummary: "12 months held, then knowledge + road test",
    nonReciprocalSteps: [
      "<strong>Check that you have held your licence for at least 12 months.</strong> Shorter than that and you start as a new driver.",
      "<strong>Book an 'exchange a licence from another country' appointment</strong> with the SAAQ; it verifies your driving experience first.",
      "<strong>Pass the knowledge test and the Class 5 road test.</strong> Since June 5, 2025, failing the road test means a learner's licence (accompanied driving, no driving midnight to 5 a.m.) with a retake after 28 days; you can no longer keep driving on the foreign licence.",
    ],
    experienceCredit:
      "Under 24 months of experience earns a probationary Class 5 (zero alcohol, four demerit points) even after an exchange.",
    documents: [
      "Foreign licence, passport, and your immigration document (PR card, Confirmation of Permanent Residence, or a work or study permit)",
      "Proof of a Quebec address",
      "Certified translation of any document not in French or English",
      "A driving record or statement of experience from your home authority if the licence does not show a first-issue date",
    ],
    fees: "About $91 for the licence including the insurance contribution, plus roughly $48 for the tests (secondary sources).",
    newcomerGuidance:
      "Ukraine is not on Quebec's list even though most other provinces exchange Ukrainian licences. Use the six months well: book the SAAQ appointment early, because a failed road test now ends your right to drive on the foreign licence. The SAAQ site blocks automated checks, so this page was confirmed against Quebec's regulation index and the SAAQ's own 2025 brochure.",
    changes: "June 5, 2025: a learner's licence is issued after a failed road test instead of continued foreign-licence driving.",
    officialUrl: "https://saaq.gouv.qc.ca/en/drivers-licences/canadian-foreign-drivers-licence",
    officialLabel: "SAAQ, Canadian or foreign driver's licence",
    lastVerified: "September 2026",
    faqs: [
      {
        q: "How long can I drive in Quebec with a foreign licence?",
        a: "Six consecutive months after you settle in Quebec. International students with a valid licence and an International Driving Permit can drive for the length of their studies.",
      },
      {
        q: "Which countries have a licence exchange agreement with Quebec?",
        a: "The United States, Austria, Belgium, France, Germany, Great Britain, Northern Ireland, the Isle of Man, Japan, the Netherlands, South Korea, Switzerland, and Taiwan. Ukraine is not on Quebec's list.",
      },
    ],
  },
  {
    code: "NB",
    slug: "new-brunswick",
    name: "New Brunswick",
    shortName: "New Brunswick",
    authority: "Service New Brunswick",
    gracePeriod: "As soon as you settle (6 months for permit holders)",
    lead:
      "New Brunswick expects new residents to get a provincial licence <strong>as soon as they take up residence</strong>; temporary residents on a work or study permit longer than six months may drive on their home licence for up to six months from landing. Licences from the US and 23 countries exchange for a Class 5 with only a vision test.",
    reciprocalCountries: [
      c("United States (all states)", "Class for class, including Class 7"),
      c("Austria"), c("Australia"), c("Belgium"), c("Denmark"), c("England"), c("France"), c("Germany"),
      c("Isle of Man"), c("Ireland"), c("Italy"), c("Japan"), c("Netherlands"), c("New Zealand"), c("Norway"),
      c("Portugal"), c("Scotland"), c("South Korea"), c("Spain"), c("Sweden"), c("Switzerland"),
      c("Taiwan", "TECO Toronto-authenticated translation plus a Verification Certificate issued within 3 months"),
      c("Ukraine", "Category B or BE only; vision test required"),
      c("Wales"),
    ],
    nonReciprocalSummary: "Vision + written + road test",
    nonReciprocalSteps: [
      "<strong>Pass the vision test and the written knowledge test</strong> at Service New Brunswick. You then hold a Class 7-1 learner licence.",
      "<strong>Take the road test within six months</strong>, or the written and vision tests must be repeated.",
      "<strong>Receive a Class 5 the same day</strong> you pass the road test.",
    ],
    documents: [
      "Original foreign licence, with an official translation (translation agency or International Driving Permit) if not in English or French",
      "One proof of identity and two proofs of New Brunswick residency",
      "Proof of legal presence: work or study permit, or PR card",
    ],
    fees: "Up to $100 for the licence plus $25 plus HST per road test.",
    newcomerGuidance:
      "New Brunswick's list is long and includes Italy, Spain, Portugal, and Norway, which several larger provinces leave out. Students do not have to exchange while enrolled, but a New Brunswick licence makes insurance and car buying simpler.",
    officialUrl: "https://www.gnb.ca/en/topic/driving-transportation/driving-licensing/licences-new-residents.html",
    officialLabel: "GNB, licences for new residents",
    lastVerified: "September 2026",
    faqs: [
      {
        q: "How long can I drive in New Brunswick on a foreign licence?",
        a: "Permanent residents should exchange as soon as they take up residence. Temporary residents on a permit longer than six months may drive on their home licence for up to six months from landing in Canada.",
      },
      {
        q: "Does New Brunswick exchange Ukrainian driver's licences?",
        a: "Yes, for category B or BE only, with a vision test.",
      },
    ],
  },
  {
    code: "NS",
    slug: "nova-scotia",
    name: "Nova Scotia",
    shortName: "Nova Scotia",
    authority: "NS Registry of Motor Vehicles",
    gracePeriod: "180 days",
    lead:
      "You can drive in Nova Scotia on a foreign licence for <strong>up to 180 days after you move</strong>. The Registry of Motor Vehicles exchanges licences from the US and 20 listed countries, but <strong>only for the listed licence class</strong>; the wrong class means full testing.",
    reciprocalCountries: [
      c("United States (all states)", "Same class, usually no testing"),
      c("Australia", "Class C to Class 5"), c("Austria", "B to 5"), c("Belgium", "B to 5; A to 6"),
      c("Denmark", "B to 5"), c("France", "B to 5"), c("Germany", "B to 5"), c("Hungary", "B or BE to 5"),
      c("Ireland", "B to 5"), c("Isle of Man", "B, C, D to 5; A, A1 to 6"), c("Italy", "B to 5"),
      c("Japan", "Class 1 to 5"), c("Netherlands", "B to 5"), c("New Zealand", "Class 1 to 5"),
      c("Portugal", "B to 5"), c("South Korea", "Class 1 or 2 to 5; Class 2 small to 6"),
      c("Sweden", "B or BE to 5"), c("Switzerland", "B to 5"), c("Taiwan", "B, C, D, E to 5"),
      c("Ukraine", "B or BE to 5"), c("United Kingdom", "B, C, D to 5; A to 6"),
    ],
    nonReciprocalSummary: "Vision + knowledge + road test",
    nonReciprocalSteps: [
      "<strong>Pass the vision test and the knowledge test</strong> (road signs and rules; some parts available online).",
      "<strong>Book the road test online</strong> with your master number and bring your foreign licence on test day. Classes 1 to 4 also need a driver's medical report.",
      "<strong>Expect graduated licensing placement</strong> depending on the class and how long you have been licensed; two years is the usual threshold for a full licence.",
    ],
    experienceCredit:
      "Two years of experience is the usual threshold for skipping graduated licensing, even after a reciprocal exchange.",
    documents: [
      "Current foreign licence, which you surrender; expired licences cannot be exchanged",
      "Translation if not in English or French, by the Association of Translators and Interpreters of Nova Scotia, the Canadian Translators Council, ISANS, or an embassy",
      "Additional proof of identity and a medical disclosure",
    ],
    fees: "Five-year Class 5 licence $80.15; test fees extra.",
    newcomerGuidance:
      "Nova Scotia's list is generous but class-specific. Check the class printed on your licence against the table before you book; a UK Class A motorcycle exchanges, a Japanese one does not. ISANS, the settlement agency, is an approved translator, which keeps that cost low.",
    changes: "July 2026: Nova Scotia announced a formal reciprocal agreement with Japan; the Registry's list already includes Japan.",
    officialUrl: "https://novascotia.ca/exchange-your-out-of-province-drivers-licence/",
    officialLabel: "Nova Scotia, exchange your out-of-province licence",
    lastVerified: "September 2026",
    faqs: [
      {
        q: "How long can I drive in Nova Scotia on a foreign licence?",
        a: "Up to 180 days after moving to Nova Scotia, including for students.",
      },
      {
        q: "Can I exchange a motorcycle licence in Nova Scotia?",
        a: "Only from Belgium, the Isle of Man, South Korea, and the United Kingdom. Other countries' motorcycle classes need full testing.",
      },
    ],
  },
  {
    code: "PE",
    slug: "prince-edward-island",
    name: "Prince Edward Island",
    shortName: "PEI",
    authority: "PEI Highway Safety",
    gracePeriod: "4 months",
    lead:
      "New PEI residents may drive on a foreign licence for <strong>four months</strong>. The US and ten countries exchange directly with a vision test. Everyone else passes the knowledge test, completes the mandatory <strong>Novice Driver Course for Newcomers</strong>, and takes a Class 5 road test.",
    reciprocalCountries: [
      c("United States (all states)", "Classes 1 to 6"),
      c("Austria", "Class 5 and 6"), c("Australia", "Class 5 and 6"), c("Belgium", "Class 5 and 6"),
      c("Germany", "Class 5 and 6"), c("Japan", "Class 5 and 6"), c("South Korea", "Class 5 and 6"),
      c("Switzerland", "Class 5 and 6"), c("Taiwan", "Class 5 and 6"),
      c("United Kingdom", "England, Scotland, Wales, Northern Ireland, Isle of Man; Class 5 and 6"),
      c("France", "Class 5 only"),
    ],
    nonReciprocalSummary: "Knowledge test + newcomer course + road test",
    nonReciprocalSteps: [
      "<strong>Pass the rules-of-the-road knowledge test</strong> and vision screening at Access PEI.",
      "<strong>Complete the Novice Driver Course for Newcomers</strong>: five to six hours over two sessions with an approved driving school, about $300 including licensing fees. A full PEI driver education program also satisfies this.",
      "<strong>Pass the Class 5 road test.</strong> An official driving record can shorten the graduated licensing waits.",
    ],
    experienceCredit: "Two years of experience is needed for a full Class 5 after an exchange; otherwise you are placed in graduated licensing.",
    documents: [
      "Valid photo driver's licence, surrendered on issue, with a certified translation if not in English or French",
      "Immigration document showing legal status and two proofs of a PEI address",
      "A driving record or abstract, recommended",
    ],
    fees: "About $100 for a five-year licence; the newcomer course about $300 all in.",
    newcomerGuidance:
      "PEI is the only province with a mandatory course for newcomers from non-agreement countries, so budget the time and the $300. Belgium is the newest addition to the exchange list. PEI's website blocks automated checks; this page was confirmed with the Immigrant and Refugee Services Association of PEI and two other sources.",
    officialUrl: "https://www.princeedwardisland.ca/en/information/transportation-and-infrastructure/driving-with-an-out-of-province-license",
    officialLabel: "Prince Edward Island, driving with an out-of-province licence",
    lastVerified: "September 2026",
    faqs: [
      {
        q: "How long can I drive on PEI with a foreign licence?",
        a: "Four months after becoming a PEI resident. Full-time post-secondary students may drive on a valid foreign licence longer.",
      },
      {
        q: "What is the Novice Driver Course for Newcomers on PEI?",
        a: "A mandatory five-to-six-hour course, in two sessions, for drivers from countries without an exchange agreement. It costs about $300 and is run by approved driving schools.",
      },
    ],
  },
  {
    code: "NL",
    slug: "newfoundland-and-labrador",
    name: "Newfoundland and Labrador",
    shortName: "Newfoundland",
    authority: "NL Motor Registration",
    gracePeriod: "3 months",
    lead:
      "A foreign licence is valid in Newfoundland and Labrador for <strong>three months after you become a resident</strong>. The US, Germany, Ukraine, and 12 arrangement countries exchange without tests. Others take a written, vision, and road test, but <strong>surrendering a valid foreign licence waives the graduated licensing wait</strong>.",
    reciprocalCountries: [
      c("United States (all states)", "Registrar waives testing"),
      c("Germany", "Class 5; Registrar waiver"), c("Ukraine", "Class 5; Registrar waiver"),
      c("Austria", "Class 5"), c("Denmark", "Class 5"), c("South Korea", "Class 5"),
      c("Switzerland", "Class 5"), c("United Kingdom", "Class 5"),
      c("Belgium", "Class 5 and 6"), c("France", "Class 5 and 6"), c("Ireland", "Class 5 and 6"),
      c("Isle of Man", "Class 5 and 6"), c("Japan", "Class 5 and 6"), c("Northern Ireland", "Class 5 and 6"),
      c("Taiwan", "Class 5 and 6"),
    ],
    nonReciprocalSummary: "Written + vision + road; GDL wait waived",
    nonReciprocalSteps: [
      "<strong>Pass the written test</strong>, available online through MyGovNL and valid for six months, plus a vision test.",
      "<strong>Surrender your valid foreign licence</strong>, which exempts you from the graduated licensing waiting period.",
      "<strong>Book the Class 5 road test</strong> once the written test is passed.",
    ],
    documents: [
      "Required identification and proof of legal presence in Canada",
      "English translation of a licence not in English or French, from the Association for New Canadians in St. John's or a Registrar-approved translator",
    ],
    fees: "Five-year Class 5 licence $125; Class 5 road test $78; two-year learner licence $60.",
    newcomerGuidance:
      "Book the appointment online before you visit; walk-ins are not served for exchanges. The Association for New Canadians handles translations, which keeps the cost down for newcomers.",
    changes: "Belgium arrangement from September 27, 2024; Denmark arrangement from January 1, 2025.",
    officialUrl: "https://www.gov.nl.ca/motorregistration/new-residents-and-visitors/licence-application-process/",
    officialLabel: "NL Motor Registration, licence application process",
    lastVerified: "September 2026",
    faqs: [
      {
        q: "How long can I drive in Newfoundland on a foreign licence?",
        a: "Three months after becoming a resident of Newfoundland and Labrador.",
      },
      {
        q: "Do newcomers have to do the graduated licensing program in Newfoundland?",
        a: "Surrendering a valid foreign licence exempts you from the mandatory waiting period, so you can take the road test once you pass the written test.",
      },
    ],
  },
  {
    code: "YT",
    slug: "yukon",
    name: "Yukon",
    shortName: "Yukon",
    authority: "Yukon Motor Vehicles",
    gracePeriod: "120 days",
    lead:
      "New Yukon residents may drive on a foreign licence for <strong>120 days</strong> (30 days if it carries an air-brake endorsement). Yukon's official exchange list is short: <strong>the US, Taiwan, Germany, and the Isle of Man</strong>. Everyone else applies as a new driver, and anyone licensed for under two years enters graduated licensing.",
    reciprocalCountries: [US, c("Taiwan"), c("Germany", "A road-sign test is required"), c("Isle of Man")],
    nonReciprocalSummary: "Knowledge + road; under 2 yrs enters GDL",
    nonReciprocalSteps: [
      "<strong>Pass the vision screening and written knowledge test</strong> for a Class 7 learner licence.",
      "<strong>Document two or more years of experience</strong> to be exempted from graduated licensing restrictions.",
      "<strong>Pass the Class 5 road test.</strong>",
    ],
    experienceCredit: "Two or more years of documented driving experience exempts you from GDL restrictions; under two years you stay in GDL.",
    documents: [
      "Your out-of-territory licence, surrendered",
      "One proof of identity and two proofs of Yukon residency",
      "Translation of any document not in English or French; a driver's medical for commercial classes or age 70 and over",
    ],
    newcomerGuidance:
      "Several third-party guides list Australia, France, Japan, Korea, and the UK for Yukon. The official page, last updated February 2026, does not. Plan for tests unless you hold one of the four listed licences.",
    officialUrl: "https://yukon.ca/en/driving-and-transportation/driver-licensing/transfer-your-drivers-licence-jurisdiction-outside-yukon",
    officialLabel: "Yukon.ca, transfer your driver's licence",
    lastVerified: "September 2026",
    faqs: [
      {
        q: "Which foreign licences can be exchanged in Yukon?",
        a: "Only licences from the United States, Taiwan, Germany (with a road-sign test), and the Isle of Man, per the official Yukon page.",
      },
      {
        q: "How long can I drive in Yukon on a foreign licence?",
        a: "120 days after moving to Yukon, or 30 days if the licence has an air-brake endorsement.",
      },
    ],
  },
  {
    code: "NT",
    slug: "northwest-territories",
    name: "Northwest Territories",
    shortName: "NWT",
    authority: "NWT Driver and Vehicle Services",
    gracePeriod: "30 days",
    lead:
      "New residents of the Northwest Territories have <strong>30 days</strong> to get a territorial licence, the shortest window in Canada. Licences from the <strong>US and Germany</strong> transfer as the same class without testing. The transfer page says other countries 'may be eligible', so call a Driver and Vehicle Services office before you assume you need tests.",
    reciprocalCountries: [c("United States (all states)", "Same class without testing"), c("Germany", "Same class without testing")],
    nonReciprocalSummary: "Knowledge (Class 7) + road test",
    nonReciprocalSteps: [
      "<strong>Pass the knowledge test</strong> for a Class 7 learner permit.",
      "<strong>Pass the practical road test</strong> and surrender your foreign licence.",
      "<strong>Ask about your country first.</strong> Driver and Vehicle Services decides eligibility for countries not named in the manual.",
    ],
    documents: [
      "Completed application form and identification",
      "Proof of NWT residency: utility bill or lease",
      "Foreign licence, surrendered; classes 1 to 4 need an NWT medical report",
    ],
    fees: "Five-year licence $110; three-year $84; one-year $46.",
    newcomerGuidance:
      "Thirty days goes fast when the nearest office is a flight away. Foreign nationals whose permit expires within 90 days can get a one-time 90-day licence extension letter; ask for it when you apply. In-person service only.",
    officialUrl: "https://www.idmv.inf.gov.nt.ca/Drivers/Drivers/Transfer-an-NWT-drivers-licence",
    officialLabel: "NWT Driver and Vehicle Services, transfer a licence",
    lastVerified: "September 2026",
    faqs: [
      {
        q: "How long can I drive in the NWT on a foreign licence?",
        a: "30 days after becoming a resident. Tourists may drive up to 90 days and International Driving Permit holders up to 12 months.",
      },
      {
        q: "Which foreign licences transfer to an NWT licence without tests?",
        a: "Licences from the United States and Germany transfer as the same class without testing. Other countries may be eligible; confirm with Driver and Vehicle Services.",
      },
    ],
  },
  {
    code: "NU",
    slug: "nunavut",
    name: "Nunavut",
    shortName: "Nunavut",
    authority: "Nunavut Motor Vehicles",
    gracePeriod: "30 days to apply",
    lead:
      "You must apply for a Nunavut licence <strong>within 30 days of moving to the territory</strong>. Nunavut publishes <strong>no list of foreign exchange countries</strong>; only US and Canadian licences are covered in the driver's manual, and the Registrar decides other cases individually. Most newcomers apply as new drivers.",
    reciprocalCountries: [c("United States (all states)", "Treated like another province; the Registrar sets conditions")],
    nonReciprocalSummary: "Knowledge + road as a new driver",
    nonReciprocalSteps: [
      "<strong>Call 1-888-975-5999 or email motorvehicles@gov.nu.ca</strong> to ask whether your country's licence can be recognised.",
      "<strong>Pass the written knowledge test and vision screening</strong> for a Class 7 learner licence.",
      "<strong>Pass the Class 5 road test.</strong> A licence expired more than 12 months requires full re-examination.",
    ],
    documents: [
      "Application for Nunavut Driver's Licence with the remittance slip",
      "Two pieces of acceptable ID, such as a passport, current licence, or immigration authorization",
    ],
    fees: "Transfer of a licence from another province or territory $68.40; test fees not listed.",
    newcomerGuidance:
      "Guides that promise 16 exchange countries or a 90-day grace period for Nunavut are not supported by the territory's own pages. Ask Motor Vehicles in writing before you arrive and keep the reply; it is your only evidence of how your licence will be treated.",
    officialUrl: "https://www.gov.nu.ca/en/service-nunavut/apply-drivers-licence",
    officialLabel: "Government of Nunavut, apply for a driver's licence",
    lastVerified: "September 2026",
    faqs: [
      {
        q: "Does Nunavut exchange foreign driver's licences?",
        a: "Nunavut publishes no list of foreign exchange countries. A non-territorial licence is accepted only under conditions the Registrar sets, so contact Motor Vehicles to ask about your country.",
      },
      {
        q: "How long do I have to get a Nunavut licence after moving?",
        a: "You must apply within 30 days of moving to Nunavut.",
      },
    ],
  },
];

export const getLicenceRule = (slug: string): LicenceRule | undefined =>
  LICENCE_RULES.find((r) => r.slug === slug);

// Hub-level FAQ (targets "exchange foreign driver's license canada", "how long can I drive on a foreign licence in canada").
export const LICENCE_HUB_FAQS: LicenceFaq[] = [
  {
    q: "How long can a newcomer drive in Canada on a foreign licence?",
    a: "It depends on the province: 30 days in the Northwest Territories and Nunavut, 60 days in Ontario, 90 days in BC, Alberta, and Saskatchewan, three months in Manitoba and Newfoundland, four months on PEI, 120 days in Yukon, 180 days in Nova Scotia, and six months in Quebec. The clock starts when you become a resident of the province.",
  },
  {
    q: "Which countries can exchange a driver's licence in Canada without a test?",
    a: "The United States exchanges everywhere. Germany, the United Kingdom, Japan, South Korea, Taiwan, Switzerland, Austria, Belgium, France, Ireland, and Australia exchange in most provinces. Alberta, Saskatchewan, and Manitoba also accept most EU countries. Yukon, the NWT, and Nunavut recognise very few.",
  },
  {
    q: "Can I exchange an Indian, Nigerian, Filipino, or Chinese driver's licence in Canada?",
    a: "No province has an exchange agreement with India, Nigeria, the Philippines, or China. Drivers from these countries take the knowledge and road tests. Proof of two or more years of experience usually skips the learner stage, so bring an official driving record from home.",
  },
  {
    q: "Do I need a translation of my driver's licence?",
    a: "Yes, if it is not in English or French, in almost every province. Manitoba and Ontario require certified translators and do not accept an International Driving Permit as a translation; Saskatchewan and New Brunswick do accept one.",
  },
];
