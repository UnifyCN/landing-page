// How internationally trained professionals get licensed, by profession.
// Powers the /credentials hub + /credentials/[profession] pages, and the
// "how to get licensed" links on the /teer job lists (credentialForNoc).
// Facts were checked against each regulator and national body in September 2026
// (see `sources` and each regulator `url`). `confidence` is the researcher's rating;
// re-check "medium" entries first. When a rule changes, edit the entry and
// `lastVerified`, never the template.

export type CredentialGroup = "health" | "professional" | "education-social" | "trades";

export interface CredentialRegulator {
  code: string;
  province: string;
  /** "Not regulated" when no licence is required there. */
  regulator: string;
  url: string;
  /** False where the job is not regulated, or the trade certificate is voluntary. */
  required: boolean;
  note?: string;
}

export interface CredentialProfession {
  slug: string;
  name: string;
  /** Short label for sibling nav. */
  shortName: string;
  plural: string;
  group: CredentialGroup;
  seoTitle: string;
  seoDescription: string;
  h1: string;
  /** Verdict box + hub table. Keep under ~5 words. */
  firstStep: string;
  examShort: string;
  nocCodes: { noc: string; title: string }[];
  regulatedIn: "all" | "some";
  /** Overrides the "N of 13" label where the count alone misleads (e.g. only the CPA title is regulated). */
  regulatedLabel?: string;
  protectedTitles: string[];
  /** Answer-first lead paragraph. */
  lead: string;
  nationalBodies: { name: string; url: string; role: string }[];
  steps: { title: string; body: string }[];
  exams: string[];
  language: string;
  timeline?: { text: string; source: string };
  recentChange?: { text: string; source: string };
  workWhileLicensing: { role: string; noc: string; note: string }[];
  regulators: CredentialRegulator[];
  faqs: { q: string; a: string }[];
  sources: { url: string; supports: string }[];
  lastVerified: string;
  confidence: "high" | "medium" | "low";
}

export const CREDENTIAL_GROUPS: { value: CredentialGroup; label: string }[] = [
  { value: "health", label: "Health care" },
  { value: "professional", label: "Engineering, accounting, and law" },
  { value: "education-social", label: "Education and social services" },
  { value: "trades", label: "Skilled trades" },
];

export const CREDENTIALS: CredentialProfession[] = [
  {
    slug: "registered-nurse",
    name: "Registered nurse",
    shortName: "Registered nurse",
    plural: "registered nurses",
    group: "health",
    seoTitle: "How to Become a Registered Nurse in Canada as an IEN (2026)",
    seoDescription: "Internationally educated nurses: NNAS or direct assessment, the NCLEX-RN, and the nursing regulator in each province, including Ontario's 2025 changes.",
    h1: "How to Become a Registered Nurse in Canada as an Internationally Educated Nurse",
    firstStep: "NNAS or regulator assessment",
    examShort: "NCLEX-RN (OIIQ exam in Quebec)",
    nocCodes: [
      { noc: "31301", title: "Registered nurses and registered psychiatric nurses" },
    ],
    regulatedIn: "all",
    protectedTitles: [
      "Registered Nurse",
      "RN",
      "Registered Psychiatric Nurse",
      "Infirmière / infirmier (Quebec)",
    ],
    lead: "An internationally educated nurse must get a licence from the nursing regulator in the province or territory where they want to work before they can use the title Registered Nurse. The regulator decides your path: credential assessment, language proof, any bridging education, and the NCLEX-RN exam, or the OIIQ exam in Quebec.",
    nationalBodies: [
      {
        name: "National Nursing Assessment Service (NNAS)",
        url: "https://www.nnas.ca/",
        role: "Verifies your nursing documents and compares your education to Canadian standards, then sends an advisory report to the regulators you choose.",
      },
      {
        name: "Inspire Global Assessments",
        url: "https://www.inspireassessments.org/",
        role: "Assesses your education, English and nursing competence for regulators in BC, Yukon, the Northwest Territories and Nunavut, and some other provinces.",
      },
      {
        name: "NCSBN (NCLEX-RN exam)",
        url: "https://www.ncsbn.org/",
        role: "Runs the NCLEX-RN, the registration exam for registered nurses in every province and territory except Quebec.",
      },
    ],
    steps: [
      {
        title: "Choose your province and its regulator",
        body: "Each province and territory licenses its own nurses, and each regulator sets its own path. Pick where you want to work first, then follow that regulator's page for internationally educated nurses.",
      },
      {
        title: "Get your credentials assessed",
        body: "Many regulators ask for an NNAS advisory report. BCCNM, the Yukon Registered Nurses Association and CNNN use Inspire Global Assessments instead, and since April 2025 the College of Nurses of Ontario accepts an assessment from WES, ICAS or ICES.",
      },
      {
        title: "Prove your language ability",
        body: "Pass an English or French test that your regulator accepts, or show another form of evidence it allows. In Quebec you must show French proficiency.",
      },
      {
        title: "Close any gaps the regulator finds",
        body: "The regulator may ask you to take bridging courses, a clinical competence assessment, or supervised practice. Examples are the CNO Transition to Practice requirement and Manitoba's Clinical Competence Assessment.",
      },
      {
        title: "Pass the registration exam",
        body: "Write the NCLEX-RN outside Quebec. In Quebec, the OIIQ asks you to complete an integration program, then pass its own professional exam.",
      },
      {
        title: "Finish checks and apply for your licence",
        body: "Complete the regulator's jurisprudence course or exam, a criminal record check, and any liability protection. Then pay the licence fee and get registered.",
      },
    ],
    exams: [
      "NCLEX-RN (all provinces and territories except Quebec)",
      "OIIQ professional exam (Quebec)",
      "Registered Psychiatric Nurses of Canada (RPNC) exam for registered psychiatric nurses (confirmed in Alberta)",
    ],
    language: "Regulators accept tests such as IELTS Academic, CELBAN or OET, and some accept other evidence, such as recent nursing work in English. Each regulator sets its own minimum scores, and Quebec requires French.",
    timeline: {
      text: "In BC, BCCNM aims to give most internationally educated applicants a registration decision in 4 to 9 months",
      source: "https://www.bccnm.ca/BCCNM/Announcements/Pages/Announcement.aspx?AnnouncementID=420",
    },
    recentChange: {
      text: "April 2025: the College of Nurses of Ontario started to accept nursing degrees from any country that meet its standard, added a Transition to Practice requirement, and accepts credential assessments from WES, ICAS or ICES, not only NNAS.",
      source: "https://www.cno.org/news/new-nursing-registration-requirements-take-effect",
    },
    workWhileLicensing: [
      {
        role: "Health care aide / personal support worker",
        noc: "33102",
        note: "Usually unregulated, but in Alberta health care aides must register with the College of LPNs and HCAs of Alberta (CLHA).",
      },
      {
        role: "Home support worker",
        noc: "44101",
        note: "Personal care in clients' homes; you must not do tasks restricted to nurses.",
      },
      {
        role: "Licensed practical nurse",
        noc: "32101",
        note: "Needs its own LPN licence. BCCNM assesses most internationally educated nurses for RN and LPN at the same time.",
      },
    ],
    regulators: [
      {
        code: "BC",
        province: "British Columbia",
        regulator: "British Columbia College of Nurses and Midwives (BCCNM)",
        url: "https://www.bccnm.ca/RN/applications_registration/how_to_apply/InternationalEN/Pages/Default.aspx",
        required: true,
        note: "Also regulates RPNs. First step is Inspire Global Assessments; NNAS is not required.",
      },
      {
        code: "AB",
        province: "Alberta",
        regulator: "College of Registered Nurses of Alberta (CRNA)",
        url: "https://www.nurses.ab.ca/nursing-in-alberta/international-applicants/",
        required: true,
        note: "RPNs apply to the College of Registered Psychiatric Nurses of Alberta (CRPNA).",
      },
      {
        code: "SK",
        province: "Saskatchewan",
        regulator: "College of Registered Nurses of Saskatchewan (CRNS)",
        url: "https://www.crns.ca/register-license/",
        required: true,
        note: "NNAS report required. RPNs apply to the College of Registered Psychiatric Nurses of Saskatchewan (CRPNS).",
      },
      {
        code: "MB",
        province: "Manitoba",
        regulator: "College of Registered Nurses of Manitoba (CRNM)",
        url: "https://www.crnm.mb.ca/applicants/internationally-educated-nurses/",
        required: true,
        note: "NNAS or the College's Clinical Competence Assessment. RPNs apply to CRPNM.",
      },
      {
        code: "ON",
        province: "Ontario",
        regulator: "College of Nurses of Ontario (CNO)",
        url: "https://www.cno.org/become-a-nurse/registration-guides/outside-canada",
        required: true,
        note: "Credential assessment by WES, ICAS or ICES since April 2025; NNAS expedited reports still accepted.",
      },
      {
        code: "QC",
        province: "Quebec",
        regulator: "Ordre des infirmières et infirmiers du Québec (OIIQ)",
        url: "https://www.oiiq.org/acceder-profession/exercer-au-quebec/infirmiere-diplomee-hors-canada",
        required: true,
        note: "Equivalence review, integration program, then the OIIQ professional exam. French required.",
      },
      {
        code: "NB",
        province: "New Brunswick",
        regulator: "College of Nursing of New Brunswick (CNNB)",
        url: "https://cnnb-opinb.ca/en/ien/",
        required: true,
        note: "Formerly the Nurses Association of New Brunswick (NANB). Pathway depends on where you studied.",
      },
      {
        code: "NS",
        province: "Nova Scotia",
        regulator: "Nova Scotia Nursing and Midwifery Regulator (NSNMR)",
        url: "https://nsnmr.ca/registration-licensing/apply-be-nurse-nova-scotia/international-nurse-applicants",
        required: true,
        note: "Fast-track for US nurses, and for designated countries with a Nova Scotia job offer.",
      },
      {
        code: "PE",
        province: "Prince Edward Island",
        regulator: "Prince Edward Island College of Nursing and Midwifery (PEICNM)",
        url: "https://peicnm.ca/registration-requirements/internationally-educated-registered-nurse/",
        required: true,
        note: "NNAS advisory report required.",
      },
      {
        code: "NL",
        province: "Newfoundland and Labrador",
        regulator: "Newfoundland and Labrador College of Nurses (NLCN)",
        url: "https://nlcn.ca/apply/rn-applicants/internationally-educated-nurse-rn/",
        required: true,
        note: "Formed April 2026 from CRNNL and CLPNNL. Designated-countries pathway; others need an Inspire assessment.",
      },
      {
        code: "YT",
        province: "Yukon",
        regulator: "Yukon Registered Nurses Association (YRNA)",
        url: "https://www.yrna.ca/registration",
        required: true,
        note: "Competency assessment through Inspire Global Assessments. US-educated RNs may get an expedited pathway.",
      },
      {
        code: "NT",
        province: "Northwest Territories",
        regulator: "College of Nurses of the Northwest Territories and Nunavut (CNNN)",
        url: "https://cannn.ca/resources/internationally-educated-nurses/",
        required: true,
        note: "One college for both territories; also regulates LPNs and RPNs.",
      },
      {
        code: "NU",
        province: "Nunavut",
        regulator: "College of Nurses of the Northwest Territories and Nunavut (CNNN)",
        url: "https://cannn.ca/resources/internationally-educated-nurses/",
        required: true,
        note: "Same college as the Northwest Territories.",
      },
    ],
    faqs: [
      {
        q: "Can I work as a registered nurse in Canada with a foreign nursing degree?",
        a: "Yes, but only after the nursing regulator in your province or territory gives you a licence. The regulator checks your education, language skills and recent practice, may ask for bridging courses, and asks you to pass the NCLEX-RN, or the OIIQ exam in Quebec. Until then you cannot use the title Registered Nurse.",
      },
      {
        q: "Do I need NNAS to become a nurse in Canada?",
        a: "It depends on the province. Saskatchewan and Prince Edward Island ask for an NNAS advisory report. BC, Yukon, the Northwest Territories and Nunavut use Inspire Global Assessments instead. Since April 2025, Ontario accepts assessments from WES, ICAS or ICES. Manitoba lets you use NNAS or its own Clinical Competence Assessment. Check your regulator before you pay for any assessment.",
      },
      {
        q: "Which exam do internationally educated nurses write in Canada?",
        a: "Registered nurses write the NCLEX-RN in every province and territory except Quebec. In Quebec, the OIIQ gives its own professional exam after you finish an integration program. Registered psychiatric nurses in the western provinces write a separate exam, the RPNC. Your regulator tells you when you are eligible to book the exam.",
      },
    ],
    sources: [
      {
        url: "https://www.cno.org/news/new-nursing-registration-requirements-take-effect",
        supports: "recentChange, steps (Transition to Practice), exams",
      },
      {
        url: "https://www.cno.org/become-a-nurse/approved-educational-credential-assessment-service-providers",
        supports: "steps (WES, ICAS, ICES), regulators.ON note",
      },
      {
        url: "https://www.bccnm.ca/BCCNM/Announcements/Pages/Announcement.aspx?AnnouncementID=420",
        supports: "timeline, NNAS not required in BC",
      },
      {
        url: "https://www.bccnm.ca/RN/applications_registration/how_to_apply/InternationalEN/Pages/Default.aspx",
        supports: "Inspire Global Assessments, NCLEX-RN, RN and LPN assessed together",
      },
      {
        url: "https://www.crnm.mb.ca/updates-to-ien-application-process/",
        supports: "regulators.MB note, language (OET), steps (Clinical Competence Assessment)",
      },
      { url: "https://www.crns.ca/register-license/", supports: "regulators.SK note (NNAS required)" },
      {
        url: "https://nsnmr.ca/registration-licensing/apply-be-nurse-nova-scotia/international-nurse-applicants",
        supports: "regulators.NS name and fast-track",
      },
      {
        url: "https://peicnm.ca/registration-requirements/internationally-educated-registered-nurse/",
        supports: "regulators.PE name and NNAS requirement",
      },
      { url: "https://nlcn.ca/", supports: "regulators.NL name and April 2026 merger" },
      {
        url: "https://nlcn.ca/apply/rn-applicants/internationally-educated-nurse-rn/",
        supports: "NL designated-countries pathway and Inspire assessment",
      },
      { url: "https://cannn.ca/", supports: "regulators.NT and NU name and designations" },
      { url: "https://www.yrna.ca/registration", supports: "regulators.YT note" },
      { url: "https://cnnb-opinb.ca/en/ien/", supports: "regulators.NB name and zone-based pathway" },
      {
        url: "https://www.nurses.ab.ca/nursing-in-alberta/international-applicants/",
        supports: "regulators.AB",
      },
      {
        url: "https://crpna.ab.ca/applicants/internationally-educated-nurses/",
        supports: "RPNC exam, CRPNA uses NNAS",
      },
      { url: "https://crpns.ca/", supports: "CRPNS name" },
      {
        url: "https://www.oiiq.org/acceder-profession/exercer-au-quebec/infirmiere-diplomee-hors-canada",
        supports: "Quebec equivalence, integration program, OIIQ exam",
      },
      { url: "https://www.clha.com/", supports: "workWhileLicensing (Alberta HCAs regulated by CLHA)" },
      { url: "https://www.nnas.ca/", supports: "nationalBodies.NNAS role" },
      { url: "https://www.inspireassessments.org/", supports: "nationalBodies.Inspire jurisdictions" },
    ],
    lastVerified: "September 2026",
    confidence: "medium",
  },
  {
    slug: "licensed-practical-nurse",
    name: "Licensed practical nurse",
    shortName: "Practical nurse (LPN/RPN)",
    plural: "licensed practical nurses",
    group: "health",
    seoTitle: "How to Become an LPN or RPN in Canada with Foreign Training",
    seoDescription: "Foreign-trained practical nurses: the credential assessment, the REx-PN or CPNRE exam, and the LPN or RPN regulator in every province and territory.",
    h1: "How to Become a Licensed Practical Nurse (LPN or RPN) in Canada with Foreign Training",
    firstStep: "NNAS or regulator assessment",
    examShort: "REx-PN or CPNRE",
    nocCodes: [
      { noc: "32101", title: "Licensed practical nurses" },
    ],
    regulatedIn: "all",
    protectedTitles: [
      "Licensed Practical Nurse",
      "LPN",
      "Registered Practical Nurse (Ontario)",
      "RPN (Ontario)",
      "Infirmière auxiliaire / infirmier auxiliaire (Quebec)",
    ],
    lead: "An internationally educated practical nurse must get a licence from the practical nursing regulator in the province or territory where they want to work. The regulator sets the path: credential assessment, language proof, any bridging education, and an entry exam. The exam is the REx-PN in BC and Ontario and the CPNRE in most other places.",
    nationalBodies: [
      {
        name: "National Nursing Assessment Service (NNAS)",
        url: "https://www.nnas.ca/",
        role: "Verifies your nursing documents and compares your education to Canadian standards, then sends an advisory report to the regulators you choose.",
      },
      {
        name: "Inspire Global Assessments",
        url: "https://www.inspireassessments.org/",
        role: "Assesses your education, English and nursing competence for regulators such as BCCNM, the Newfoundland and Labrador College of Nurses, and CNNN.",
      },
      {
        name: "Regulatory Exam - Practical Nurse (REx-PN)",
        url: "https://www.rexpn.com/",
        role: "The entry exam for practical nurses in British Columbia and Ontario.",
      },
      {
        name: "Canadian Practical Nurse Registration Examination (CPNRE)",
        url: "https://www.cpnre.ca/",
        role: "The entry exam for practical nurses in most other provinces and territories outside Quebec.",
      },
    ],
    steps: [
      {
        title: "Choose your province and its regulator",
        body: "Each province and territory licenses its own practical nurses. In Ontario the title is Registered Practical Nurse and the regulator is the College of Nurses of Ontario. In Quebec it is infirmière auxiliaire and the regulator is the OIIAQ.",
      },
      {
        title: "Get your credentials assessed",
        body: "Saskatchewan, New Brunswick and Prince Edward Island ask for an NNAS advisory report. BCCNM uses Inspire Global Assessments, Ontario accepts WES, ICAS or ICES, and Quebec does its own equivalence review.",
      },
      {
        title: "Prove your language ability",
        body: "Pass an English or French test that your regulator accepts, such as IELTS, CELBAN or TEF. In Quebec you must show French proficiency.",
      },
      {
        title: "Close any gaps the regulator finds",
        body: "The regulator may ask you to take bridging courses or a gap training program. Examples are the CNO Transition to Practice requirement and the CLPNM SIEN gap training program in Manitoba.",
      },
      {
        title: "Pass the entry exam",
        body: "Write the REx-PN in British Columbia or Ontario, or the CPNRE in most other provinces and territories. In Quebec, pass the OIIAQ professional exam.",
      },
      {
        title: "Finish checks and apply for your licence",
        body: "Complete the jurisprudence requirement, a criminal record check and any liability protection. Then pay the licence fee and get registered.",
      },
    ],
    exams: [
      "REx-PN (British Columbia and Ontario)",
      "CPNRE (Alberta, Saskatchewan, Manitoba, New Brunswick, Nova Scotia, Prince Edward Island, Newfoundland and Labrador, Northwest Territories, Nunavut)",
      "OIIAQ professional exam (Quebec)",
    ],
    language: "Regulators accept tests such as IELTS, CELBAN or TEF, and some accept other evidence. Each regulator sets its own minimum scores, and Quebec requires French.",
    recentChange: {
      text: "April 2025: the College of Nurses of Ontario started to accept a practical nursing diploma from any country that meets its standard for Registered Practical Nurse applicants, and added a Transition to Practice requirement.",
      source: "https://www.cno.org/news/new-nursing-registration-requirements-take-effect",
    },
    workWhileLicensing: [
      {
        role: "Health care aide / personal support worker",
        noc: "33102",
        note: "Usually unregulated, but in Alberta health care aides must register with the College of LPNs and HCAs of Alberta (CLHA).",
      },
      {
        role: "Home support worker",
        noc: "44101",
        note: "Personal care in clients' homes; you must not do tasks restricted to nurses.",
      },
      {
        role: "Medical administrative assistant",
        noc: "13112",
        note: "Office and scheduling work in clinics; no patient care tasks.",
      },
    ],
    regulators: [
      {
        code: "BC",
        province: "British Columbia",
        regulator: "British Columbia College of Nurses and Midwives (BCCNM)",
        url: "https://www.bccnm.ca/LPN/applications_registration/how_to_apply/IENapplicant/Pages/IEN.aspx",
        required: true,
        note: "First step is Inspire Global Assessments. Exam is the REx-PN.",
      },
      {
        code: "AB",
        province: "Alberta",
        regulator: "College of LPNs and HCAs of Alberta (CLHA)",
        url: "https://www.clha.com/",
        required: true,
        note: "Formerly the College of Licensed Practical Nurses of Alberta (CLPNA). Exam is the CPNRE.",
      },
      {
        code: "SK",
        province: "Saskatchewan",
        regulator: "College of Licensed Practical Nurses of Saskatchewan (CLPNS)",
        url: "https://clpns.com/internationally-educated-nurse-ien/",
        required: true,
        note: "Formerly SALPN. NNAS assessment required. Exam is the CPNRE.",
      },
      {
        code: "MB",
        province: "Manitoba",
        regulator: "College of Licensed Practical Nurses of Manitoba (CLPNM)",
        url: "https://www.clpnm.ca/for-applicants/internationally-educated-nurses/choosing-the-right-application-pathway/",
        required: true,
        note: "Offers the SIEN gap training program. Exam is the CPNRE.",
      },
      {
        code: "ON",
        province: "Ontario",
        regulator: "College of Nurses of Ontario (CNO)",
        url: "https://www.cno.org/become-a-nurse/registration-guides/outside-canada",
        required: true,
        note: "Title is Registered Practical Nurse (RPN). Exam is the REx-PN.",
      },
      {
        code: "QC",
        province: "Quebec",
        regulator: "Ordre des infirmières et infirmiers auxiliaires du Québec (OIIAQ)",
        url: "https://oiiaq.org/devenir-infirmiere-auxiliaire/demande-de-reconnaissance-dequivalence",
        required: true,
        note: "Title is infirmière auxiliaire. Equivalence review, then the OIIAQ professional exam. French required.",
      },
      {
        code: "NB",
        province: "New Brunswick",
        regulator: "Association of New Brunswick Licensed Practical Nurses (ANBLPN)",
        url: "https://www.anblpn.ca/internationally-educated-nurses/",
        required: true,
        note: "Contact the provincial IEHP Navigation Service first, then NNAS. Exam is the CPNRE.",
      },
      {
        code: "NS",
        province: "Nova Scotia",
        regulator: "Nova Scotia Nursing and Midwifery Regulator (NSNMR)",
        url: "https://nsnmr.ca/registration-licensing/apply-be-nurse-nova-scotia/international-nurse-applicants",
        required: true,
        note: "Regulates LPNs, RNs and RPNs. Exam is the CPNRE.",
      },
      {
        code: "PE",
        province: "Prince Edward Island",
        regulator: "Prince Edward Island College of Nursing and Midwifery (PEICNM)",
        url: "https://peicnm.ca/registration-requirements/internationally-educated-practical-nurse/",
        required: true,
        note: "Replaced the College of LPNs of PEI. NNAS report required. Exam is the CPNRE.",
      },
      {
        code: "NL",
        province: "Newfoundland and Labrador",
        regulator: "Newfoundland and Labrador College of Nurses (NLCN)",
        url: "https://nlcn.ca/apply/lpn-applicants/international/",
        required: true,
        note: "Formed April 2026 from CLPNNL and CRNNL. Exam is the CPNRE.",
      },
      {
        code: "YT",
        province: "Yukon",
        regulator: "Government of Yukon, Professional Licensing and Regulatory Affairs",
        url: "https://yukon.ca/en/doing-business/professional-licensing/nursing-professions/apply-practical-nurse-lpn-licence",
        required: true,
        note: "The territorial government licenses LPNs directly.",
      },
      {
        code: "NT",
        province: "Northwest Territories",
        regulator: "College of Nurses of the Northwest Territories and Nunavut (CNNN)",
        url: "https://cannn.ca/resources/internationally-educated-nurses/",
        required: true,
        note: "One college for both territories; regulates LPNs since the 2023 Acts. Exam is the CPNRE.",
      },
      {
        code: "NU",
        province: "Nunavut",
        regulator: "College of Nurses of the Northwest Territories and Nunavut (CNNN)",
        url: "https://cannn.ca/resources/internationally-educated-nurses/",
        required: true,
        note: "Same college as the Northwest Territories.",
      },
    ],
    faqs: [
      {
        q: "Can I work as a practical nurse in Canada with foreign nursing education?",
        a: "Yes, after the practical nursing regulator in your province or territory licenses you. The regulator checks your education, language skills and recent practice, may ask for bridging courses, and asks you to pass an entry exam. In Ontario the licensed title is Registered Practical Nurse, and in Quebec it is infirmière auxiliaire.",
      },
      {
        q: "Which exam do internationally educated practical nurses write, REx-PN or CPNRE?",
        a: "It depends on the province. British Columbia and Ontario use the REx-PN. Alberta, Saskatchewan, Manitoba, New Brunswick, Nova Scotia, Prince Edward Island, Newfoundland and Labrador, the Northwest Territories and Nunavut use the CPNRE. Quebec uses its own OIIAQ professional exam. Your regulator tells you when you are eligible to write.",
      },
      {
        q: "Can a registered nurse from another country apply as an LPN in Canada?",
        a: "Often, yes. BCCNM assesses most internationally educated nurses for both RN and LPN at the same time. In New Brunswick, one NNAS application covers both LPN and RN. In Nova Scotia you must email the regulator first to discuss your case. Ask your regulator which licence your education and experience fit best.",
      },
    ],
    sources: [
      {
        url: "https://www.cno.org/news/new-nursing-registration-requirements-take-effect",
        supports: "recentChange, REx-PN in Ontario, Transition to Practice",
      },
      {
        url: "https://www.cno.org/become-a-nurse/approved-educational-credential-assessment-service-providers",
        supports: "steps (WES, ICAS, ICES)",
      },
      {
        url: "https://www.bccnm.ca/LPN/applications_registration/how_to_apply/IENapplicant/Pages/IEN.aspx",
        supports: "regulators.BC, Inspire, REx-PN in BC",
      },
      { url: "https://www.clha.com/", supports: "regulators.AB name, CPNRE in Alberta, HCA regulation" },
      {
        url: "https://clpns.com/internationally-educated-nurse-ien/",
        supports: "regulators.SK name, NNAS required, CPNRE",
      },
      {
        url: "https://www.clpnm.ca/for-registrants/students-and-graduates/graduates/cpnre/",
        supports: "CPNRE in Manitoba",
      },
      {
        url: "https://www.anblpn.ca/internationally-educated-nurses/",
        supports: "regulators.NB note, CPNRE, language tests (IELTS, TEF, CELBAN), one NNAS application for LPN and RN",
      },
      {
        url: "https://nsnmr.ca/registration-licensing/apply-be-nurse-nova-scotia/international-nurse-applicants",
        supports: "regulators.NS, CPNRE, RN applying as LPN",
      },
      {
        url: "https://peicnm.ca/registration-requirements/internationally-educated-practical-nurse/",
        supports: "regulators.PE, NNAS required, CPNRE",
      },
      { url: "https://nlcn.ca/apply/lpn-applicants/international/", supports: "regulators.NL, CPNRE" },
      { url: "https://cannn.ca/", supports: "regulators.NT and NU, LPNs regulated by CNNN" },
      {
        url: "https://cannn.ca/resources/internationally-educated-nurses/",
        supports: "CPNRE listed for CNNN",
      },
      {
        url: "https://yukon.ca/en/doing-business/professional-licensing/nursing-professions/apply-practical-nurse-lpn-licence",
        supports: "regulators.YT (confirmed through search; site returns 403 to curl)",
      },
      {
        url: "https://oiiaq.org/devenir-infirmiere-auxiliaire/demande-de-reconnaissance-dequivalence",
        supports: "regulators.QC, equivalence process, professional exam, French",
      },
      { url: "https://www.nnas.ca/", supports: "nationalBodies.NNAS role" },
    ],
    lastVerified: "September 2026",
    confidence: "medium",
  },
  {
    slug: "physician",
    name: "Physician",
    shortName: "Doctor",
    plural: "physicians",
    group: "health",
    seoTitle: "How Foreign-Trained Doctors Get Licensed in Canada (2026)",
    seoDescription: "International medical graduates: the Medical Council of Canada, the MCCQE, residency or practice-ready routes, and the medical regulator in each province.",
    h1: "How to Practise Medicine in Canada as an International Medical Graduate",
    firstStep: "Verify your degree with the MCC",
    examShort: "MCCQE (NAC for residency)",
    nocCodes: [
      { noc: "31100", title: "Specialists in clinical and laboratory medicine" },
      { noc: "31101", title: "Specialists in surgery" },
      { noc: "31102", title: "General practitioners and family physicians" },
    ],
    regulatedIn: "all",
    protectedTitles: ["Physician", "Surgeon", "Medical practitioner", "Doctor (Dr.) when used in health care"],
    lead: "An internationally trained doctor must get a licence from the medical regulator in the province or territory where they want to practise. Most start with the Medical Council of Canada: verify your degree and pass the MCCQE. Then the regulator decides your route: residency, a practice-ready assessment, or a faster route for approved countries.",
    nationalBodies: [
      {
        name: "Medical Council of Canada (MCC) / physiciansapply.ca",
        url: "https://physiciansapply.ca/",
        role: "Verifies your medical degree at the source, runs the MCCQE and NAC exams, and sends your documents to regulators.",
      },
      {
        name: "Canadian Resident Matching Service (CaRMS)",
        url: "https://www.carms.ca/",
        role: "Runs the match for residency positions if you need Canadian postgraduate training.",
      },
      {
        name: "College of Family Physicians of Canada (CFPC)",
        url: "https://www.cfpc.ca/",
        role: "Certifies family physicians, including some trained in approved countries without an exam.",
      },
      {
        name: "Royal College of Physicians and Surgeons of Canada",
        url: "https://www.royalcollege.ca/",
        role: "Certifies specialists, including through its Practice Eligibility Route for those trained abroad.",
      },
    ],
    steps: [
      {
        title: "Open a physiciansapply.ca account",
        body: "Create an account with the Medical Council of Canada and request source verification of your medical degree. Regulators use these verified documents.",
      },
      {
        title: "Pass the MCCQE",
        body: "Write the Medical Council of Canada Qualifying Examination (called MCCQE Part I before April 2026). If you want residency, you may also need the NAC examination.",
      },
      {
        title: "Prove your language ability",
        body: "Pass an English or French test that your regulator accepts. In Quebec you must show French proficiency.",
      },
      {
        title: "Choose your route to practice",
        body: "Apply for residency through CaRMS, or, if you already practise, apply for a 12-week practice-ready assessment (PRA) in a province that offers one. Doctors trained in the US and some other approved countries may qualify for a faster route.",
      },
      {
        title: "Get a provisional, then full, licence",
        body: "Many international doctors start with a provisional or supervised licence. A full licence usually needs certification from the CFPC or the Royal College, or the Collège des médecins du Québec in Quebec.",
      },
    ],
    exams: [
      "MCCQE (Medical Council of Canada Qualifying Examination, called MCCQE Part I before April 2026)",
      "NAC examination (for residency applicants)",
      "CFPC or Royal College certification exams (unless exempt)",
    ],
    language: "You must show proficiency in English or French with a test or other evidence your regulator accepts. Each regulator sets its own minimum scores, and Quebec requires French.",
    recentChange: {
      text: "July 2025: the College of Physicians and Surgeons of BC began to give full licences to US-trained doctors certified by an American Board of Medical Specialties member board, and no longer requires the LMCC for doctors who trained outside Canada.",
      source: "https://www.cpsbc.ca/news/cpsbc-bylaws-updated",
    },
    workWhileLicensing: [
      {
        role: "Health policy researcher or program officer",
        noc: "41404",
        note: "Research and program roles in health organizations; no patient care.",
      },
      {
        role: "Medical administrative assistant",
        noc: "13112",
        note: "Office and scheduling work in clinics; you must not give medical advice or treatment.",
      },
      {
        role: "Health care aide / personal support worker",
        noc: "33102",
        note: "Personal care only. In Alberta health care aides must register with the College of LPNs and HCAs of Alberta.",
      },
    ],
    regulators: [
      {
        code: "BC",
        province: "British Columbia",
        regulator: "College of Physicians and Surgeons of British Columbia (CPSBC)",
        url: "https://www.cpsbc.ca/registrants/current-registrants/registration-and-licensing",
        required: true,
        note: "Since July 2025, ABMS-certified US doctors can get a full licence. Practice Ready Assessment BC for others.",
      },
      {
        code: "AB",
        province: "Alberta",
        regulator: "College of Physicians & Surgeons of Alberta (CPSA)",
        url: "https://cpsa.ca/physicians/registration/apply-to-practise/independent-practice/pra/",
        required: true,
        note: "Practice Readiness Assessment. A 2023 pilot skips the first 3-month assessment for approved jurisdictions.",
      },
      {
        code: "SK",
        province: "Saskatchewan",
        regulator: "College of Physicians and Surgeons of Saskatchewan (CPSS)",
        url: "https://www.cps.sk.ca/",
        required: true,
        note: "SIPPA: 12-week assessment for family doctors with a 3-year rural return of service.",
      },
      {
        code: "MB",
        province: "Manitoba",
        regulator: "College of Physicians & Surgeons of Manitoba (CPSM)",
        url: "https://www.cpsm.mb.ca/registration/applying-for-registration/international-medical-graduates",
        required: true,
        note: "PRA Manitoba for family and specialty practice; MLPIMG program at the University of Manitoba.",
      },
      {
        code: "ON",
        province: "Ontario",
        regulator: "College of Physicians and Surgeons of Ontario (CPSO)",
        url: "https://www.cpso.on.ca/en/Physicians/Registration/Internationally-Trained-Physicians",
        required: true,
        note: "Practice Ready Ontario for family doctors; separate routes for US-trained doctors.",
      },
      {
        code: "QC",
        province: "Quebec",
        regulator: "Collège des médecins du Québec (CMQ)",
        url: "https://www.cmq.org/en/acc%C3%A9der-%C3%A0-la-profession/international",
        required: true,
        note: "Regular permit through residency, or a restrictive permit that needs a sponsoring health establishment. French required.",
      },
      {
        code: "NB",
        province: "New Brunswick",
        regulator: "College of Physicians and Surgeons of New Brunswick (CPSNB)",
        url: "https://cpsnb.org/en/pra-nb-home",
        required: true,
        note: "PRA-NB: 12-week assessment for family doctors, in English or French.",
      },
      {
        code: "NS",
        province: "Nova Scotia",
        regulator: "College of Physicians and Surgeons of Nova Scotia (CPSNS)",
        url: "https://cpsns.ns.ca/apply-for-licensure/physicians/internationally-trained/",
        required: true,
        note: "Practice-ready assessment through PACE leads to a conditional licence for primary care.",
      },
      {
        code: "PE",
        province: "Prince Edward Island",
        regulator: "College of Physicians and Surgeons of Prince Edward Island (CPSPEI)",
        url: "https://www.cpspei.ca/registration/",
        required: true,
        note: "No practice-ready assessment route at this time.",
      },
      {
        code: "NL",
        province: "Newfoundland and Labrador",
        regulator: "College of Physicians and Surgeons of Newfoundland and Labrador (CPSNL)",
        url: "https://cpsnl.ca/licensing-and-registration/i-want-to-practice-in-nl/",
        required: true,
        note: "PRA-NL through Memorial University: 12-week clinical field assessment for family doctors.",
      },
      {
        code: "YT",
        province: "Yukon",
        regulator: "Yukon Medical Council",
        url: "https://www.yukonmedicalcouncil.ca/index.php/physicians/get-a-medical-licence",
        required: true,
        note: "First-time licensure stream for doctors not licensed elsewhere in Canada.",
      },
      {
        code: "NT",
        province: "Northwest Territories",
        regulator: "Government of the Northwest Territories, Professional Licensing (Health and Social Services)",
        url: "https://www.hss.gov.nt.ca/en/services/medical-licence",
        required: true,
        note: "First-time applicants apply through physiciansapply.ca.",
      },
      {
        code: "NU",
        province: "Nunavut",
        regulator: "Government of Nunavut, Registrar of Medical Practitioners",
        url: "https://nuphysicians.ca/license-and-registration",
        required: true,
        note: "Needs LMCC plus CFPC, Royal College or CMQ certification. No provisional licences.",
      },
    ],
    faqs: [
      {
        q: "Can a foreign-trained doctor practise medicine in Canada?",
        a: "Yes, but only with a licence from the medical regulator in the province or territory where you want to work. Most international doctors verify their degree through physiciansapply.ca, pass the MCCQE, and then complete residency or a practice-ready assessment. Some doctors trained in the US and other approved countries can use a faster route.",
      },
      {
        q: "What is a practice-ready assessment for international doctors?",
        a: "A practice-ready assessment (PRA) is a clinical assessment, usually 12 weeks long, in which experienced international doctors practise under observation. If you pass, the regulator can give you a provisional licence without a Canadian residency. Many PRA programs are for family medicine and ask you to work in a specific community for a set time.",
      },
      {
        q: "Do I need to redo residency to be a doctor in Canada?",
        a: "Not always. Doctors who already practise may qualify for a practice-ready assessment in provinces such as Ontario, Manitoba, Saskatchewan, New Brunswick, Nova Scotia and Newfoundland and Labrador. Doctors certified in the US, and some family doctors trained in approved countries, can skip residency in several provinces. Others must apply for residency through CaRMS.",
      },
    ],
    sources: [
      {
        url: "https://mcc.ca/credentials-and-services/pathways-to-licensure/pathways-for-international-medical-graduates/",
        supports: "steps, nationalBodies, exams (MCCQE, NAC), PRA 12 weeks",
      },
      {
        url: "https://mcc.ca/news/medical-council-of-canada-qualifying-examination-name-update/",
        supports: "MCCQE rename April 2026",
      },
      {
        url: "https://www.cpsbc.ca/news/cpsbc-bylaws-updated",
        supports: "recentChange, regulators.BC note",
      },
      {
        url: "https://cpsa.ca/physicians/registration/apply-to-practise/independent-practice/pra/",
        supports: "regulators.AB PRA",
      },
      {
        url: "https://cpsa.ca/news/cpsa-launches-accelerated-registration-route-for-eligible-internationally-trained-physicians/",
        supports: "regulators.AB 2023 pilot",
      },
      {
        url: "https://healthcareersk.ca/opportunities/saskatchewan-international-physician-practice-assessment-sippa",
        supports: "regulators.SK SIPPA (lead, confirmed with University of Saskatchewan CME page)",
      },
      {
        url: "https://cmelearning.usask.ca/specialized-programs/sippa/Introduction%20to%20SIPPA.php",
        supports: "regulators.SK SIPPA 12-week assessment and return of service",
      },
      {
        url: "https://www.cpsm.mb.ca/registration/applying-for-registration/international-medical-graduates",
        supports: "regulators.MB",
      },
      {
        url: "https://www.cpso.on.ca/en/Physicians/Registration/Internationally-Trained-Physicians",
        supports: "regulators.ON",
      },
      {
        url: "https://touchstoneinstitute.ca/assessments/practice-ready-ontario/",
        supports: "Practice Ready Ontario",
      },
      {
        url: "https://www.cmq.org/en/acc%C3%A9der-%C3%A0-la-profession/international",
        supports: "regulators.QC permits",
      },
      { url: "https://cpsnb.org/en/pra-nb-home", supports: "regulators.NB" },
      {
        url: "https://cpsns.ns.ca/registrants/physicians/policies/pathway-to-licensure-for-international-medical-graduates-via-a-practice-ready-assessment-family-medicine/",
        supports: "regulators.NS PACE and conditional licence",
      },
      { url: "https://www.cpspei.ca/registration/", supports: "regulators.PE no PRA route" },
      { url: "https://www.med.mun.ca/oped/pato/", supports: "regulators.NL PRA-NL" },
      {
        url: "https://www.yukonmedicalcouncil.ca/index.php/physicians/get-a-medical-licence",
        supports: "regulators.YT",
      },
      { url: "https://www.hss.gov.nt.ca/en/services/medical-licence", supports: "regulators.NT" },
      { url: "https://nuphysicians.ca/license-and-registration", supports: "regulators.NU" },
    ],
    lastVerified: "September 2026",
    confidence: "medium",
  },
  {
    slug: "pharmacist",
    name: "Pharmacist",
    shortName: "Pharmacist",
    plural: "pharmacists",
    group: "health",
    seoTitle: "How to Become a Pharmacist in Canada with a Foreign Degree",
    seoDescription: "International pharmacy graduates: PEBC document evaluation and exams, the end of the Evaluating Exam in 2027, and the pharmacy regulator in each province.",
    h1: "How to Become a Licensed Pharmacist in Canada as an International Pharmacy Graduate",
    firstStep: "PEBC document evaluation",
    examShort: "PEBC Qualifying Exam",
    nocCodes: [
      { noc: "31120", title: "Pharmacists" },
    ],
    regulatedIn: "all",
    protectedTitles: ["Pharmacist"],
    lead: "An internationally trained pharmacist needs a licence from the pharmacy regulator in the province or territory where they will work. Outside Quebec, you go through Pharmacists' Gateway Canada and the Pharmacy Examining Board of Canada (PEBC) exams, then provincial training. Quebec uses its own equivalence process. The territories license only pharmacists who already hold a provincial licence.",
    nationalBodies: [
      {
        name: "Pharmacists' Gateway Canada",
        url: "https://www.pharmacistsgatewaycanada.ca/",
        role: "Gives you a national ID, holds your documents and language test results, and is the first step everywhere except Quebec.",
      },
      {
        name: "Pharmacy Examining Board of Canada (PEBC)",
        url: "https://pebc.ca/pharmacists/new_pathway/",
        role: "Evaluates your pharmacy degree (Document Evaluation) and runs the national exams that lead to the PEBC Certificate of Qualification.",
      },
    ],
    steps: [
      {
        title: "Enrol in Pharmacists' Gateway Canada",
        body: "Create a profile and get a national ID number. You need this ID to apply to PEBC. This step applies in every province except Quebec.",
      },
      {
        title: "Get your degree evaluated by PEBC",
        body: "Apply for the PEBC Pharmacist Document Evaluation. A completed evaluation stays valid for five years.",
      },
      {
        title: "Pass the PEBC exams",
        body: "Pass the Pharmacist Qualifying Examination Part I (multiple choice), then Part II (OSCE). The Pharmacist Evaluating Examination is still required for some applicants until its last sitting in October 2026, and it ends in January 2027.",
      },
      {
        title: "Meet provincial registration requirements",
        body: "Prove your language skills, register with the provincial regulator as a pharmacy intern or student, and finish supervised practical training. Most regulators also require a jurisprudence exam.",
      },
      {
        title: "Apply for your pharmacist licence",
        body: "Submit your final application to the provincial regulator with proof of liability insurance. After you hold a provincial licence, you can apply in Yukon, the Northwest Territories, or Nunavut.",
      },
    ],
    exams: [
      "PEBC Pharmacist Evaluating Examination (last sitting October 2026; not required from January 2027)",
      "PEBC Pharmacist Qualifying Examination Part I (MCQ)",
      "PEBC Pharmacist Qualifying Examination Part II (OSCE)",
      "Provincial jurisprudence exam (set by each regulator)",
    ],
    language: "Pharmacists' Gateway Canada accepts IELTS, OET, TOEFL iBT, and TEF Canada (TEF for Manitoba, New Brunswick, and Ontario). Each provincial regulator sets its own minimum scores, and Quebec requires proof of French from the Office québécois de la langue française.",
    timeline: {
      text: "In Manitoba, internationally educated pharmacists who registered from 2012 to 2023 took a median of 4.3 years from their PEBC application to registration.",
      source: "https://www.gov.mb.ca/frpo/reports/specialreports/cphm_data_report.pdf",
    },
    recentChange: {
      text: "PEBC will stop the Pharmacist Evaluating Examination. The October 2026 sitting is the last one. From January 2027, international graduates with a valid Document Evaluation go directly to Qualifying Examination Part I. Since May 13, 2025, graduates from some countries or accredited programs already skip the Evaluating Examination under the PEBC Streamlined Pathway.",
      source: "https://pebc.ca/pharmacists/new_pathway/",
    },
    workWhileLicensing: [
      {
        role: "Pharmacy assistant",
        noc: "33103",
        note: "Clerical and dispensing support under a pharmacist; employers may ask for a college certificate but no licence is needed.",
      },
      {
        role: "Pharmacy technician",
        noc: "32124",
        note: "Regulated separately in most provinces; you need its own registration, so check the provincial regulator first.",
      },
    ],
    regulators: [
      {
        code: "BC",
        province: "British Columbia",
        regulator: "College of Pharmacists of British Columbia",
        url: "https://www.bcpharmacists.org/international-pharmacy-graduate-ipg",
        required: true,
      },
      {
        code: "AB",
        province: "Alberta",
        regulator: "Alberta College of Pharmacy",
        url: "https://abpharmacy.ca/regulated-members/registration/pharmacists/initial-registration-pharmacist/",
        required: true,
      },
      {
        code: "SK",
        province: "Saskatchewan",
        regulator: "Saskatchewan College of Pharmacy Professionals",
        url: "https://saskpharm.ca/site/registration/pharmacistapplicants",
        required: true,
      },
      {
        code: "MB",
        province: "Manitoba",
        regulator: "College of Pharmacists of Manitoba",
        url: "https://cphm.ca/pharmacist-registration-in-manitoba/",
        required: true,
      },
      {
        code: "ON",
        province: "Ontario",
        regulator: "Ontario College of Pharmacists",
        url: "https://ocpinfo.com/applicants/register-as-a-pharmacist/international-pharmacy-graduate/",
        required: true,
      },
      {
        code: "QC",
        province: "Quebec",
        regulator: "Ordre des pharmaciens du Québec",
        url: "https://www.opq.org/devenir-pharmacien-au-quebec/admission/diplomes-international/",
        required: true,
        note: "Own equivalence process; may require Université de Montréal courses, a 600-hour internship, and French.",
      },
      {
        code: "NB",
        province: "New Brunswick",
        regulator: "New Brunswick College of Pharmacists",
        url: "https://nbpharmacists.ca/en/registration/",
        required: true,
      },
      {
        code: "NS",
        province: "Nova Scotia",
        regulator: "Nova Scotia Pharmacy Regulator",
        url: "https://nspharmacy.ca/registration-licensing/",
        required: true,
        note: "Formerly Nova Scotia College of Pharmacists; renamed June 30, 2025.",
      },
      {
        code: "PE",
        province: "Prince Edward Island",
        regulator: "Prince Edward Island College of Pharmacy",
        url: "https://pepharmacists.ca/registration/pharmacists/provisional-pharmacists/international-graduates/",
        required: true,
      },
      {
        code: "NL",
        province: "Newfoundland and Labrador",
        regulator: "College of Pharmacy of Newfoundland and Labrador",
        url: "https://cpnl.ca/registration/initial-registration/pharmacist/international-pharmacy-graduates/",
        required: true,
        note: "Formerly NL Pharmacy Board. Shorter route for pharmacists licensed in Australia, UK, Ireland, New Zealand, or USA.",
      },
      {
        code: "YT",
        province: "Yukon",
        regulator: "Government of Yukon, Professional Licensing",
        url: "https://yukon.ca/en/doing-business/professional-licensing/apply-pharmacist-licence",
        required: true,
        note: "Does not assess international graduates; you need a licence from a Canadian province first.",
      },
      {
        code: "NT",
        province: "Northwest Territories",
        regulator: "Government of the Northwest Territories, Health and Social Services, Professional Licensing",
        url: "https://www.hss.gov.nt.ca/en/services/pharmacist-licence",
        required: true,
        note: "Needs an unrestricted provincial licence and a PEBC certificate first.",
      },
      {
        code: "NU",
        province: "Nunavut",
        regulator: "Government of Nunavut, Department of Health",
        url: "https://www.gov.nu.ca/en/health/health-professionals",
        required: true,
        note: "Needs a licence from another Canadian province and a PEBC certificate first.",
      },
    ],
    faqs: [
      {
        q: "Can a foreign pharmacist work in Canada?",
        a: "Yes, but only after you get a licence from the pharmacy regulator in the province where you want to work. Outside Quebec, you enrol in Pharmacists' Gateway Canada, get your degree evaluated by PEBC, pass the PEBC Qualifying Examination, and complete provincial training and a jurisprudence exam. Quebec uses its own equivalence process through the Ordre des pharmaciens du Québec.",
      },
      {
        q: "Is the PEBC Evaluating Exam still required?",
        a: "Not for long. PEBC offers the Pharmacist Evaluating Examination for the last time in October 2026. From January 2027, international graduates with a valid Document Evaluation go directly to Qualifying Examination Part I. Since May 2025, graduates of some accredited programs, or from Australia, New Zealand, Ireland, South Africa, or the UK, can already skip it.",
      },
      {
        q: "Can I work in a pharmacy while I get my licence?",
        a: "Yes, in roles that do not need a pharmacist licence. Many internationally trained pharmacists work as pharmacy assistants. Once your regulator registers you as a pharmacy intern or student, you can do supervised pharmacist tasks as part of your practical training. You cannot call yourself a pharmacist until you hold a full licence.",
      },
    ],
    sources: [
      {
        url: "https://pebc.ca/pharmacists/new_pathway/",
        supports: "recentChange, exams, steps (Evaluating Exam ends January 2027, Part I before Part II, Document Evaluation valid 5 years)",
      },
      {
        url: "https://www.bcpharmacists.org/news/new-pathway-eligible-international-pharmacy-graduates",
        supports: "recentChange and faqs (Streamlined Pathway effective May 13, 2025, eligible countries)",
      },
      { url: "https://pebc.ca/faq/", supports: "steps, exams (current IPG sequence)" },
      { url: "https://www.pharmacistsgatewaycanada.ca/", supports: "nationalBodies, steps" },
      {
        url: "https://www.pharmacistsgatewaycanada.ca/before-you-start/language-requirements/",
        supports: "language",
      },
      {
        url: "https://www.pharmacistsgatewaycanada.ca/how-to-apply/territories-northwest-territories-nunavut-yukon/",
        supports: "regulators YT, NT, NU notes",
      },
      {
        url: "https://www.gov.mb.ca/frpo/reports/specialreports/cphm_data_report.pdf",
        supports: "timeline",
      },
      {
        url: "https://www.opq.org/devenir-pharmacien-au-quebec/admission/diplomes-international/",
        supports: "regulators QC note, language (French)",
      },
      {
        url: "https://cpnl.ca/registration/initial-registration/pharmacist/international-pharmacy-graduates/",
        supports: "regulators NL name and note",
      },
      {
        url: "https://nspharmacy.ca/nova-scotia-pharmacy-regulator-seeks-to-redefine-pharmacist/",
        supports: "regulators NS current name",
      },
      { url: "https://www.hss.gov.nt.ca/en/services/pharmacist-licence", supports: "regulators NT" },
      {
        url: "https://noc.esdc.gc.ca/Structure/NocProfile?GocTemplateCulture=en-CA&code=33103&version=2021.0",
        supports: "workWhileLicensing (pharmacy assistant duties and training)",
      },
    ],
    lastVerified: "September 2026",
    confidence: "high",
  },
  {
    slug: "dentist",
    name: "Dentist",
    shortName: "Dentist",
    plural: "dentists",
    group: "health",
    seoTitle: "How Foreign-Trained Dentists Get Licensed in Canada (2026)",
    seoDescription: "Internationally trained dentists: the NDEB equivalency process (AFK, ACJ, NDECC), the Virtual OSCE, and the dental regulator in each province.",
    h1: "How to Become a Licensed Dentist in Canada with a Foreign Dental Degree",
    firstStep: "NDEB equivalency process",
    examShort: "AFK, ACJ, NDECC, Virtual OSCE",
    nocCodes: [
      { noc: "31110", title: "Dentists" },
    ],
    regulatedIn: "all",
    protectedTitles: ["Dentist", "Dental surgeon"],
    lead: "An internationally trained dentist needs a licence from the dental regulator in the province or territory where they will work. If your dental program is not accredited, you first pass the National Dental Examining Board of Canada (NDEB) Equivalency Process or a Canadian qualifying program. Then you pass the NDEB Virtual OSCE and apply to the regulator.",
    nationalBodies: [
      {
        name: "National Dental Examining Board of Canada (NDEB)",
        url: "https://ndeb-bned.ca/equivalency-process/entry-to-practice-graduates-of-non-accredited-dental-programs-2/",
        role: "Verifies your dental degree, runs the Equivalency Process exams for graduates of non-accredited programs, and issues the NDEB certificate that every regulator requires.",
      },
    ],
    steps: [
      {
        title: "Check if your program is accredited",
        body: "Graduates of accredited programs (for example in the USA, Australia, New Zealand, and Ireland) go directly to the NDEB Certification Process. All others use the Equivalency Process or a Canadian qualifying program.",
      },
      {
        title: "Apply to the NDEB Equivalency Process",
        body: "Create an NDEB account and have your dental degree verified. The Equivalency Process has three exams that you take in order.",
      },
      {
        title: "Pass the AFK, ACJ, and NDECC",
        body: "Pass the Assessment of Fundamental Knowledge (AFK), the Assessment of Clinical Judgement (ACJ), and the NDECC, which has a clinical skills part and a situational judgement part. As an alternative, finish a qualifying or degree completion program at an accredited Canadian dental school.",
      },
      {
        title: "Pass the NDEB Virtual OSCE",
        body: "The Virtual OSCE is the NDEB certification exam. When you pass it and send proof of graduation, the NDEB issues your certificate.",
      },
      {
        title: "Apply to your provincial regulator",
        body: "Send your NDEB certificate, language test results, and documents to the regulator. Most regulators also require an ethics and jurisprudence exam or course. In Quebec, you also take the Ordre des dentistes du Québec exam and prove French.",
      },
    ],
    exams: [
      "NDEB Assessment of Fundamental Knowledge (AFK)",
      "NDEB Assessment of Clinical Judgement (ACJ)",
      "NDECC (clinical skills and situational judgement components)",
      "NDEB Virtual OSCE (certification exam)",
      "Provincial ethics and jurisprudence exam or course (set by each regulator)",
      "Ordre des dentistes du Québec exam (Quebec only)",
    ],
    language: "Regulators accept tests such as IELTS, TOEFL iBT, CELPIP General, PTE Core, TEF Canada, and TCF Canada (the Royal College of Dental Surgeons of Ontario list). Each regulator sets its own minimum scores, and Quebec requires proof of French.",
    timeline: {
      text: "In Manitoba, internationally educated dentists who registered from 2016 to 2024 took a median of 1.5 years from their NDEB application to registration. Some took a few months, others several years.",
      source: "https://www.gov.mb.ca/frpo/reports/specialreports/2025_data_report_mda_dentists_and_dental_specialists.pdf",
    },
    recentChange: {
      text: "Since July 1, 2025, NDEB gives NDECC seats first to first-time candidates who passed the most recent ACJ, then to Canadian citizens and permanent residents, then to everyone else. You can upload proof of status in NDEBConnect (collected since February 10, 2025).",
      source: "https://ndeb-bned.ca/2025/05/27/ndecc-registration-changes/",
    },
    workWhileLicensing: [
      {
        role: "Dental assistant (chairside)",
        noc: "33100",
        note: "Intra-oral duties need National Dental Assisting Examining Board certification and provincial licensing in most provinces.",
      },
      {
        role: "Dental laboratory assistant",
        noc: "33100",
        note: "Works in a dental lab under dental technicians; no dentist licence needed.",
      },
      {
        role: "Dental office administrative assistant",
        noc: "13112",
        note: "Front-desk and records work; you cannot treat patients.",
      },
    ],
    regulators: [
      {
        code: "BC",
        province: "British Columbia",
        regulator: "British Columbia College of Oral Health Professionals (BCCOHP)",
        url: "https://oralhealthbc.ca/licensure/dentist-licensure/",
        required: true,
        note: "Regulates dentists together with other oral health professions.",
      },
      {
        code: "AB",
        province: "Alberta",
        regulator: "College of Dental Surgeons of Alberta",
        url: "https://cdsab.ca/registration-information/national-dental-examining-board-ndeb/",
        required: true,
      },
      {
        code: "SK",
        province: "Saskatchewan",
        regulator: "College of Dental Surgeons of Saskatchewan",
        url: "https://saskdentists.com/become-a-registrant/",
        required: true,
      },
      {
        code: "MB",
        province: "Manitoba",
        regulator: "Manitoba Dental Association",
        url: "https://www.manitobadentist.ca/dental-professionals/dentists/registration-and-licencing/registration-packages/internationally-trained-dentists/registration-package-for-internationally-trained-dentists",
        required: true,
      },
      {
        code: "ON",
        province: "Ontario",
        regulator: "Royal College of Dental Surgeons of Ontario",
        url: "https://www.rcdso.org/become-a-dentist/international-applicants",
        required: true,
      },
      {
        code: "QC",
        province: "Quebec",
        regulator: "Ordre des dentistes du Québec",
        url: "https://www.odq.qc.ca/devenir-dentiste/diplomes-hors-quebec/diplomes-internationaux/",
        required: true,
        note: "Uses the NDEB Equivalency Process, then its own exam and a French requirement.",
      },
      {
        code: "NB",
        province: "New Brunswick",
        regulator: "New Brunswick Dental Society",
        url: "https://www.nbdent.ca/licensing-for-dentists-and-dental-assistants/",
        required: true,
      },
      {
        code: "NS",
        province: "Nova Scotia",
        regulator: "Nova Scotia Regulator of Dentistry and Dental Assisting",
        url: "https://nsrdda.ca/applicants/internationally-educated-dental-professionals/",
        required: true,
        note: "Formerly Provincial Dental Board of Nova Scotia.",
      },
      {
        code: "PE",
        province: "Prince Edward Island",
        regulator: "Prince Edward Island Dental College",
        url: "https://www.peidc.ca/",
        required: true,
        note: "Formerly Dental Council of Prince Edward Island.",
      },
      {
        code: "NL",
        province: "Newfoundland and Labrador",
        regulator: "Newfoundland and Labrador Dental Board",
        url: "https://www.nldb.ca/RegistrationAndLicensure",
        required: true,
      },
      {
        code: "YT",
        province: "Yukon",
        regulator: "Government of Yukon, Professional Licensing and Regulatory Affairs",
        url: "https://yukon.ca/en/doing-business/professional-licensing/apply-dentist-licence",
        required: true,
        note: "Requires NDEB certification; Equivalency Process must be done within 2 years before applying.",
      },
      {
        code: "NT",
        province: "Northwest Territories",
        regulator: "Government of the Northwest Territories, Health and Social Services, Professional Licensing",
        url: "https://www.hss.gov.nt.ca/en/services/dental-licence",
        required: true,
        note: "A Dental Registration Committee reviews applications.",
      },
      {
        code: "NU",
        province: "Nunavut",
        regulator: "Government of Nunavut, Department of Health",
        url: "https://www.gov.nu.ca/en/health/health-professionals",
        required: true,
        note: "Licensed under the Nunavut Dental Profession Act.",
      },
    ],
    faqs: [
      {
        q: "How can a foreign dentist practise in Canada?",
        a: "You need a licence from the dental regulator in your province. If your dental program is not accredited, you pass the NDEB Equivalency Process (AFK, ACJ, and NDECC) or finish a qualifying program at a Canadian dental school. Then you pass the NDEB Virtual OSCE, get your NDEB certificate, and apply to the regulator with language test results.",
      },
      {
        q: "What exams does NDEB require for internationally trained dentists?",
        a: "Graduates of non-accredited programs take three Equivalency Process exams in order: the Assessment of Fundamental Knowledge (AFK), the Assessment of Clinical Judgement (ACJ), and the NDECC, which has clinical skills and situational judgement parts. After that, everyone takes the Virtual OSCE, which is the NDEB certification exam.",
      },
      {
        q: "Can I work in a dental office before I get my dentist licence?",
        a: "Yes, in roles that do not need a dentist licence. You can work as a chairside dental assistant, a dental lab assistant, or in the front office. Intra-oral assisting duties need their own certification and licence in most provinces. You cannot diagnose or treat patients as a dentist until you are licensed.",
      },
    ],
    sources: [
      {
        url: "https://ndeb-bned.ca/equivalency-process/entry-to-practice-graduates-of-non-accredited-dental-programs-2/",
        supports: "steps, exams, nationalBodies (two options for non-accredited graduates)",
      },
      {
        url: "https://ndeb-bned.ca/2025/09/23/so-you-want-to-be-a-dentist-in-canada/",
        supports: "steps, exams (NDECC components, qualifying programs lead to Virtual OSCE)",
      },
      {
        url: "https://ndeb-bned.ca/certification-process/virtual-osce/",
        supports: "exams (Virtual OSCE is the certification exam)",
      },
      { url: "https://ndeb-bned.ca/2025/05/27/ndecc-registration-changes/", supports: "recentChange" },
      {
        url: "https://ndeb-bned.ca/2025/02/10/changes-to-equivalency-process-application-and-ndecc-registration/",
        supports: "recentChange (proof of status collected from February 10, 2025)",
      },
      {
        url: "https://www.rcdso.org/become-a-dentist/international-applicants",
        supports: "steps (accredited vs non-accredited, jurisprudence)",
      },
      {
        url: "https://www.rcdso.org/become-a-dentist/process-and-requirements/language-proficiency",
        supports: "language",
      },
      {
        url: "https://www.odq.qc.ca/devenir-dentiste/diplomes-hors-quebec/diplomes-internationaux/",
        supports: "regulators QC note, steps (Quebec exam, French)",
      },
      {
        url: "https://www.gov.mb.ca/frpo/reports/specialreports/2025_data_report_mda_dentists_and_dental_specialists.pdf",
        supports: "timeline, regulators MB",
      },
      { url: "https://nsrdda.ca/", supports: "regulators NS current name" },
      { url: "https://www.peidc.ca/", supports: "regulators PE current name" },
      { url: "https://www.hss.gov.nt.ca/en/services/dental-licence", supports: "regulators NT" },
      {
        url: "https://noc.esdc.gc.ca/Structure/NocProfile?GocTemplateCulture=en-CA&code=33100&version=2021.0",
        supports: "workWhileLicensing (dental assistant certification limits)",
      },
    ],
    lastVerified: "September 2026",
    confidence: "medium",
  },
  {
    slug: "physiotherapist",
    name: "Physiotherapist",
    shortName: "Physiotherapist",
    plural: "physiotherapists",
    group: "health",
    seoTitle: "How to Become a Physiotherapist in Canada from Abroad",
    seoDescription: "Internationally educated physiotherapists: CAPR credentialling, the new Canadian Physiotherapy Examination (CPTE), and the regulator in each province.",
    h1: "How to Become a Licensed Physiotherapist in Canada with Foreign Training",
    firstStep: "CAPR credentialling",
    examShort: "CPTE (except Quebec)",
    nocCodes: [
      { noc: "31202", title: "Physiotherapists" },
    ],
    regulatedIn: "some",
    protectedTitles: ["Physiotherapist", "Physical therapist", "PT"],
    lead: "An internationally trained physiotherapist must register with the physiotherapy regulator in the province where they will work. Outside Quebec, you first get your education assessed by the Canadian Alliance of Physiotherapy Regulators (CAPR), then pass the Canadian Physiotherapy Examination. Quebec uses its own equivalence process. The Northwest Territories and Nunavut do not regulate the profession.",
    nationalBodies: [
      {
        name: "Canadian Alliance of Physiotherapy Regulators (CAPR)",
        url: "https://alliancept.org/internationally-trained/",
        role: "Assesses your physiotherapy education (credentialling) and runs the Canadian Physiotherapy Examination (CPTE) for every province except Quebec.",
      },
    ],
    steps: [
      {
        title: "Pass an approved language test",
        body: "CAPR accepts IELTS (Academic or General Training) and CELPIP General. Since April 28, 2025, CAPR needs a passing result before it starts your credential assessment.",
      },
      {
        title: "Apply to CAPR for credentialling",
        body: "If you trained and are licensed in Australia, Hong Kong, Ireland, New Zealand, South Africa, the UK, or the USA, use the Pre-Approved Credentialling Pathway. From October 15, 2026, other applicants use the new Comparability Pathway.",
      },
      {
        title: "Complete the Comparability Pathway steps",
        body: "The pathway checks your qualifications, then you write the Physiotherapy Evaluation Tool (PET), a 150-question multiple-choice test. A 'partially comparable' result means you must complete remediation before the exam.",
      },
      {
        title: "Pass the Canadian Physiotherapy Examination",
        body: "The CPTE has a written section and an oral, case-based section with one pass mark. You must attempt it within two years of a successful credentialling decision.",
      },
      {
        title: "Register with your provincial regulator",
        body: "Apply to the regulator in your province. Some regulators let you practise under supervision on a provisional register while you finish the exam. In Quebec, apply to the OPPQ for equivalence instead.",
      },
    ],
    exams: [
      "Physiotherapy Evaluation Tool (PET), part of the CAPR Comparability Pathway from October 15, 2026",
      "Canadian Physiotherapy Examination (CPTE), written and oral sections, since January 2026 (all provinces except Quebec)",
      "Provincial jurisprudence requirements (set by each regulator)",
    ],
    language: "CAPR accepts IELTS Academic, IELTS General Training, and CELPIP General, and scores must reach CAPR within two years of the test date. Regulators set the minimum scores, and Quebec (OPPQ) requires French proficiency under the Charter of the French Language.",
    recentChange: {
      text: "In January 2026, CAPR replaced the old two-part Physiotherapy Competency Exam with one Canadian Physiotherapy Examination (CPTE) that has a written and an oral section. The last old written exam was on November 26, 2025. Provincial clinical exams, such as BC's ACEBC, are ending.",
      source: "https://chcpbc.org/2025/04/24/changes-to-physical-therapy-examination-requirement-in-2026/",
    },
    workWhileLicensing: [
      {
        role: "Physiotherapy assistant or rehabilitation assistant",
        noc: "32109",
        note: "Works under a physiotherapist's direction; employers often want an OTA/PTA college diploma. Quebec regulates physical rehabilitation therapists.",
      },
      {
        role: "Physiotherapy aide or rehabilitation aide",
        noc: "33109",
        note: "Helps patients with exercises and prepares equipment; no licence needed.",
      },
      {
        role: "Personal support worker or health care aide",
        noc: "33102",
        note: "Some provinces require a registry or certificate for this work.",
      },
    ],
    regulators: [
      {
        code: "BC",
        province: "British Columbia",
        regulator: "College of Health and Care Professionals of BC (CHCPBC)",
        url: "https://chcpbc.org/",
        required: true,
        note: "Regulates physical therapists together with many other health professions.",
      },
      {
        code: "AB",
        province: "Alberta",
        regulator: "College of Physiotherapists of Alberta",
        url: "https://www.cpta.ab.ca/for-applicants/educated-outside-canada/",
        required: true,
      },
      {
        code: "SK",
        province: "Saskatchewan",
        regulator: "Saskatchewan College of Physical Therapists",
        url: "https://scpt.org/site/iept",
        required: true,
      },
      {
        code: "MB",
        province: "Manitoba",
        regulator: "College of Physiotherapists of Manitoba",
        url: "https://manitobaphysio.com/registration/for-internationally-educated-professionals/",
        required: true,
      },
      {
        code: "ON",
        province: "Ontario",
        regulator: "College of Physiotherapists of Ontario",
        url: "https://collegept.org/how-to-become-a-physiotherapist/",
        required: true,
      },
      {
        code: "QC",
        province: "Quebec",
        regulator: "Ordre professionnel de la physiothérapie du Québec (OPPQ)",
        url: "https://oppq.qc.ca/devenir-membre/candidats-internationaux/",
        required: true,
        note: "Own equivalence process, not CAPR. French required; separate arrangement for France-trained applicants.",
      },
      {
        code: "NB",
        province: "New Brunswick",
        regulator: "College of Physiotherapists of New Brunswick",
        url: "https://cptnb.ca/en/international-registrations/",
        required: true,
      },
      {
        code: "NS",
        province: "Nova Scotia",
        regulator: "Nova Scotia Regulator of Physiotherapy (NSRPT)",
        url: "https://nsphysio.com/registration/overview/internationally-educated-applicants",
        required: true,
        note: "Formerly Nova Scotia College of Physiotherapists; renamed September 5, 2025.",
      },
      {
        code: "PE",
        province: "Prince Edward Island",
        regulator: "Prince Edward Island College of Physiotherapy",
        url: "https://www.peicpt.com/",
        required: true,
      },
      {
        code: "NL",
        province: "Newfoundland and Labrador",
        regulator: "Newfoundland and Labrador College of Physiotherapists",
        url: "https://nlcpt.com/foreign-trained-applicant/",
        required: true,
      },
      {
        code: "YT",
        province: "Yukon",
        regulator: "Government of Yukon, Professional Licensing",
        url: "https://yukon.ca/en/doing-business/professional-licensing/apply-physiotherapist-certificate",
        required: true,
        note: "Requires a passed CPTE and verification from other jurisdictions where you were licensed.",
      },
      {
        code: "NT",
        province: "Northwest Territories",
        regulator: "Not regulated",
        url: "",
        required: false,
        note: "Physiotherapy is not a regulated profession here; ask the employer what it requires.",
      },
      {
        code: "NU",
        province: "Nunavut",
        regulator: "Not regulated",
        url: "",
        required: false,
        note: "Physiotherapy is not a regulated profession here; ask the employer what it requires.",
      },
    ],
    faqs: [
      {
        q: "How do I become a physiotherapist in Canada with a foreign degree?",
        a: "Pass an approved English test, then apply to CAPR for credentialling. Applicants from seven pre-approved countries use a shorter pathway; others use the Comparability Pathway from October 15, 2026, which includes the Physiotherapy Evaluation Tool. Then pass the Canadian Physiotherapy Examination and register with your provincial regulator. Quebec uses its own OPPQ equivalence process.",
      },
      {
        q: "What is the new Canadian Physiotherapy Examination (CPTE)?",
        a: "The CPTE is the single national licensing exam for physiotherapists since January 2026. It has a written section and an oral, case-based section with one pass mark. It replaced the old written and clinical exams. Internationally educated candidates need a CAPR eligibility letter and must attempt it within two years of that decision.",
      },
      {
        q: "Which countries qualify for CAPR's pre-approved pathway?",
        a: "Since January 2025, CAPR has a Pre-Approved Credentialling Pathway for physiotherapists educated in Australia, Hong Kong, Ireland, New Zealand, South Africa, the United Kingdom, or the USA. You must be licensed without restriction there, or be a recent graduate eligible for that licence. You still pass the CPTE and register with a provincial regulator.",
      },
    ],
    sources: [
      {
        url: "https://alliancept.org/",
        supports: "steps (Comparability Pathway launches October 15, 2026), nationalBodies",
      },
      {
        url: "https://alliancept.org/new-comparability-pathway/comparability-pathway-information/",
        supports: "steps, exams (PET, outcomes, remediation)",
      },
      {
        url: "https://alliancept.org/capr-introduces-new-pre-approved-credentialling-pathway-to-address-physiotherapy-shortage/",
        supports: "steps, faqs (pre-approved countries, January 17, 2025)",
      },
      {
        url: "https://alliancept.org/canadian-physiotherapy-examination/getting-started/exam-policies/examination-eligibility-policy/",
        supports: "exams, steps (CPTE effective January 1, 2026; two-year attempt window)",
      },
      {
        url: "https://chcpbc.org/2025/04/24/changes-to-physical-therapy-examination-requirement-in-2026/",
        supports: "recentChange, exams (written and oral sections, ACEBC ends)",
      },
      {
        url: "https://alliancept.org/internationally-trained/credentialing-overview/policies/2-2-language-proficiency/",
        supports: "language",
      },
      {
        url: "https://alliancept.org/language-proficiency-requirements/",
        supports: "steps (language test before assessment from April 28, 2025)",
      },
      {
        url: "https://alliancept.org/about-us/regulators/",
        supports: "regulators (member list, Yukon regulator, no NT or NU regulator)",
      },
      {
        url: "https://www.hss.gov.nt.ca/en/services/professional-licensing",
        supports: "regulators NT (physiotherapy absent from NWT licensed professions)",
      },
      {
        url: "https://oppq.qc.ca/devenir-membre/candidats-internationaux/",
        supports: "regulators QC note, language (French)",
      },
      {
        url: "https://noc.esdc.gc.ca/Structure/NocProfile?GocTemplateCulture=en-CA&code=32109&version=2021.0",
        supports: "workWhileLicensing (OTA/PTA, Quebec physical rehabilitation therapist permit)",
      },
      {
        url: "https://noc.esdc.gc.ca/Structure/NocProfile?GocTemplateCulture=en-CA&code=33109&version=2021.0",
        supports: "workWhileLicensing (physiotherapy attendant, rehabilitation aide)",
      },
    ],
    lastVerified: "September 2026",
    confidence: "medium",
  },
  {
    slug: "medical-laboratory-technologist",
    name: "Medical laboratory technologist",
    shortName: "Medical lab technologist",
    plural: "medical laboratory technologists",
    group: "health",
    seoTitle: "Medical Lab Technologist in Canada: Foreign-Trained Guide",
    seoDescription: "Internationally trained medical laboratory technologists: the CAMLPR assessment, the national exams, and the regulator in each province and territory.",
    h1: "How to Work as a Medical Laboratory Technologist in Canada with Foreign Training",
    firstStep: "CAMLPR prior learning assessment",
    examShort: "CAMLPR exams (CSMLS in Alberta)",
    nocCodes: [
      { noc: "32120", title: "Medical laboratory technologists" },
    ],
    regulatedIn: "some",
    protectedTitles: ["Medical Laboratory Technologist", "MLT"],
    lead: "An internationally trained medical laboratory technologist must have their education and experience assessed, pass a national exam, and register with the provincial regulator where the profession is regulated. Nine provinces regulate it now and British Columbia starts in November 2027. The province where you plan to work decides the path.",
    nationalBodies: [
      {
        name: "Canadian Alliance of Medical Laboratory Professionals Regulators (CAMLPR)",
        url: "https://camlpr.org/become-an-mlt/prior-learning-assessment/",
        role: "Does the Prior Learning Assessment (PLA) and runs the Fields-of-Practice exams for most provinces and the territories.",
      },
      {
        name: "Canadian Society for Medical Laboratory Science (CSMLS)",
        url: "https://csmls.org/certification/how-to-become-certified/internationally-educated-medical-laboratory-technologists-iemlt/",
        role: "Does the PLA and national certification exam for applicants who want General MLT registration in Alberta; many employers in unregulated areas also ask for CSMLS certification.",
      },
    ],
    steps: [
      {
        title: "Choose your province and pathway",
        body: "Most provinces use CAMLPR. Alberta General MLT registration uses the CSMLS process, and Quebec uses the OPTMQ equivalence process.",
      },
      {
        title: "Prove English or French ability",
        body: "Take an approved language test, such as IELTS, CELPIP, PTE Core or TEF. CAMLPR will not issue exam eligibility until you meet its language policy.",
      },
      {
        title: "Complete the Prior Learning Assessment",
        body: "Apply to CAMLPR (or CSMLS for Alberta) and send your transcripts, clinical training records and work experience. The assessor compares them with the Canadian competency profile.",
      },
      {
        title: "Pass the national exams",
        body: "If your training is substantially equivalent, you can write the CAMLPR Fields-of-Practice exams, such as clinical chemistry, hematology, transfusion medicine, clinical microbiology and histology. You may need extra courses first.",
      },
      {
        title: "Register with the provincial regulator",
        body: "Apply to the regulator in your province, for example CMLTO in Ontario. In a province or territory with no regulator, employers set the requirements.",
      },
    ],
    exams: [
      "CAMLPR Fields-of-Practice exams (MB, NB, NL, NS, ON, PE, SK, and some Alberta fields)",
      "CSMLS national certification exam (Alberta General MLT register)",
    ],
    language: "CAMLPR accepts IELTS, CELPIP, PTE Core and MELA for English and TCF or TEF for French, and results must be less than two years old. Each regulator sets the minimum scores; Quebec also requires French for professional practice.",
    timeline: {
      text: "The PLA alone often takes several months",
      source: "https://camlpr.org/become-an-mlt/prior-learning-assessment/",
    },
    recentChange: {
      text: "Since June 2025, CAMLPR, not CSMLS, does new Prior Learning Assessments for most provinces. From November 1, 2025, internationally educated applicants write CAMLPR Fields-of-Practice exams instead of the single CSMLS exam.",
      source: "https://camlpr.org/become-an-mlt/fields-of-practice-exams/",
    },
    workWhileLicensing: [
      {
        role: "Medical laboratory assistant",
        noc: "33101",
        note: "Collects and prepares specimens under supervision; many employers ask for a Canadian MLA certificate.",
      },
      {
        role: "Biological or research laboratory technician",
        noc: "22110",
        note: "Research, university and industry labs do not need an MLT licence, but you cannot report patient test results.",
      },
    ],
    regulators: [
      {
        code: "BC",
        province: "British Columbia",
        regulator: "College of Physicians and Surgeons of British Columbia (CPSBC)",
        url: "https://www.cpsbc.ca/news/4professions",
        required: false,
        note: "Licence required from November 29, 2027. Until then, employers usually ask for CSMLS certification.",
      },
      {
        code: "AB",
        province: "Alberta",
        regulator: "College of Medical Laboratory Technologists of Alberta (CMLTA)",
        url: "https://www.cmlta.org/registration/internationally-educated-mlts/",
        required: true,
        note: "General MLT register uses the CSMLS PLA and exam.",
      },
      {
        code: "SK",
        province: "Saskatchewan",
        regulator: "College of Medical Laboratory Professionals of Saskatchewan (CMLPSK)",
        url: "https://cmlpsk.ca/",
        required: true,
        note: "Uses the CAMLPR PLA and exams.",
      },
      {
        code: "MB",
        province: "Manitoba",
        regulator: "College of Medical Laboratory Technologists of Manitoba (CMLTM)",
        url: "https://www.cmltm.ca/",
        required: true,
        note: "Uses the CAMLPR PLA and exams.",
      },
      {
        code: "ON",
        province: "Ontario",
        regulator: "College of Medical Laboratory Technologists of Ontario (CMLTO)",
        url: "https://www.cmlto.com/",
        required: true,
        note: "Uses the CAMLPR PLA and exams.",
      },
      {
        code: "QC",
        province: "Quebec",
        regulator: "Ordre professionnel des technologistes médicaux du Québec (OPTMQ)",
        url: "https://www.optmq.org/devenir-membre/candidat-forme-hors-canada.html",
        required: true,
        note: "Own equivalence process; French required.",
      },
      {
        code: "NB",
        province: "New Brunswick",
        regulator: "New Brunswick Society of Medical Laboratory Technologists (NBSMLT)",
        url: "https://nbsmlt.nb.ca/",
        required: true,
        note: "Uses the CAMLPR PLA and exams.",
      },
      {
        code: "NS",
        province: "Nova Scotia",
        regulator: "Nova Scotia Regulator of Medical Laboratory Sciences (NSRMLS)",
        url: "https://nsrmls.ca/",
        required: true,
        note: "Uses the CAMLPR PLA and exams.",
      },
      {
        code: "PE",
        province: "Prince Edward Island",
        regulator: "College of Allied Health Professionals of Prince Edward Island (CAHPPEI)",
        url: "https://www.cahppei.ca/",
        required: true,
        note: "Uses the CAMLPR PLA and exams.",
      },
      {
        code: "NL",
        province: "Newfoundland and Labrador",
        regulator: "Newfoundland and Labrador College of Medical Laboratory Sciences (NLCMLS)",
        url: "https://www.nlcmls.ca/",
        required: true,
        note: "Uses the CAMLPR PLA and exams.",
      },
      {
        code: "YT",
        province: "Yukon",
        regulator: "Not regulated",
        url: "",
        required: false,
        note: "No regulator. Employers set requirements, usually CSMLS or CAMLPR credentials.",
      },
      {
        code: "NT",
        province: "Northwest Territories",
        regulator: "Not regulated",
        url: "",
        required: false,
        note: "No regulator. Employers set requirements, usually CSMLS or CAMLPR credentials.",
      },
      {
        code: "NU",
        province: "Nunavut",
        regulator: "Not regulated",
        url: "",
        required: false,
        note: "No regulator. Employers set requirements, usually CSMLS or CAMLPR credentials.",
      },
    ],
    faqs: [
      {
        q: "How can a foreign-trained medical lab technologist work in Canada?",
        a: "Apply for a Prior Learning Assessment, usually with CAMLPR. It compares your education and clinical experience with Canadian standards. If your training is substantially equivalent, you can write the Fields-of-Practice exams. After you pass, register with the regulator in your province. Alberta General MLT registration uses the CSMLS process, and Quebec uses the OPTMQ process.",
      },
      {
        q: "Do I still need CSMLS certification to work as an MLT in Canada?",
        a: "It depends on the province. Since November 2025, most provinces register internationally educated applicants through CAMLPR exams, not the CSMLS exam. Alberta still uses the CSMLS PLA and exam for its General MLT register. In places with no regulator, such as the territories, many employers still ask for CSMLS certification.",
      },
      {
        q: "Is medical laboratory technology regulated in British Columbia?",
        a: "Not yet. The College of Physicians and Surgeons of BC will license medical laboratory technologists from November 29, 2027, and the title will then be protected. Until that date, BC employers set their own requirements and usually ask for CSMLS certification. Check the CPSBC site for the application stream that applies to you.",
      },
    ],
    sources: [
      {
        url: "https://camlpr.org/become-an-mlt/prior-learning-assessment/",
        supports: "nationalBodies, steps, PLA participating jurisdictions incl. BC and territories, Alberta and Quebec exceptions, timeline",
      },
      {
        url: "https://camlpr.org/become-an-mlt/fields-of-practice-exams/",
        supports: "recentChange, exams, field-based registration",
      },
      {
        url: "https://camlpr.org/become-an-mlt/fields-of-practice-exams/eligibility/",
        supports: "exams, provinces using CAMLPR exams",
      },
      {
        url: "https://camlpr.org/camlpr/member-organizations/",
        supports: "regulator names and URLs for SK, MB, ON, QC, NB, NS, PE, NL",
      },
      {
        url: "https://camlpr.org/wp-content/uploads/2025/08/I-03.-Language-Policy-July-28-2025.-FINAL.pdf",
        supports: "language",
      },
      {
        url: "https://csmls.org/certification/how-to-become-certified/upcoming-transition-of-prior-learning-assessment-services-to-camlpr/",
        supports: "recentChange (June 2025 PLA transition)",
      },
      {
        url: "https://csmls.org/certification/how-to-become-certified/internationally-educated-medical-laboratory-technologists-iemlt/",
        supports: "CSMLS role for Alberta",
      },
      {
        url: "https://www.cmlta.org/registration/camlpr-assessments-and-csmls-certification/",
        supports: "Alberta pathway, CSMLS agreement, fields of practice",
      },
      { url: "https://www.cpsbc.ca/news/4professions", supports: "BC regulation from November 29, 2027" },
      {
        url: "https://www.optmq.org/devenir-membre/candidat-forme-hors-canada.html",
        supports: "Quebec pathway",
      },
    ],
    lastVerified: "September 2026",
    confidence: "medium",
  },
  {
    slug: "engineer",
    name: "Professional engineer",
    shortName: "Engineer",
    plural: "professional engineers",
    group: "professional",
    seoTitle: "How Foreign-Trained Engineers Get a P.Eng. Licence in Canada",
    seoDescription: "Internationally trained engineers: degree assessment, the NPPE, Canadian experience rules, and the engineering regulator in every province and territory.",
    h1: "How to Get an Engineering Licence (P.Eng.) in Canada as an Internationally Trained Engineer",
    firstStep: "Academic assessment by the regulator",
    examShort: "NPPE (OIQ exam in Quebec)",
    nocCodes: [
      { noc: "21300", title: "Civil engineers" },
      { noc: "21301", title: "Mechanical engineers" },
      { noc: "21310", title: "Electrical and electronics engineers" },
      { noc: "21311", title: "Computer engineers (except software engineers and designers)" },
      { noc: "21320", title: "Chemical engineers" },
      { noc: "21321", title: "Industrial and manufacturing engineers" },
      { noc: "21322", title: "Metallurgical and materials engineers" },
      { noc: "21330", title: "Mining engineers" },
      { noc: "21331", title: "Geological engineers" },
      { noc: "21332", title: "Petroleum engineers" },
      { noc: "21390", title: "Aerospace engineers" },
      { noc: "21399", title: "Other professional engineers" },
    ],
    regulatedIn: "all",
    protectedTitles: ["Professional Engineer", "P.Eng.", "Engineer", "ing. (Quebec)"],
    lead: "An internationally trained engineer must get a licence from the engineering regulator in the province or territory where they will work before they can practise engineering or use the title engineer. The regulator assesses your degree and work experience, and you must pass a law and ethics exam. You can apply before you arrive.",
    nationalBodies: [
      {
        name: "Engineers Canada",
        url: "https://engineerscanada.ca/",
        role: "National body of the 12 regulators; it sets national licensing guidelines and runs the EngineerHere.ca resource for international graduates, but it does not issue licences.",
      },
      {
        name: "National Professional Practice Exam (NPPE), coordinated by APEGA",
        url: "https://www.apega.ca/apply/membership/exams/national-professional-practice-exam-nppe",
        role: "The law, ethics, and professionalism exam that all regulators except Quebec use; you register through your own regulator.",
      },
    ],
    steps: [
      {
        title: "Choose your province or territory",
        body: "Each of the 12 engineering regulators licenses only for its own jurisdiction. Apply to the regulator where you plan to work.",
      },
      {
        title: "Get your degree assessed",
        body: "The regulator compares your engineering degree to a Canadian Engineering Accreditation Board (CEAB) program. Many regulators ask for a World Education Services (WES) evaluation, and some degrees from Washington Accord countries are accepted without further exams.",
      },
      {
        title: "Write any assigned exams",
        body: "If the regulator finds gaps, it assigns confirmatory or technical exams, or a program such as Manitoba's IEEQ. Some regulators reduce or waive exams for applicants with long professional experience.",
      },
      {
        title: "Register as an engineer-in-training",
        body: "Once your academics are accepted, you can register as an Engineer-in-Training (EIT, or CPI in Quebec) while you complete the experience requirement.",
      },
      {
        title: "Show your work experience",
        body: "Most regulators require about 48 months of engineering experience, assessed through a competency-based assessment. Several regulators now let you show Canadian work environment competencies with experience from outside Canada.",
      },
      {
        title: "Pass the NPPE and apply for P.Eng.",
        body: "Pass the National Professional Practice Exam (in Quebec, the OIQ professional exam), show language ability, and apply for the P.Eng. (ing. in Quebec) licence.",
      },
    ],
    exams: [
      "National Professional Practice Exam, NPPE (all regulators except Quebec)",
      "OIQ professional exam (Quebec)",
      "Confirmatory or technical exams, only if the regulator assigns them",
    ],
    language: "You must show you can work in English or French, and each regulator sets which proofs and minimum scores it accepts. In Quebec, the OIQ requires appropriate knowledge of French to issue a permit, usually shown by studies in French or the OQLF exam.",
    recentChange: {
      text: "July 2026: APEGA (Alberta) removed the requirement for one year of Canadian work experience for engineers. Applicants now show 8 Canadian work environment competencies in the competency-based assessment, and can use experience from outside Canada.",
      source: "https://www.apega.ca/news/2026/06/29/streamlining-the-competency-based-assessment-process-for-engineering-applicants",
    },
    workWhileLicensing: [
      {
        role: "Civil engineering technologist or technician",
        noc: "22300",
        note: "You can work under a licensed engineer's supervision, but you cannot use the title engineer or sign off engineering work.",
      },
      {
        role: "Mechanical engineering technologist or technician",
        noc: "22301",
        note: "A common bridge job; the experience can count toward your competency assessment if a licensed engineer supervises it.",
      },
      {
        role: "Electrical and electronics engineering technologist or technician",
        noc: "22310",
        note: "Separate voluntary technologist certification exists in each province, and some of those titles are also protected.",
      },
      {
        role: "Drafting technologist or technician",
        noc: "22212",
        note: "Produces drawings for engineers; no engineering licence needed, but you cannot take professional responsibility for designs.",
      },
    ],
    regulators: [
      {
        code: "BC",
        province: "British Columbia",
        regulator: "Engineers and Geoscientists British Columbia (EGBC)",
        url: "https://www.egbc.ca/",
        required: true,
        note: "International experience can meet the 8 Canadian environment competencies.",
      },
      {
        code: "AB",
        province: "Alberta",
        regulator: "Association of Professional Engineers and Geoscientists of Alberta (APEGA)",
        url: "https://www.apega.ca/apply/membership/professional-member",
        required: true,
        note: "One year of Canadian experience no longer required from July 18, 2026.",
      },
      {
        code: "SK",
        province: "Saskatchewan",
        regulator: "Association of Professional Engineers and Geoscientists of Saskatchewan (APEGS)",
        url: "https://www.apegs.ca/apply",
        required: true,
        note: "Uses confidence levels for academic and experience review since January 2024.",
      },
      {
        code: "MB",
        province: "Manitoba",
        regulator: "Engineers Geoscientists Manitoba",
        url: "https://www.enggeomb.ca/IEP.html",
        required: true,
        note: "Offers the IEEQ program as one route to meet academic gaps.",
      },
      {
        code: "ON",
        province: "Ontario",
        regulator: "Professional Engineers Ontario (PEO)",
        url: "https://www.peo.on.ca/",
        required: true,
        note: "Removed the Canadian experience requirement on May 15, 2023.",
      },
      {
        code: "QC",
        province: "Quebec",
        regulator: "Ordre des ingénieurs du Québec (OIQ)",
        url: "https://www.oiq.qc.ca/futurs-membres/devenir-ingenieur-au-quebec/diplomees-hors-canada/",
        required: true,
        note: "CPI program: 24 months supervised experience, own professional exam, French required.",
      },
      {
        code: "NB",
        province: "New Brunswick",
        regulator: "Engineers and Geoscientists New Brunswick",
        url: "https://www.apegnb.com/",
        required: true,
        note: "Asks for a WES course-by-course report for degrees from outside Canada.",
      },
      {
        code: "NS",
        province: "Nova Scotia",
        regulator: "Engineers Nova Scotia",
        url: "https://engineersnovascotia.ca/registration/internationally-educated-engineers/",
        required: true,
        note: "You can apply for assessment before you arrive in Canada.",
      },
      {
        code: "PE",
        province: "Prince Edward Island",
        regulator: "Engineers PEI",
        url: "https://www.engineerspei.com/",
        required: true,
      },
      {
        code: "NL",
        province: "Newfoundland and Labrador",
        regulator: "Professional Engineers and Geoscientists Newfoundland and Labrador (PEGNL)",
        url: "https://pegnl.ca/applicant/registration-requirements/",
        required: true,
        note: "Minimum 4 years of experience plus a competency-based assessment.",
      },
      {
        code: "YT",
        province: "Yukon",
        regulator: "Engineers Yukon",
        url: "https://www.engineersyukon.ca/",
        required: true,
      },
      {
        code: "NT",
        province: "Northwest Territories",
        regulator: "Northwest Territories and Nunavut Association of Professional Engineers and Geoscientists (NAPEG)",
        url: "https://www.napeg.nt.ca/",
        required: true,
        note: "One regulator serves both NT and NU.",
      },
      {
        code: "NU",
        province: "Nunavut",
        regulator: "Northwest Territories and Nunavut Association of Professional Engineers and Geoscientists (NAPEG)",
        url: "https://www.napeg.nt.ca/",
        required: true,
        note: "Same regulator as the Northwest Territories.",
      },
    ],
    faqs: [
      {
        q: "Do software engineers need a licence in Canada?",
        a: "It depends on the title and the work. The engineering regulators say the title engineer, including software engineer, is protected and needs a licence. Most software jobs do not involve regulated engineering work, so many employers use titles such as software developer. Alberta exempted the title software engineer from its protection in 2023. Check your province before you use the title.",
      },
      {
        q: "Do I need Canadian work experience to become a P.Eng.?",
        a: "Not always. Ontario removed its Canadian experience requirement in May 2023, and Alberta removed its one-year requirement for engineers in July 2026. BC and other regulators assess 8 Canadian work environment competencies, which you can try to meet with experience from outside Canada. You still need about 48 months of total engineering experience in most provinces.",
      },
      {
        q: "Can I work as an engineer while my licence is in progress?",
        a: "You can work in engineering under the supervision of a licensed engineer, often as an Engineer-in-Training or in a technologist role. You cannot call yourself an engineer, practise on your own, or take professional responsibility for engineering work until the regulator gives you a licence. Supervised work can count toward your experience requirement.",
      },
    ],
    sources: [
      {
        url: "https://engineerscanada.ca/regulatory-excellence/engineering-regulators",
        supports: "regulators (names and home URLs)",
      },
      {
        url: "https://engineerscanada.ca/become-an-engineer/overview-of-licensing-process",
        supports: "steps, language, protectedTitles",
      },
      {
        url: "https://www.apega.ca/news/2026/06/29/streamlining-the-competency-based-assessment-process-for-engineering-applicants",
        supports: "recentChange, regulators AB note, faqs",
      },
      {
        url: "https://www.apega.ca/apply/membership/professional-member/work-experience/engineers",
        supports: "steps (48 months, competency-based assessment, Canadian environment competencies)",
      },
      {
        url: "https://www.apega.ca/apply/membership/exams/national-professional-practice-exam-nppe",
        supports: "nationalBodies, exams",
      },
      {
        url: "https://www.apegs.ca/assets/new-registration-assessment-processes.pdf",
        supports: "steps (academic assessment, WES, Washington Accord), regulators SK note",
      },
      {
        url: "https://www.peo.on.ca/apply/licensing-changes",
        supports: "regulators ON note, faqs (Canadian experience removed May 15, 2023)",
      },
      {
        url: "https://www.egbc.ca/getmedia/69db5556-d559-4418-9a0f-df552790bb59/Canadian-Environment-Experience-Competencies-Guide-for-Applicants-and-Assessors.pdf.aspx",
        supports: "regulators BC note, faqs",
      },
      {
        url: "https://www.oiq.qc.ca/futurs-membres/devenir-ingenieur-au-quebec/diplomees-hors-canada/",
        supports: "regulators QC note, exams, language",
      },
      {
        url: "https://www.enggeomb.ca/IEP.html",
        supports: "steps (IEEQ, intern, NPPE), regulators MB note",
      },
      {
        url: "https://engineersnovascotia.ca/registration/internationally-educated-engineers/",
        supports: "steps (EIT, exams waived for 10+ years experience), regulators NS note",
      },
      { url: "https://pegnl.ca/applicant/registration-requirements/", supports: "regulators NL note" },
      {
        url: "https://engineerscanada.ca/news-and-events/news/engineering-regulators-reiterate-licensure-requirements-for-those-using-software-engineer-and-other-it-titles",
        supports: "faqs (software engineer title)",
      },
      {
        url: "https://www.apega.ca/news/regulating-software-engineers",
        supports: "faqs (Alberta software engineer exemption, 2023)",
      },
    ],
    lastVerified: "September 2026",
    confidence: "medium",
  },
  {
    slug: "accountant",
    name: "Accountant",
    shortName: "Accountant (CPA)",
    plural: "accountants",
    group: "professional",
    seoTitle: "How Foreign-Trained Accountants Become a CPA in Canada",
    seoDescription: "Most accounting jobs in Canada need no licence. How foreign-trained accountants earn the CPA: recognition agreements, the CFE, and each province's CPA body.",
    h1: "How to Work as an Accountant and Become a CPA in Canada with Foreign Credentials",
    firstStep: "Check for a CPA recognition agreement",
    examShort: "CFE (for the CPA title)",
    nocCodes: [
      { noc: "11100", title: "Financial auditors and accountants" },
    ],
    regulatedIn: "all",
    protectedTitles: ["Chartered Professional Accountant", "CPA"],
    regulatedLabel: "CPA title only",
    lead: "Most accounting jobs in Canada are not regulated, so an internationally trained accountant can often start work without a licence. To use the CPA title, or to sign audits as a public accountant, you must join the CPA body in your province or territory. Your foreign designation decides how much of the CPA program you must complete.",
    nationalBodies: [
      {
        name: "Chartered Professional Accountants of Canada (CPA Canada)",
        url: "https://www.cpacanada.ca/",
        role: "Negotiates international recognition agreements with foreign accounting bodies; the provincial and territorial CPA bodies admit members and issue licences.",
      },
      {
        name: "CPA Western School of Business (CPAWSB)",
        url: "https://www.cpawsb.ca/future-learners/apply-for-admission-to-cpawsb/ifac-members/",
        role: "Delivers the CPA Professional Education Program in BC, Alberta, Saskatchewan, Manitoba, and the territories, including the route for members of IFAC accounting bodies.",
      },
    ],
    steps: [
      {
        title: "Decide if you need the CPA",
        body: "Bookkeeping, tax preparation, and most corporate accounting jobs do not need a licence. You need CPA membership to use the CPA title, and a public accounting licence from the CPA body to sign audit or review reports.",
      },
      {
        title: "Check your designation for an agreement",
        body: "Members of bodies with a recognition agreement, such as AICPA/NASBA, ICAEW, ICAS, Chartered Accountants Ireland, CA ANZ, HKICPA, SAICA, ICAZ, and IMCP, can apply for the CPA through a shorter route. These members usually need 2 years of practice in their home jurisdiction.",
      },
      {
        title: "Complete the reciprocity requirement",
        body: "Agreement applicants who are admitted must complete the CPA Reciprocity Professional Development course, or pass the CPA Reciprocity Examination, within 2 years of admission.",
      },
      {
        title: "Otherwise, get your education assessed",
        body: "Without an agreement, the CPA body assesses your degree, often through a World Education Services (WES) course-by-course report. Members of other IFAC bodies, such as ACCA, CIMA, or ICAI, can get course waivers or challenge exams.",
      },
      {
        title: "Finish the CPA program and CFE",
        body: "Complete the CPA Professional Education Program (PEP) and pass the Common Final Examination (CFE). You also need 30 months of relevant practical experience; some prior international experience can count toward it.",
      },
      {
        title: "Apply for membership, then licensing",
        body: "Apply to the CPA body in your province or territory. If you want to do public accounting, apply separately for a public accounting licence.",
      },
    ],
    exams: [
      "Common Final Examination, CFE (all provinces and territories)",
      "CPA Reciprocity Examination (optional for agreement applicants, in place of the reciprocity course)",
      "Challenge exams for CPA PEP modules (for some IFAC members with experience)",
    ],
    language: "Outside Quebec, the CPA bodies do not list a separate English test for the CPA program, but the program needs strong English. In Quebec, the Ordre des CPA du Québec requires knowledge of French, shown by French studies or the OQLF exam; a one-year renewable temporary permit may be possible.",
    recentChange: {
      text: "March 2026: CPA Canada renewed its recognition agreements with NASBA, AICPA, IMCP, CMPIC, ICAS, ICAEW, and Chartered Accountants Ireland, with more to follow. Each provincial CPA body must ratify them. ACCA's agreement ended in April 2021, so ACCA members use the IFAC member route.",
      source: "https://www.cpacanada.ca/the-cpa-profession/about-cpa-canada/media-centre/2026/mar/renewed-agreements",
    },
    workWhileLicensing: [
      {
        role: "Accountant or financial auditor (not CPA)",
        noc: "11100",
        note: "You can do most accounting work without a licence, but you cannot call yourself a CPA or sign audit or review reports.",
      },
      {
        role: "Accounting technician or bookkeeper",
        noc: "12200",
        note: "No licence needed; the work can build the practical experience the CPA route asks for if it is at the right level.",
      },
      { role: "Accounting clerk", noc: "14200", note: "An entry job with no licence requirement." },
      {
        role: "Financial analyst",
        noc: "11101",
        note: "Not regulated; some roles ask for other designations such as CFA, which are voluntary.",
      },
    ],
    regulators: [
      {
        code: "BC",
        province: "British Columbia",
        regulator: "Chartered Professional Accountants of British Columbia (CPABC)",
        url: "https://www.bccpa.ca/become-a-cpa/admissions/internationally-designated-accountants/",
        required: true,
      },
      {
        code: "AB",
        province: "Alberta",
        regulator: "Chartered Professional Accountants of Alberta (CPA Alberta)",
        url: "https://www.cpaalberta.ca/Become-a-CPA/Internationally-Educated",
        required: true,
      },
      {
        code: "SK",
        province: "Saskatchewan",
        regulator: "Chartered Professional Accountants of Saskatchewan (CPA Saskatchewan)",
        url: "https://cpask.ca/",
        required: true,
      },
      {
        code: "MB",
        province: "Manitoba",
        regulator: "Chartered Professional Accountants of Manitoba (CPA Manitoba)",
        url: "https://cpamb.ca/main/main/Become-a-CPA/International-Credential-Recognition.aspx",
        required: true,
        note: "Also lists MOUs with CIMA, ICAN, ICAI, ICAP, and ICMAP.",
      },
      {
        code: "ON",
        province: "Ontario",
        regulator: "Chartered Professional Accountants of Ontario (CPA Ontario)",
        url: "https://www.cpaontario.ca/become-a-cpa/internationally-trained-accountant",
        required: true,
      },
      {
        code: "QC",
        province: "Quebec",
        regulator: "Ordre des comptables professionnels agréés du Québec (CPA Québec)",
        url: "https://equivalence.cpaquebec.ca/en",
        required: true,
        note: "French knowledge required for a permanent permit.",
      },
      {
        code: "NB",
        province: "New Brunswick",
        regulator: "Chartered Professional Accountants of New Brunswick (CPA New Brunswick)",
        url: "https://www.cpanewbrunswick.ca/",
        required: true,
      },
      {
        code: "NS",
        province: "Nova Scotia",
        regulator: "Chartered Professional Accountants of Nova Scotia (CPA Nova Scotia)",
        url: "https://www.cpans.ca/",
        required: true,
      },
      {
        code: "PE",
        province: "Prince Edward Island",
        regulator: "Chartered Professional Accountants of Prince Edward Island (CPA PEI)",
        url: "https://www.cpapei.ca/",
        required: true,
      },
      {
        code: "NL",
        province: "Newfoundland and Labrador",
        regulator: "Chartered Professional Accountants of Newfoundland and Labrador (CPA NL)",
        url: "https://cpanl.ca/",
        required: true,
      },
      {
        code: "YT",
        province: "Yukon",
        regulator: "Chartered Professional Accountants of Yukon (CPA Yukon)",
        url: "https://www.bccpa.ca/cpa-yukon/",
        required: true,
        note: "CPABC runs membership, practice, and discipline functions for CPA Yukon.",
      },
      {
        code: "NT",
        province: "Northwest Territories",
        regulator: "Chartered Professional Accountants of the Northwest Territories and Nunavut (CPA NWT/NU)",
        url: "https://cpa-nwt-nu.ca/",
        required: true,
        note: "One body serves both NT and NU.",
      },
      {
        code: "NU",
        province: "Nunavut",
        regulator: "Chartered Professional Accountants of the Northwest Territories and Nunavut (CPA NWT/NU)",
        url: "https://cpa-nwt-nu.ca/",
        required: true,
        note: "Same body as the Northwest Territories.",
      },
    ],
    faqs: [
      {
        q: "Do I need a CPA to work as an accountant in Canada?",
        a: "No, not for most jobs. Accounting work in a company, bookkeeping, and tax preparation are not regulated. The CPA title is protected in every province and territory, so you need CPA membership to use it. To sign audit or review reports for the public, you usually also need a public accounting licence from your CPA body.",
      },
      {
        q: "Is ACCA recognized in Canada?",
        a: "ACCA no longer has a mutual recognition agreement with CPA Canada; it ended on April 30, 2021. ACCA members can still use the route for members of IFAC accounting bodies. This route can give course waivers or challenge exams, but you must still pass the Common Final Examination and meet the 30-month practical experience requirement.",
      },
      {
        q: "Can a US CPA or UK chartered accountant get the Canadian CPA?",
        a: "Yes, through a recognition agreement. AICPA/NASBA, ICAEW, ICAS, and Chartered Accountants Ireland members are covered, among others. You usually need 2 years of practice in your home jurisdiction, and after admission you must complete the CPA Reciprocity Professional Development course or pass the reciprocity exam within 2 years.",
      },
    ],
    sources: [
      {
        url: "https://www.cpacanada.ca/the-cpa-profession/about-cpa-canada/media-centre/2026/mar/renewed-agreements",
        supports: "recentChange (March 10, 2026 renewals; text confirmed via the GlobeNewswire release at bnnbloomberg.ca because cpacanada.ca blocks automated reads)",
      },
      {
        url: "https://www.bnnbloomberg.ca/press-releases/2026/03/10/cpa-canada-renews-international-agreements-to-strengthen-global-recognition/",
        supports: "recentChange (CPA Canada press release text, ratification by provincial bodies)",
      },
      {
        url: "https://www.bccpa.ca/become-a-cpa/admissions/internationally-designated-accountants/mra-rma-agreements/",
        supports: "steps (agreement list, 2 years of practice, reciprocity course or exam), faqs",
      },
      {
        url: "https://cpamb.ca/main/main/Become-a-CPA/International-Credential-Recognition.aspx",
        supports: "steps (agreement list, MOUs, route for other bodies), regulators MB note",
      },
      {
        url: "https://www.cpawsb.ca/future-learners/apply-for-admission-to-cpawsb/ifac-members/",
        supports: "steps (IFAC route, challenge exams, CFE, 30 months), exams, language",
      },
      {
        url: "https://www.cpaalberta.ca/Become-a-CPA/Internationally-Educated",
        supports: "steps (WES evaluation, PEP, CFE, 30 months)",
      },
      {
        url: "https://www.accaglobal.com/us/en/member/membership/moving-abroad/moving-to-canada/cpa-canada-faqs.html",
        supports: "recentChange, faqs (ACCA agreement ended April 30, 2021)",
      },
      {
        url: "https://cpaquebec.ca/en/future-cpas/how-to-become-a-cpa/knowledge-of-french/",
        supports: "language, regulators QC note",
      },
      {
        url: "https://www.jobbank.gc.ca/marketreport/requirements/124/NT",
        supports: "regulators NT/NU (CPA NWT/NU), public accounting licensing statement, regulatedIn",
      },
      {
        url: "https://www.jobbank.gc.ca/marketreport/requirements/150/NU",
        supports: "regulators NU, public accounting licensing",
      },
      {
        url: "https://www.jobbank.gc.ca/marketreport/requirements/124/YT",
        supports: "regulators YT (regulated, served through CPABC)",
      },
      { url: "https://www.bccpa.ca/cpa-yukon/", supports: "regulators YT note" },
    ],
    lastVerified: "September 2026",
    confidence: "medium",
  },
  {
    slug: "lawyer",
    name: "Lawyer",
    shortName: "Lawyer",
    plural: "lawyers",
    group: "professional",
    seoTitle: "How Foreign-Trained Lawyers Get Licensed in Canada (NCA)",
    seoDescription: "How to become a lawyer in Canada with a foreign law degree: the NCA assessment and exams, bar admission, articling, and the law society in each province.",
    h1: "How to Become a Lawyer in Canada with a Foreign Law Degree",
    firstStep: "NCA assessment",
    examShort: "NCA exams, then bar exams",
    nocCodes: [
      { noc: "41101", title: "Lawyers and Quebec notaries" },
    ],
    regulatedIn: "all",
    protectedTitles: ["Lawyer", "Barrister", "Solicitor", "Avocat (Quebec)", "Notaire (Quebec)"],
    lead: "An internationally trained lawyer must be licensed by the law society of the province or territory where they will practise. Outside Quebec, you first get a Certificate of Qualification from the National Committee on Accreditation (NCA), then complete the law society's bar admission training, articling, and exams. Quebec uses civil law and its own process.",
    nationalBodies: [
      {
        name: "National Committee on Accreditation (NCA), Federation of Law Societies of Canada",
        url: "https://nca.legal/",
        role: "Assesses your law degree and experience, assigns exams or courses, and issues the Certificate of Qualification that common law societies accept for bar admission.",
      },
      {
        name: "Canadian Centre for Professional Legal Education (CPLED)",
        url: "https://www.cpled.ca/",
        role: "Runs PREP, the bar admission course used in Alberta, Saskatchewan, Manitoba, Nova Scotia, and now BC, and the Indigenous law course the NCA accepts.",
      },
    ],
    steps: [
      {
        title: "Apply to the NCA for assessment",
        body: "Apply online to the National Committee on Accreditation. Since March 1, 2026, you must also complete a language screening in English or French, or send an accepted IRCC test, before the NCA issues its decision.",
      },
      {
        title: "Complete your assigned NCA requirements",
        body: "Most applicants must show competence in 5 Canadian subjects: administrative, constitutional, and criminal law, professional responsibility, and foundations of Canadian law. You do this through NCA exams or courses at a Canadian law school, plus any other subjects the NCA assigns.",
      },
      {
        title: "Complete the Indigenous law requirement",
        body: "Since March 1, 2026, the NCA requires competence in Indigenous law and peoples, through a CPLED course or another course the NCA accepts.",
      },
      {
        title: "Get your Certificate of Qualification",
        body: "The NCA issues the Certificate of Qualification when you finish your requirements. It does not license you; it lets you apply to a common law society for bar admission.",
      },
      {
        title: "Complete the law society licensing process",
        body: "Each law society sets its own path. For example, Ontario requires barrister and solicitor exams plus articling, the Law Practice Program, or an exemption; BC requires the PREP course and 9 months of articling or clerkship.",
      },
      {
        title: "In Quebec, apply to the Barreau",
        body: "The NCA does not cover Quebec. Apply to the Barreau du Québec equivalence committee, then complete the École du Barreau program and articling. Notaries apply to the Chambre des notaires du Québec.",
      },
    ],
    exams: [
      "NCA exams in assigned subjects (common law provinces and territories)",
      "Law Society of Ontario barrister and solicitor licensing exams (Ontario)",
      "PREP assessments, CPLED (Alberta, Saskatchewan, Manitoba, Nova Scotia, British Columbia)",
      "École du Barreau exams (Quebec)",
    ],
    language: "Since March 1, 2026, all NCA applicants must pass an NCA language screening in English or French, or send an IRCC-accepted test with the minimum scores the NCA sets. In Quebec, the Barreau du Québec and Chambre des notaires require adequate knowledge of French.",
    recentChange: {
      text: "March 1, 2026: the NCA added a mandatory language screening in English or French and a new Indigenous law and peoples requirement for all applicants. Also in 2026, the Law Society of British Columbia replaced its PLTC course with the CPLED PREP program.",
      source: "https://nca.legal/wp-content/uploads/2026/03/FLSC_NCA_Policy_March2026eng_v1.5.pdf",
    },
    workWhileLicensing: [
      {
        role: "Paralegal or legal assistant",
        noc: "42200",
        note: "Work under a lawyer's supervision; you cannot give legal advice on your own. Check whether your province licenses independent paralegals.",
      },
      {
        role: "Legal administrative assistant",
        noc: "13111",
        note: "No licence needed; you cannot give legal advice.",
      },
      { role: "Court clerk", noc: "14103", note: "Government court services job; no law licence needed." },
    ],
    regulators: [
      {
        code: "BC",
        province: "British Columbia",
        regulator: "Law Society of British Columbia",
        url: "https://www.lawsociety.bc.ca/licensing/",
        required: true,
        note: "PREP course plus 9 months of articling or clerkship; PLTC retired in 2026.",
      },
      {
        code: "AB",
        province: "Alberta",
        regulator: "Law Society of Alberta",
        url: "https://www.lawsociety.ab.ca/",
        required: true,
        note: "Uses the CPLED PREP bar admission program.",
      },
      {
        code: "SK",
        province: "Saskatchewan",
        regulator: "Law Society of Saskatchewan",
        url: "https://www.lawsociety.sk.ca/",
        required: true,
        note: "Uses the CPLED PREP bar admission program.",
      },
      {
        code: "MB",
        province: "Manitoba",
        regulator: "Law Society of Manitoba",
        url: "https://lawsociety.mb.ca/",
        required: true,
        note: "Uses the CPLED PREP bar admission program.",
      },
      {
        code: "ON",
        province: "Ontario",
        regulator: "Law Society of Ontario (LSO)",
        url: "https://lso.ca/becoming-licensed/lawyer-licensing-process",
        required: true,
        note: "Barrister and solicitor exams plus articling or LPP/PPD. Reform to replace exams under consultation.",
      },
      {
        code: "QC",
        province: "Quebec",
        regulator: "Barreau du Québec",
        url: "https://www.barreau.qc.ca/en/prospective-members/foreign-lawyer-jurist/",
        required: true,
        note: "Civil law; NCA not used. Notaries: Chambre des notaires du Québec (cnq.org).",
      },
      {
        code: "NB",
        province: "New Brunswick",
        regulator: "Law Society of New Brunswick",
        url: "https://lawsociety-barreau.nb.ca/",
        required: true,
      },
      {
        code: "NS",
        province: "Nova Scotia",
        regulator: "Nova Scotia Barristers' Society",
        url: "https://nsbs.org/",
        required: true,
        note: "Uses the CPLED PREP bar admission program.",
      },
      {
        code: "PE",
        province: "Prince Edward Island",
        regulator: "Law Society of Prince Edward Island",
        url: "https://lawsocietypei.ca/",
        required: true,
      },
      {
        code: "NL",
        province: "Newfoundland and Labrador",
        regulator: "Law Society of Newfoundland and Labrador",
        url: "https://lsnl.ca/",
        required: true,
      },
      {
        code: "YT",
        province: "Yukon",
        regulator: "Law Society of Yukon",
        url: "https://www.lawsocietyyukon.com/",
        required: true,
      },
      {
        code: "NT",
        province: "Northwest Territories",
        regulator: "Law Society of the Northwest Territories",
        url: "https://lawsociety.nt.ca/",
        required: true,
      },
      {
        code: "NU",
        province: "Nunavut",
        regulator: "Law Society of Nunavut",
        url: "https://www.lawsociety.nu.ca/",
        required: true,
      },
    ],
    faqs: [
      {
        q: "How do foreign lawyers get licensed in Canada?",
        a: "Outside Quebec, apply to the National Committee on Accreditation for an assessment. Complete the exams or courses it assigns, usually at least 5 Canadian law subjects, and get a Certificate of Qualification. Then apply to your province's law society and complete its bar admission course, exams, and articling. In Quebec, apply to the Barreau du Québec instead.",
      },
      {
        q: "Does the NCA certificate let me practise law?",
        a: "No. The NCA Certificate of Qualification shows that your knowledge of Canadian law is similar to a graduate of an approved Canadian law school. It does not admit you to the bar. You must still apply to the law society in your province or territory and meet its licensing requirements, such as training, articling, and good character.",
      },
      {
        q: "Can I practise in Quebec with a common law degree from abroad?",
        a: "Quebec uses civil law, so the NCA process does not apply there. You must apply to the Barreau du Québec for recognition of equivalence, then complete the École du Barreau training and articling. You also need adequate knowledge of French. To work as a Quebec notary, you apply to the Chambre des notaires du Québec.",
      },
    ],
    sources: [
      {
        url: "https://nca.legal/wp-content/uploads/2026/03/FLSC_NCA_Policy_March2026eng_v1.5.pdf",
        supports: "steps (5 core subjects, language screening, Indigenous law), language, recentChange",
      },
      {
        url: "https://nca.legal/process/",
        supports: "steps (process order, Certificate of Qualification)",
      },
      {
        url: "https://nca.legal/faqs/",
        supports: "faqs (certificate is not a licence, civil law case by case, 5 mandatory subjects)",
      },
      {
        url: "https://www.lawsociety.bc.ca/licensing/",
        supports: "regulators BC note (PREP, 9 months articling or clerkship)",
      },
      {
        url: "https://lawsocietyontario-dwd0dscmayfwh7bj.a01.azurefd.net/media/lso/media/about/convocation/2025/convocation-september-2025-professional-development-competence-committee-report.pdf",
        supports: "regulators ON note (exams, articling, LPP/PPD, reform proposal), PREP provinces (AB, SK, MB, NS)",
      },
      {
        url: "https://www.barreau.qc.ca/en/prospective-members/foreign-lawyer-jurist/",
        supports: "regulators QC, language (French)",
      },
      {
        url: "https://www.barreau.qc.ca/en/prospective-members/applying-equivalence/",
        supports: "steps (Quebec equivalence, École du Barreau), faqs",
      },
      { url: "https://flsc.ca/what-we-do/nca/", supports: "nationalBodies" },
    ],
    lastVerified: "September 2026",
    confidence: "medium",
  },
  {
    slug: "teacher",
    name: "Teacher",
    shortName: "Teacher",
    plural: "teachers",
    group: "education-social",
    seoTitle: "How to Become a Teacher in Canada with Foreign Credentials",
    seoDescription: "Internationally educated teachers: Pathways to Teach Canada, language tests, and the teacher certification office in every province and territory.",
    h1: "How to Get a Teaching Certificate in Canada as an Internationally Educated Teacher",
    firstStep: "Pathways to Teach Canada",
    examShort: "Language test, if needed",
    nocCodes: [
      { noc: "41220", title: "Secondary school teachers" },
      { noc: "41221", title: "Elementary school and kindergarten teachers" },
    ],
    regulatedIn: "all",
    protectedTitles: ["Ontario Certified Teacher (OCT)"],
    lead: "A teacher trained outside Canada needs a teaching certificate from the province or territory where they want to teach in public schools. Nine jurisdictions start with a Pathways to Teach Canada credential assessment. Alberta, Ontario and Quebec assess you directly, and Yukon asks for a certificate from another Canadian jurisdiction first.",
    nationalBodies: [
      {
        name: "Pathways to Teach Canada",
        url: "https://pathwaystoteach.ca/get-certified-to-teach",
        role: "Assesses your teaching credentials and language (LCATP) for BC, SK, MB, NB, NS, PE, NL, NT and NU; it does not issue certificates.",
      },
    ],
    steps: [
      {
        title: "Choose where you will teach",
        body: "Each province and territory issues its own certificate. Check if your jurisdiction uses Pathways to Teach Canada; Alberta, Ontario, Quebec and Yukon do not.",
      },
      {
        title: "Get your credentials assessed",
        body: "In the 9 member jurisdictions, get a Credential Assessment Report from Pathways to Teach Canada before you apply. In Alberta, Ontario and Quebec, send your documents to the regulator, which assesses your degree and teacher education itself.",
      },
      {
        title: "Prove English or French proficiency",
        body: "If your teacher education was not in English or French, take the Language Competency Assessment for the Teaching Profession (LCATP) through Pathways to Teach Canada, or a test the regulator accepts. The Ontario College of Teachers and Quebec set their own language requirements.",
      },
      {
        title: "Collect documents and checks",
        body: "Send official transcripts and a statement of professional standing from every place you were certified. Most regulators also ask for a criminal record check; Ontario and Manitoba also require a sexual abuse prevention program.",
      },
      {
        title: "Apply and close any gaps",
        body: "The regulator issues a certificate or lists gaps. You may need extra courses, such as the BC familiarization course or the Saskatchewan bridging programs, and some provinces issue a conditional certificate while you finish them.",
      },
    ],
    exams: [
      "Quebec: language examination for a teaching licence",
      "Language Competency Assessment for the Teaching Profession (LCATP), if your teacher education was not in English or French",
    ],
    language: "You must show proficiency in English or French. Pathways to Teach Canada runs the LCATP for its member jurisdictions, and regulators such as the Ontario College of Teachers and Alberta set their own accepted tests and minimum scores.",
    recentChange: {
      text: "Starting June 1, 2026, Alberta accepts applications for a Conditional Teacher Certificate. It lets eligible internationally educated teachers teach kindergarten to Grade 12 while they complete the requirements for an Interim Professional Certificate.",
      source: "https://www.alberta.ca/expedited-teaching-certificates",
    },
    workWhileLicensing: [
      {
        role: "Educational assistant",
        noc: "43100",
        note: "No teaching certificate is required by the provincial regulator; school boards set their own hiring requirements, often including a criminal record check.",
      },
      {
        role: "Tutor or language instructor",
        noc: "43109",
        note: "Private tutoring and language instruction outside the public school system do not need a provincial teaching certificate.",
      },
    ],
    regulators: [
      {
        code: "BC",
        province: "British Columbia",
        regulator: "Teacher Certification Branch, Ministry of Education and Child Care (standards set by the BC Teachers' Council)",
        url: "https://www2.gov.bc.ca/gov/content/education-training/k-12/teach/become-a-teacher/applying-outside-bc",
        required: true,
        note: "Uses Pathways to Teach Canada. Foreign-trained teachers need a BC Teachers' Council familiarization course.",
      },
      {
        code: "AB",
        province: "Alberta",
        regulator: "Office of the Registrar, Alberta Education and Childcare",
        url: "https://www.alberta.ca/teacher-certification",
        required: true,
        note: "Not in Pathways to Teach Canada; apply directly. Conditional certificate for internationally educated teachers since June 2026.",
      },
      {
        code: "SK",
        province: "Saskatchewan",
        regulator: "Saskatchewan Professional Teachers Regulatory Board (SPTRB)",
        url: "https://sptrb.ca/SPTRB/SPTRB/Certification/International_Teacher_Education_Program.aspx",
        required: true,
        note: "Uses Pathways to Teach Canada. Bridging programs at University of Regina and University of Saskatchewan.",
      },
      {
        code: "MB",
        province: "Manitoba",
        regulator: "Professional Certification Unit, Manitoba Education and Early Childhood Learning",
        url: "https://www.edu.gov.mb.ca/k12/profcert/cert-process/iet.html",
        required: true,
        note: "Pathways to Teach Canada assessment required since October 31, 2025.",
      },
      {
        code: "ON",
        province: "Ontario",
        regulator: "Ontario College of Teachers (OCT)",
        url: "https://www.oct.ca/becoming-a-teacher/internationally-educated-teachers",
        required: true,
        note: "Not in Pathways to Teach Canada; apply directly. Sexual Abuse Prevention Program required.",
      },
      {
        code: "QC",
        province: "Quebec",
        regulator: "Ministère de l'Éducation du Québec",
        url: "https://www.quebec.ca/en/employment/trades-occupations/exploring-trades-occupations/teaching-general-education-youth-sector-vocational-training-adult-education/becoming-teacher",
        required: true,
        note: "Not in Pathways to Teach Canada. A language examination is part of getting a teaching licence.",
      },
      {
        code: "NB",
        province: "New Brunswick",
        regulator: "Office of Teacher Certification, Department of Education and Early Childhood Development",
        url: "https://www2.gnb.ca/content/gnb/en/corporate/promo/office-teacher-certification.html",
        required: true,
        note: "Uses Pathways to Teach Canada as the first step.",
      },
      {
        code: "NS",
        province: "Nova Scotia",
        regulator: "Office of Teacher Certification, Department of Education and Early Childhood Development",
        url: "https://certification.ednet.ns.ca/internationally-educated-teachers",
        required: true,
        note: "Pathways to Teach Canada results must be ready before you apply.",
      },
      {
        code: "PE",
        province: "Prince Edward Island",
        regulator: "Office of the Registrar, Certification and Standards, Department of Education and Early Years",
        url: "https://www.princeedwardisland.ca/en/service/pei-teachers-license-for-applicants-with-an-international-education-degree",
        required: true,
        note: "Member of Pathways to Teach Canada. Website blocks automated checks; content confirmed through search.",
      },
      {
        code: "NL",
        province: "Newfoundland and Labrador",
        regulator: "Office of Teacher Certification and Records, Department of Education and Early Childhood Development",
        url: "https://www.gov.nl.ca/education/k12/teaching/certification/",
        required: true,
        note: "Uses Pathways to Teach Canada. Criminal record and vulnerable sector check required.",
      },
      {
        code: "YT",
        province: "Yukon",
        regulator: "Teacher Certification, Yukon Department of Education",
        url: "https://yukon.ca/en/employment/jobs-schools/apply-yukon-teacher-certificate",
        required: true,
        note: "Requires a teaching certificate from another Canadian jurisdiction first.",
      },
      {
        code: "NT",
        province: "Northwest Territories",
        regulator: "Registrar, Education, Culture and Employment (CertifiED NWT)",
        url: "https://www.ece.gov.nt.ca/en/services/prospective-teacher-information/teacher-qualification-and-certification",
        required: true,
        note: "Uses Pathways to Teach Canada for credentials and language.",
      },
      {
        code: "NU",
        province: "Nunavut",
        regulator: "Teacher Certification, Nunavut Department of Education",
        url: "https://www.gov.nu.ca/en/education-and-schools/teacherprincipal-certification-and-salary-evaluation",
        required: true,
        note: "Uses Pathways to Teach Canada before you apply for teaching jobs.",
      },
    ],
    faqs: [
      {
        q: "Can I teach in Canada with a foreign teaching degree?",
        a: "Yes, but you need a teaching certificate from the province or territory first. In nine jurisdictions you start with a Pathways to Teach Canada assessment of your credentials and language. In Alberta, Ontario and Quebec you apply directly to the regulator. The regulator can issue a certificate or ask you to complete extra courses first.",
      },
      {
        q: "What is Pathways to Teach Canada?",
        a: "Pathways to Teach Canada is a credential and language assessment service run by the Council of Ministers of Education, Canada. It is the first step for internationally educated teachers in BC, Saskatchewan, Manitoba, New Brunswick, Nova Scotia, PEI, Newfoundland and Labrador, Northwest Territories and Nunavut. It does not issue teaching certificates; the provincial regulator does.",
      },
      {
        q: "How do I become a teacher in Ontario if I trained abroad?",
        a: "Apply directly to the Ontario College of Teachers. Send your academic records, statements of professional standing and teaching certificates, prove English or French proficiency, and provide a criminal record check. You must also complete the Sexual Abuse Prevention Program. Only certified members can use the title Ontario Certified Teacher (OCT).",
      },
    ],
    sources: [
      {
        url: "https://pathwaystoteach.ca/get-certified-to-teach",
        supports: "nationalBodies, steps, regulators (member and non-member jurisdictions, regulator links), faqs",
      },
      {
        url: "https://www2.gov.bc.ca/gov/content/education-training/k-12/teach/become-a-teacher/applying-outside-bc",
        supports: "regulators BC",
      },
      {
        url: "https://www2.gov.bc.ca/gov/content/education-training/k-12/teach/become-a-teacher/types/coq-requirements",
        supports: "steps (familiarization course, 24 credits, conditional certificate up to 60 months), language BC",
      },
      {
        url: "https://www.alberta.ca/teacher-certification",
        supports: "regulators AB, language (English or French proficiency), steps",
      },
      {
        url: "https://www.alberta.ca/expedited-teaching-certificates",
        supports: "recentChange (Conditional Teacher Certificate, June 1, 2026), regulators AB (Office of the Registrar)",
      },
      {
        url: "https://sptrb.ca/SPTRB/SPTRB/Certification/International_Teacher_Education_Program.aspx",
        supports: "regulators SK, steps (Pathways, language test, bridging)",
      },
      {
        url: "https://www.edu.gov.mb.ca/k12/profcert/cert-process/iet.html",
        supports: "regulators MB (Pathways required from October 31, 2025; background check; sexual abuse prevention program)",
      },
      {
        url: "https://www.oct.ca/becoming-a-teacher/internationally-educated-teachers",
        supports: "regulators ON, protectedTitles, steps (criminal record check, Sexual Abuse Prevention Program), faqs",
      },
      {
        url: "https://www.oct.ca/becoming-a-teacher/internationally-educated-teachers/proficiency",
        supports: "language (OCT language requirements)",
      },
      {
        url: "https://www.quebec.ca/en/employment/trades-occupations/exploring-trades-occupations/teaching-general-education-youth-sector-vocational-training-adult-education/becoming-teacher",
        supports: "regulators QC, exams (language examination)",
      },
      {
        url: "https://www2.gnb.ca/content/gnb/en/corporate/promo/office-teacher-certification.html",
        supports: "regulators NB",
      },
      {
        url: "https://certification.ednet.ns.ca/internationally-educated-teachers",
        supports: "regulators NS, steps (LCATP, statement of professional standing)",
      },
      {
        url: "https://www.princeedwardisland.ca/en/service/pei-teachers-license-for-applicants-with-an-international-education-degree",
        supports: "regulators PE",
      },
      {
        url: "https://www.gov.nl.ca/education/k12/teaching/certification/",
        supports: "regulators NL, steps (criminal record and vulnerable sector check)",
      },
      {
        url: "https://yukon.ca/en/employment/jobs-schools/apply-yukon-teacher-certificate",
        supports: "regulators YT (certificate from another Canadian jurisdiction required)",
      },
      {
        url: "https://www.ece.gov.nt.ca/en/services/prospective-teacher-information/teacher-qualification-and-certification",
        supports: "regulators NT",
      },
      {
        url: "https://www.gov.nu.ca/en/education-and-schools/teacherprincipal-certification-and-salary-evaluation",
        supports: "regulators NU",
      },
    ],
    lastVerified: "September 2026",
    confidence: "medium",
  },
  {
    slug: "early-childhood-educator",
    name: "Early childhood educator",
    shortName: "Early childhood educator",
    plural: "early childhood educators",
    group: "education-social",
    seoTitle: "How to Become an ECE in Canada with Foreign Training (2026)",
    seoDescription: "How internationally trained early childhood educators get certified in Canada: credential reports, certificate levels, and the office in each province.",
    h1: "How to Become a Certified Early Childhood Educator (ECE) in Canada with Foreign Training",
    firstStep: "Credential evaluation report",
    examShort: "No exam; apply for certification",
    nocCodes: [
      { noc: "42202", title: "Early childhood educators and assistants" },
    ],
    regulatedIn: "some",
    protectedTitles: [
      "Early Childhood Educator (Ontario)",
      "Registered Early Childhood Educator (Ontario)",
      "RECE (Ontario)",
    ],
    lead: "An internationally trained early childhood educator must have their education assessed and get the certificate or classification that the province or territory requires to work in licensed child care. Ontario is the only province with a regulatory college. The province decides the level you get and which credential report it accepts.",
    nationalBodies: [],
    steps: [
      {
        title: "Find your province's certifying office",
        body: "Each province and territory sets its own rules. Ontario uses the College of Early Childhood Educators; most others use a government office, such as the BC ECE Registry.",
      },
      {
        title: "Get a credential evaluation",
        body: "Most offices ask for a report from a credential agency, such as WES, IQAS or BCIT ICES. Check which report and which type (course-by-course or document-by-document) your province accepts.",
      },
      {
        title: "Prove English or French ability",
        body: "Ontario asks for a language test if you did not study in English or French. Some other provinces, such as Alberta, may ask for one.",
      },
      {
        title: "Apply for certification",
        body: "Send the evaluation, transcripts, course outlines and practicum proof to the certifying office. It compares your training with provincial standards and gives you a level.",
      },
      {
        title: "Close any gaps",
        body: "If your training is not fully equal, you may get a lower level first. You can take extra courses, such as New Brunswick's mandatory Curriculum Framework course, to move up.",
      },
    ],
    exams: [],
    language: "Ontario accepts IELTS, TOEFL iBT and CELPIP if your education was not in English or French. Other provinces and territories set their own rules and minimum scores.",
    timeline: {
      text: "The BC ECE Registry takes about 30 business days to assess a complete international application",
      source: "https://www2.gov.bc.ca/gov/content/education-training/early-learning/teach/training-and-professional-development/become-an-early-childhood-educator/pathways/international",
    },
    recentChange: {
      text: "In 2024, British Columbia added an International Credentials Recognition pathway. Certified educators from countries that regulate the profession can use their work experience abroad instead of the 500 hours of Canadian work experience.",
      source: "https://www2.gov.bc.ca/gov/content/education-training/early-learning/teach/training-and-professional-development/become-an-early-childhood-educator/pathways/international",
    },
    workWhileLicensing: [
      {
        role: "Early childhood assistant",
        noc: "42202",
        note: "Most provinces have an entry or assistant level, such as the BC ECE Assistant certificate, that lets you work while you finish training.",
      },
      {
        role: "Home child care provider",
        noc: "44100",
        note: "Private home child care is often allowed without ECE certification, but licensed family homes have provincial rules.",
      },
      {
        role: "Teacher assistant",
        noc: "43100",
        note: "School boards set their own hiring requirements, often a certificate plus a background check.",
      },
    ],
    regulators: [
      {
        code: "BC",
        province: "British Columbia",
        regulator: "BC Early Childhood Educator Registry (Ministry of Education and Child Care)",
        url: "https://www2.gov.bc.ca/gov/content/education-training/early-learning/teach/training-and-professional-development/become-an-early-childhood-educator/pathways/international",
        required: true,
        note: "ECE Assistant, One-Year and Five-Year certificates. BCIT ICES report required.",
      },
      {
        code: "AB",
        province: "Alberta",
        regulator: "Alberta Child Care Staff Certification Office",
        url: "https://www.alberta.ca/apply-for-certification",
        required: true,
        note: "Level 1, 2 and 3 ECE. Language assessment may be required.",
      },
      {
        code: "SK",
        province: "Saskatchewan",
        regulator: "Saskatchewan Ministry of Education, ECE Certification",
        url: "https://www.saskatchewan.ca/government/education-and-child-care-facility-administration/early-childhood-educator/early-childhood-educator-certification",
        required: true,
        note: "ECE Level I, II and III. WES course-by-course report required.",
      },
      {
        code: "MB",
        province: "Manitoba",
        regulator: "Manitoba Early Learning and Child Care, Child Care Qualifications and Training Committee",
        url: "https://www.manitoba.ca/education/childcare/students_workforce/info_classification.html",
        required: true,
        note: "Child Care Assistant, ECE II and ECE III. IQAS or WES report.",
      },
      {
        code: "ON",
        province: "Ontario",
        regulator: "College of Early Childhood Educators (CECE)",
        url: "https://college-ece.ca/applicants/individual-assessment-faqs/",
        required: true,
        note: "Only regulatory college. Registration (RECE) required; WES report and language test if needed.",
      },
      {
        code: "QC",
        province: "Quebec",
        regulator: "Service québécois de certification du personnel éducateur de la petite enfance",
        url: "https://www.quebec.ca/famille-et-soutien-aux-personnes/enfance/garderies-et-services-de-garde/educateurs-petite-enfance/obtenir-certification-educateur",
        required: true,
        note: "Qualified educator certification. MIFI comparative evaluation required for studies outside Canada.",
      },
      {
        code: "NB",
        province: "New Brunswick",
        regulator: "New Brunswick Department of Education and Early Childhood Development",
        url: "https://www2.gnb.ca/content/gnb/en/corporate/promo/investing-in-early-learning-and-child-care/candidates.html",
        required: true,
        note: "Validates WES or IQAS reports; mandatory free Curriculum Framework online course.",
      },
      {
        code: "NS",
        province: "Nova Scotia",
        regulator: "Nova Scotia Department of Education and Early Childhood Development, ECE Classification Services",
        url: "https://childcarenovascotia.ca/educators",
        required: true,
        note: "Entry Level and Levels 1, 2 and 3. WES report for international credentials.",
      },
      {
        code: "PE",
        province: "Prince Edward Island",
        regulator: "Early Learning and Child Care Board",
        url: "https://earlyyearspei.princeedwardisland.ca/join-profession",
        required: true,
        note: "Intern, Associate and Educator levels. Certificate valid three years.",
      },
      {
        code: "NL",
        province: "Newfoundland and Labrador",
        regulator: "Association of Early Childhood Educators Newfoundland and Labrador (AECENL), for the provincial government",
        url: "https://www.aecenl.ca/index.php/certification",
        required: true,
        note: "Child Care Services Certification, Trainee, Entry and Levels 1 to 4. Required for licensed care.",
      },
      {
        code: "YT",
        province: "Yukon",
        regulator: "Yukon Department of Education, Early Learning and Child Care Branch",
        url: "https://yukon.ca/en/education-and-schools/early-childhood-learning-and-programs/apply-early-childhood-educator",
        required: true,
        note: "International pathway needs a credential assessment report. No application fee.",
      },
      {
        code: "NT",
        province: "Northwest Territories",
        regulator: "NWT Education, Culture and Employment, Early Learning and Child Care",
        url: "https://www.ece.gov.nt.ca/en/services/starting-and-operating-licensed-centre-based-program/certification-centre-based-employees",
        required: true,
        note: "Certification required since November 14, 2024. Levels A and 1 to 4.",
      },
      {
        code: "NU",
        province: "Nunavut",
        regulator: "Not regulated",
        url: "",
        required: false,
        note: "No ECE certification now. New Early Learning and Child Care Act passed June 2025, not yet in force.",
      },
    ],
    faqs: [
      {
        q: "How can a foreign-trained early childhood educator work in Canada?",
        a: "Get your education evaluated by a credential agency, such as WES or IQAS, then apply to the certifying office in your province. In Ontario you must register with the College of Early Childhood Educators. The office compares your training with local standards and gives you a certification level, which decides the jobs you can do in licensed child care.",
      },
      {
        q: "Do I need a licence to be an early childhood educator in Canada?",
        a: "In Ontario, yes: you must register with the College of Early Childhood Educators to use the title. Most other provinces and territories do not license the profession, but they require a certificate or classification to work in licensed child care. Nunavut has no certification requirement now.",
      },
      {
        q: "Can I work in child care while my ECE credentials are assessed?",
        a: "Often, yes. Most provinces have an entry or assistant level with fewer requirements, such as the BC ECE Assistant certificate or Nova Scotia Entry Level. In Alberta, you may get temporary Level 1 certification from a copy of your transcript while the office waits for official records.",
      },
    ],
    sources: [
      {
        url: "https://www2.gov.bc.ca/gov/content/education-training/early-learning/teach/training-and-professional-development/become-an-early-childhood-educator/pathways/international",
        supports: "BC row, timeline, recentChange, BCIT ICES report",
      },
      {
        url: "https://www.alberta.ca/apply-for-certification",
        supports: "AB row, levels, language assessment",
      },
      {
        url: "https://www.saskatchewan.ca/government/education-and-child-care-facility-administration/early-childhood-educator/early-childhood-educator-certification",
        supports: "SK row, levels, WES",
      },
      {
        url: "https://www.manitoba.ca/education/childcare/students_workforce/info_classification.html",
        supports: "MB row, levels, IQAS or WES",
      },
      {
        url: "https://college-ece.ca/applicants/individual-assessment-faqs/",
        supports: "ON row, WES report",
      },
      {
        url: "https://college-ece.ca/applicants/section-7-language-fluency/",
        supports: "language (Ontario tests)",
      },
      {
        url: "https://www.quebec.ca/famille-et-soutien-aux-personnes/enfance/garderies-et-services-de-garde/educateurs-petite-enfance/obtenir-certification-educateur",
        supports: "QC row, MIFI comparative evaluation",
      },
      {
        url: "https://www2.gnb.ca/content/gnb/en/corporate/promo/investing-in-early-learning-and-child-care/candidates.html",
        supports: "NB row, mandatory course",
      },
      { url: "https://childcarenovascotia.ca/educators", supports: "NS row" },
      { url: "https://earlyyearspei.princeedwardisland.ca/join-profession", supports: "PE row, levels" },
      {
        url: "https://www.aecenl.ca/index.php/certification",
        supports: "NL row, mandatory certification",
      },
      {
        url: "https://www.ece.gov.nt.ca/en/services/starting-and-operating-licensed-centre-based-program/certification-centre-based-employees",
        supports: "NT row, levels, November 14, 2024 start",
      },
      {
        url: "https://childcarecanada.org/sites/default/files/ECEC-2024-2025-Nunavut.pdf",
        supports: "NU row (secondary research report): no training requirement, new Act 2025",
      },
    ],
    lastVerified: "September 2026",
    confidence: "medium",
  },
  {
    slug: "social-worker",
    name: "Social worker",
    shortName: "Social worker",
    plural: "social workers",
    group: "education-social",
    seoTitle: "Foreign-Trained Social Worker in Canada: How to Register",
    seoDescription: "How to become a registered social worker in Canada with a foreign degree: the CASW assessment, ASWB exam rules, and the regulator in each province.",
    h1: "How to Become a Registered Social Worker in Canada with a Foreign Degree",
    firstStep: "CASW degree assessment",
    examShort: "ASWB exam in some provinces",
    nocCodes: [
      { noc: "41300", title: "Social workers" },
    ],
    regulatedIn: "some",
    protectedTitles: ["Social Worker", "Registered Social Worker", "RSW"],
    lead: "An internationally trained social worker must have their degree assessed as equal to a Canadian BSW or MSW and then register with the provincial regulator before using the title social worker. Eleven provinces and territories regulate the profession. The province decides who assesses your degree and whether you must pass the ASWB exam.",
    nationalBodies: [
      {
        name: "Canadian Association of Social Workers (CASW)",
        url: "https://www.casw-acts.ca/en/internationally-educated/assessment-international-credentials",
        role: "Assesses foreign social work degrees against Canadian BSW or MSW standards; its assessment is accepted everywhere except British Columbia and Quebec.",
      },
      {
        name: "Association of Social Work Boards (ASWB)",
        url: "https://www.aswb.org/",
        role: "Runs the social work licensing exam that some regulators, such as those in BC and Alberta, require.",
      },
    ],
    steps: [
      {
        title: "Check your province's requirements",
        body: "Find the regulator where you will live. BC and Quebec assess foreign degrees in their own way; the other regulated provinces and the Northwest Territories use CASW.",
      },
      {
        title: "Get your degree assessed",
        body: "Apply to CASW for an Assessment of International Credentials. In BC, use an approved credential evaluator and the BCCSW equivalency supplements; in Quebec, apply for equivalence to the OTSTCFQ.",
      },
      {
        title: "Apply to the regulator",
        body: "Send the assessment result, references, a criminal record check and other documents to the regulator. Some regulators give extra course or supervision options if your degree is not fully equal.",
      },
      {
        title: "Pass the ASWB exam if required",
        body: "BC and Alberta require the ASWB licensing exam for internationally educated applicants. Ontario will require an entry-to-practice exam for equivalency applicants from fall 2027.",
      },
      {
        title: "Register and start practice",
        body: "After approval, you can use the protected title. Some regulators, such as Nova Scotia, first register you as a candidate with a mentorship period.",
      },
    ],
    exams: [
      "ASWB licensing exam (BC, Alberta; Newfoundland and Labrador for some applicants)",
      "OTSTCFQ competency assessment exam (Quebec, if requested)",
      "ASWB entry-to-practice exam (Ontario equivalency applicants from fall 2027)",
    ],
    language: "There is no single national language test for social workers. Some regulators, such as Newfoundland and Labrador, may ask for an English test; Quebec requires French. Check the regulator for accepted tests and minimum scores.",
    timeline: {
      text: "The CASW degree assessment usually takes 6 to 12 weeks after all documents arrive",
      source: "https://www.casw-acts.ca/en/internationally-educated/assessment-international-credentials",
    },
    recentChange: {
      text: "Ontario's college approved entry-to-practice exams, made by ASWB. From fall 2027, internationally educated equivalency applicants must pass one, and all applicants from fall 2028.",
      source: "https://www.ocswssw.org/applicants/entry-to-practice-exams/",
    },
    workWhileLicensing: [
      {
        role: "Social and community service worker",
        noc: "42201",
        note: "You can work in community agencies and shelters, but in Ontario the title Social Service Worker is also protected and needs registration.",
      },
      {
        role: "Home support worker",
        noc: "44101",
        note: "Gives practical help to clients at home; you cannot call yourself a social worker.",
      },
    ],
    regulators: [
      {
        code: "BC",
        province: "British Columbia",
        regulator: "British Columbia College of Social Workers (BCCSW)",
        url: "https://bccsw.ca/for-applicants/apply-for-registration/full-registration/registration-process/degree-outside-of-canada-or-the-usa/",
        required: true,
        note: "Uses approved credential evaluators, not CASW. ASWB exam required.",
      },
      {
        code: "AB",
        province: "Alberta",
        regulator: "Alberta College of Social Workers (ACSW)",
        url: "https://acsw.ab.ca/applicants/becoming-registered/internationally-educated-applicant-social-work-degree-earned-outside-of-canada-or-the-usa/",
        required: true,
        note: "CASW assessment. ASWB exam required for internationally educated applicants.",
      },
      {
        code: "SK",
        province: "Saskatchewan",
        regulator: "Saskatchewan Association of Social Workers (SASW)",
        url: "https://www.sasw.ca/site/member/registered",
        required: true,
        note: "CASW assessment required.",
      },
      {
        code: "MB",
        province: "Manitoba",
        regulator: "Manitoba College of Social Workers (MCSW)",
        url: "https://mcsw.ca/applicants/international-social-work-degree/",
        required: true,
        note: "CASW assessment required.",
      },
      {
        code: "ON",
        province: "Ontario",
        regulator: "Ontario College of Social Workers and Social Service Workers (OCSWSSW)",
        url: "https://www.ocswssw.org/applicants/international-bsw-msw/",
        required: true,
        note: "CASW assessment. Entry-to-practice exam for equivalency applicants from fall 2027.",
      },
      {
        code: "QC",
        province: "Quebec",
        regulator: "Ordre des travailleurs sociaux et des thérapeutes conjugaux et familiaux du Québec (OTSTCFQ)",
        url: "https://www.otstcfq.org/exercer-au-quebec/exercer-au-quebec/admission-et-inscription/permis-exercice-ts-et-tcf/demande-admission-par-voie-equivalence-ts/",
        required: true,
        note: "Own equivalence review, possible competency exam; French required.",
      },
      {
        code: "NB",
        province: "New Brunswick",
        regulator: "New Brunswick Association of Social Workers (NBASW)",
        url: "https://www.nbasw-atsnb.ca/become-a-member-new/apply-as-a-social-work-member",
        required: true,
        note: "CASW assessment. Foreign Qualification Recognition route if not equivalent.",
      },
      {
        code: "NS",
        province: "Nova Scotia",
        regulator: "Nova Scotia College of Social Workers (NSCSW)",
        url: "https://nscsw.org/applicants/international-bswmsw/",
        required: true,
        note: "CASW assessment. Candidate status and mentorship if under 2,500 practice hours.",
      },
      {
        code: "PE",
        province: "Prince Edward Island",
        regulator: "Prince Edward Island Social Work Registration Board",
        url: "https://socialworkpei.ca/register/",
        required: true,
        note: "Contact the Board about international applicants.",
      },
      {
        code: "NL",
        province: "Newfoundland and Labrador",
        regulator: "Newfoundland and Labrador College of Social Workers (NLCSW)",
        url: "https://nlcsw.ca/international/",
        required: true,
        note: "CASW assessment. ASWB exam for some applicants.",
      },
      {
        code: "YT",
        province: "Yukon",
        regulator: "Not regulated",
        url: "",
        required: false,
        note: "No licence yet; the Yukon government is working on regulation. Employers set requirements.",
      },
      {
        code: "NT",
        province: "Northwest Territories",
        regulator: "Northwest Territories Health and Social Services, Professional Licensing",
        url: "https://www.hss.gov.nt.ca/en/services/social-worker-licence",
        required: true,
        note: "Government registrar. Foreign graduates need a CASW equivalency letter.",
      },
      {
        code: "NU",
        province: "Nunavut",
        regulator: "Not regulated",
        url: "",
        required: false,
        note: "No licence required. Employers usually ask for a BSW.",
      },
    ],
    faqs: [
      {
        q: "How do I get my foreign social work degree recognized in Canada?",
        a: "In most provinces, apply to the Canadian Association of Social Workers (CASW) for an Assessment of International Credentials. CASW compares your degree with a Canadian BSW or MSW, and assessments usually take 6 to 12 weeks after all documents arrive. British Columbia and Quebec do not use CASW: apply to BCCSW or OTSTCFQ instead.",
      },
      {
        q: "Do I need to pass the ASWB exam to be a social worker in Canada?",
        a: "It depends on the province. British Columbia and Alberta require the ASWB exam for internationally educated applicants. Newfoundland and Labrador requires it for some applicants. Ontario will require an entry-to-practice exam for equivalency applicants from fall 2027. Other provinces, such as Nova Scotia and New Brunswick, do not list an exam.",
      },
      {
        q: "Can I work as a social worker in Canada without a licence?",
        a: "Not with the title social worker in the provinces and the Northwest Territories, because the title is protected. You can work in related jobs, such as a community service worker, while you wait for registration. Yukon and Nunavut do not license social workers now, so employers set the requirements there.",
      },
    ],
    sources: [
      {
        url: "https://www.casw-acts.ca/en/internationally-educated/assessment-international-credentials",
        supports: "nationalBodies, steps, timeline, BC and Quebec exceptions",
      },
      {
        url: "https://www.casw-acts.ca/en/regulation-association-education/regulatory-bodies",
        supports: "regulator names for all provinces and NT",
      },
      {
        url: "https://www.ocswssw.org/applicants/entry-to-practice-exams/",
        supports: "recentChange, exams (Ontario)",
      },
      {
        url: "https://www.ocswssw.org/applicants/international-bsw-msw/",
        supports: "ON regulator row, CASW use",
      },
      {
        url: "https://bccsw.ca/for-applicants/apply-for-registration/full-registration/registration-process/degree-outside-of-canada-or-the-usa/",
        supports: "BC row, BC assessment route, ASWB exam",
      },
      {
        url: "https://acsw.ab.ca/registration/exam/",
        supports: "Alberta ASWB exam for internationally educated applicants",
      },
      {
        url: "https://acsw.ab.ca/applicants/becoming-registered/internationally-educated-applicant-social-work-degree-earned-outside-of-canada-or-the-usa/",
        supports: "AB row, CASW use",
      },
      { url: "https://www.sasw.ca/site/member/registered", supports: "SK row" },
      { url: "https://mcsw.ca/applicants/international-social-work-degree/", supports: "MB row" },
      {
        url: "https://www.otstcfq.org/exercer-au-quebec/exercer-au-quebec/admission-et-inscription/permis-exercice-ts-et-tcf/demande-admission-par-voie-equivalence-ts/",
        supports: "QC row, competency exam, French",
      },
      {
        url: "https://www2.gnb.ca/content/dam/gnb/Departments/h-s/jobs-emplois/social-workers.pdf",
        supports: "NB row, CASW, FQR program, no NBASW language requirement (rev. March 2026)",
      },
      { url: "https://nscsw.org/applicants/international-bswmsw/", supports: "NS row, candidacy" },
      { url: "https://socialworkpei.ca/register/", supports: "PE row" },
      { url: "https://nlcsw.ca/international/", supports: "NL row, language fact sheet, ASWB conditions" },
      {
        url: "https://www.hss.gov.nt.ca/en/services/social-worker-licence",
        supports: "NT row, CASW letter",
      },
      {
        url: "https://www.cbc.ca/news/canada/north/yukon-clinical-social-work-regulations-mostyn-1.7389040",
        supports: "YT not yet regulated (secondary; lead only)",
      },
    ],
    lastVerified: "September 2026",
    confidence: "medium",
  },
  {
    slug: "electrician",
    name: "Electrician",
    shortName: "Electrician",
    plural: "electricians",
    group: "trades",
    seoTitle: "Foreign-Trained Electricians in Canada: How to Get Certified",
    seoDescription: "Electricians trained abroad: the trade qualifier route, the Red Seal exam, and the apprenticeship authority in each province where the trade is compulsory.",
    h1: "How to Get Certified as an Electrician in Canada with Experience from Abroad",
    firstStep: "Trade qualifier application",
    examShort: "Red Seal exam (CCQ in Quebec)",
    nocCodes: [
      { noc: "72200", title: "Electricians (except industrial and power system)" },
      { noc: "72201", title: "Industrial electricians" },
    ],
    regulatedIn: "some",
    protectedTitles: [],
    lead: "An electrician trained outside Canada must get a provincial Certificate of Qualification before working alone in 10 provinces, where the trade is compulsory. The provincial apprenticeship authority decides this. Most accept experienced workers as trade qualifiers: they check your hours, then you write the Red Seal exam. Yukon, Northwest Territories and Nunavut do not require trade certification.",
    nationalBodies: [
      {
        name: "Red Seal Program",
        url: "https://red-seal.ca/eng/trades/const-elect.shtml",
        role: "Sets the interprovincial exam; a Red Seal endorsement on your certificate lets you work in other provinces without another exam.",
      },
      {
        name: "Ellis Chart (Employment and Social Development Canada)",
        url: "https://ellischart.ca/eng/trades/const-electrician/ellis-chart.shtml",
        role: "Shows, for each province and territory, if the trade is compulsory and how many training hours it needs.",
      },
    ],
    steps: [
      {
        title: "Check if the trade is compulsory",
        body: "Construction electrician is compulsory in all 10 provinces and voluntary in the 3 territories, according to the Ellis Chart. In a compulsory trade, only certified journeypersons or registered apprentices can do the work.",
      },
      {
        title: "Collect proof of your work hours",
        body: "Get letters from each employer that list your dates, hours and tasks. Most provinces want experience at least equal to the apprenticeship term: 7,200 hours in most provinces, 9,000 in Ontario and 9,800 in Quebec.",
      },
      {
        title: "Apply as a trade qualifier",
        body: "Apply to the provincial authority, for example the Trade Equivalency Assessment at Skilled Trades Ontario, the Trades Qualifier Work Experience Program in Alberta, or a challenge application at SkilledTradesBC. In Quebec, apply to the CCQ for construction work.",
      },
      {
        title: "Write the certification exam",
        body: "If you are approved, you write the Red Seal exam for your trade. The construction electrician exam has 100 questions. Manitoba and Nova Scotia need a mark of 70 per cent or more.",
      },
      {
        title: "Get your certificate and any extra licence",
        body: "You receive a Certificate of Qualification, usually with a Red Seal endorsement. Some jurisdictions, such as Manitoba, also require a separate electrical licence after certification.",
      },
      {
        title: "Or start as a registered apprentice",
        body: "If your hours are not enough, an employer can register you as an apprentice. Your foreign experience can count toward credit in some provinces, such as New Brunswick.",
      },
    ],
    exams: [
      "Red Seal exam: Construction Electrician (100 questions)",
      "Red Seal exam: Industrial Electrician",
      "Quebec: provincial qualification exam (CCQ for construction work)",
    ],
    language: "Most trade authorities do not require a language test. SkilledTradesBC says no English test is needed to write its exams, and you can ask for an interpreter or a French Red Seal exam; colleges that give technical training can set their own rules.",
    recentChange: {
      text: "From August 1, 2026, SkilledTradesBC changed its trade qualifier rules. After four failed certification exam attempts, a trade qualifier is no longer placed at the final level; in compulsory trades such as construction electrician, the person must register as an apprentice or apply as a level challenger.",
      source: "https://skilledtradesbc.ca/upcoming-policy-changes-level-challengers-trade-qualifiers",
    },
    workWhileLicensing: [
      {
        role: "Registered electrical apprentice",
        noc: "72200",
        note: "Legal in every province once an employer registers you with the provincial authority; you work under a certified journeyperson.",
      },
      {
        role: "Construction trades helper",
        noc: "75110",
        note: "You can help on sites, but you cannot do electrical work that is reserved for certified electricians or apprentices.",
      },
      {
        role: "Building maintenance worker",
        noc: "73201",
        note: "General maintenance only; electrical work in a compulsory trade still needs a certificate or apprentice registration.",
      },
    ],
    regulators: [
      {
        code: "BC",
        province: "British Columbia",
        regulator: "SkilledTradesBC",
        url: "https://skilledtradesbc.ca/get-certified/newcomers-international-tradespersons",
        required: true,
        note: "Compulsory (construction and industrial electrician) since December 1, 2023.",
      },
      {
        code: "AB",
        province: "Alberta",
        regulator: "Apprenticeship and Industry Training (AIT), Government of Alberta",
        url: "https://tradesecrets.alberta.ca/become-certified/recognized-trade-certificates/out-of-country-credentials/",
        required: true,
        note: "Compulsory trade.",
      },
      {
        code: "SK",
        province: "Saskatchewan",
        regulator: "Saskatchewan Apprenticeship and Trade Certification Commission (SATCC)",
        url: "https://saskapprenticeship.ca/international-application-process/",
        required: true,
        note: "Compulsory trade. You must be in Saskatchewan to write the exam.",
      },
      {
        code: "MB",
        province: "Manitoba",
        regulator: "Apprenticeship Manitoba",
        url: "https://www.gov.mb.ca/apprenticeship/experienced-tradespersons/trade-qualifier.html",
        required: true,
        note: "Compulsory. A separate mandatory licence follows the Certificate of Qualification.",
      },
      {
        code: "ON",
        province: "Ontario",
        regulator: "Skilled Trades Ontario",
        url: "https://www.skilledtradesontario.ca/experienced-workers/trade-equivalency-assessment/",
        required: true,
        note: "Compulsory trade (Electrician - Construction and Maintenance). Start with a Trade Equivalency Assessment.",
      },
      {
        code: "QC",
        province: "Quebec",
        regulator: "Commission de la construction du Québec (CCQ)",
        url: "https://www.ccq.org/fr-CA/qualification-acces-industrie/exterieur-quebec",
        required: true,
        note: "Construction: CCQ. Outside construction: Ministère de l'Emploi et de la Solidarité sociale certificate.",
      },
      {
        code: "NB",
        province: "New Brunswick",
        regulator: "Skilled Trades NB (Apprenticeship and Occupational Certification), Government of New Brunswick",
        url: "https://www.gnb.ca/en/topic/education-training/apprenticeship-trades/trained-trades-people.html",
        required: true,
        note: "Compulsory. Ellis Chart shows an extra licence requirement; check with the province.",
      },
      {
        code: "NS",
        province: "Nova Scotia",
        regulator: "Nova Scotia Apprenticeship Agency",
        url: "https://www.nsapprenticeship.ca/tradespersons/trade-qualifiers-military",
        required: true,
        note: "Compulsory trade.",
      },
      {
        code: "PE",
        province: "Prince Edward Island",
        regulator: "Apprenticeship Section, Department of Workforce, Advanced Learning and Population (SkillsPEI)",
        url: "https://www.princeedwardisland.ca/en/information/workforce-advanced-learning-and-population/trade-certification",
        required: true,
        note: "Compulsory trade. Website blocks automated checks; content not read directly.",
      },
      {
        code: "NL",
        province: "Newfoundland and Labrador",
        regulator: "Apprenticeship and Trades Certification Division (ATCD)",
        url: "https://www.gov.nl.ca/atcd/journeypersons-and-skilled-workers/trade-qualifiers/",
        required: true,
        note: "Construction electrician is compulsory; industrial electrician is not.",
      },
      {
        code: "YT",
        province: "Yukon",
        regulator: "Apprenticeship and Trade Certification Unit, Government of Yukon",
        url: "https://yukon.ca/en/get-trades-certification-qualification-yukon",
        required: false,
        note: "Voluntary trade certification. Ellis Chart shows another licence requirement; check locally.",
      },
      {
        code: "NT",
        province: "Northwest Territories",
        regulator: "Apprenticeship, Trade and Occupation Certification (ATOC), Education, Culture and Employment",
        url: "https://www.ece.gov.nt.ca/en/services/apprenticeship-trade-and-occupation-certification",
        required: false,
        note: "Voluntary trade certification per the Ellis Chart.",
      },
      {
        code: "NU",
        province: "Nunavut",
        regulator: "Apprenticeship Unit, Department of Family Services, Government of Nunavut",
        url: "https://www.gov.nu.ca/en/employment-training-and-career-development/apprenticeship-trade-and-occupations-certification",
        required: false,
        note: "Voluntary trade certification. Ellis Chart shows another licence requirement; check locally.",
      },
    ],
    faqs: [
      {
        q: "Can I work as an electrician in Canada with a foreign licence?",
        a: "Not directly in the 10 provinces, where the trade is compulsory. You must apply to the provincial apprenticeship authority, prove your work hours, and pass the certification exam, usually the Red Seal exam. Alberta recognizes some out-of-country credentials without an exam. Until you are certified, you can only do electrical work as a registered apprentice.",
      },
      {
        q: "How many hours do I need to challenge the electrician exam?",
        a: "It depends on the province. The Ellis Chart lists 7,200 total training hours for construction electrician in most provinces, 9,000 in Ontario and 9,800 in Quebec. Trade qualifier programs usually ask for experience at least equal to that apprenticeship term. Check the trade profile of your provincial authority for the exact number and scope rules.",
      },
      {
        q: "Is electrician a Red Seal trade?",
        a: "Yes. Construction electrician and industrial electrician are Red Seal trades in all 13 provinces and territories. If you pass the Red Seal exam, your Certificate of Qualification gets a Red Seal endorsement. That endorsement lets you work in other provinces and territories without writing another exam.",
      },
    ],
    sources: [
      {
        url: "https://red-seal.ca/eng/contact/contact.shtml",
        supports: "regulators (names of the 13 apprenticeship authorities)",
      },
      {
        url: "https://skilledtradesbc.ca/skilledtradescertification",
        supports: "regulators BC (compulsory trade list)",
      },
      {
        url: "https://skilledtradesbc.ca/get-certified/newcomers-international-tradespersons",
        supports: "steps, language (no language test to write exams; interpreter or French exam on request)",
      },
      {
        url: "https://skilledtradesbc.ca/upcoming-policy-changes-level-challengers-trade-qualifiers",
        supports: "recentChange (BC trade qualifier policy, August 1, 2026)",
      },
      {
        url: "https://tradesecrets.alberta.ca/become-certified/recognized-trade-certificates/out-of-country-credentials/",
        supports: "steps, regulators AB (recognized out-of-country credentials, AIT)",
      },
      {
        url: "https://tradesecrets.alberta.ca/become-certified/trades-qualifier-programs/qualify-based-on-work-experience/",
        supports: "steps (Alberta Trades Qualifier - Work Experience Program, theory exam)",
      },
      {
        url: "https://saskapprenticeship.ca/international-application-process/",
        supports: "steps, regulators SK (assessment from any country; must be in Saskatchewan to write exam)",
      },
      {
        url: "https://www.gov.mb.ca/apprenticeship/experienced-tradespersons/trade-qualifier.html",
        supports: "steps, exams (Manitoba trade qualifier, 70 per cent pass mark)",
      },
      {
        url: "https://www.gov.mb.ca/apprenticeship/asset_library/en/apprenticeship/manitoba-designated-trades.pdf",
        supports: "regulators MB (compulsory vs voluntary list)",
      },
      {
        url: "https://www.skilledtradesontario.ca/experienced-workers/trade-equivalency-assessment/",
        supports: "steps (Trade Equivalency Assessment; experience at least equal to apprenticeship training time)",
      },
      {
        url: "https://www.skilledtradesontario.ca/changes-to-the-delivery-of-apprenticeship-and-certifying-exam-services/",
        supports: "steps (Ontario exams delivered through Prometric since April 2, 2025)",
      },
      {
        url: "https://www.ccq.org/fr-CA/qualification-acces-industrie/exterieur-quebec",
        supports: "regulators QC (recognition of training and experience from outside Quebec)",
      },
      {
        url: "https://www.quebec.ca/emploi/informer-metier-profession/profession-metier-reglemente/connaitre-certificats-qualification-obligatoire",
        supports: "regulators QC (ministry certificates in electricity and plumbing)",
      },
      {
        url: "https://www.quebec.ca/en/employment/learn-trade-occupation/practising-regulated-trade-occupation/learn-regulated-trades-occupations",
        supports: "regulators QC (CCQ for construction trades, Ministère de l'Emploi et de la Solidarité sociale for others)",
      },
      {
        url: "https://www.gnb.ca/en/topic/education-training/apprenticeship-trades/trained-trades-people.html",
        supports: "steps, regulators NB (Skilled Trades NB assessment of international experience)",
      },
      {
        url: "https://www.nsapprenticeship.ca/tradespersons/trade-qualifiers-military",
        supports: "steps, exams NS (trade qualifier, 70 per cent pass mark)",
      },
      {
        url: "https://www.nsapprenticeship.ca/get-started/newcomers-nova-scotia",
        supports: "steps NS (ISANS Work-based Trades Practical Assessment)",
      },
      {
        url: "https://www.gov.nl.ca/atcd/journeypersons-and-skilled-workers/trade-qualifiers/",
        supports: "steps, regulators NL (certified in another country: apply as trade qualifier)",
      },
      {
        url: "https://www.gov.nl.ca/atcd/designated-trades/request-compulsory-certification/",
        supports: "regulators NL (five compulsory trades)",
      },
      {
        url: "https://www.ece.gov.nt.ca/en/services/apprenticeship-trade-and-occupation-certification",
        supports: "regulators NT",
      },
      {
        url: "https://ellischart.ca/eng/trades/const-electrician/ellis-chart.shtml",
        supports: "regulators (compulsory/voluntary per jurisdiction), steps (training hours), faqs",
      },
      {
        url: "https://red-seal.ca/eng/trades/const-elect.shtml",
        supports: "nationalBodies, faqs (Red Seal trade)",
      },
      {
        url: "https://red-seal.ca/eng/trades/constelectric/exam-information.shtml",
        supports: "exams (100 questions)",
      },
      {
        url: "https://www.gov.mb.ca/apprenticeship/explore-trades/trade-profiles/construction-electrician.html",
        supports: "regulators MB (additional mandatory licence)",
      },
    ],
    lastVerified: "September 2026",
    confidence: "medium",
  },
  {
    slug: "plumber",
    name: "Plumber",
    shortName: "Plumber",
    plural: "plumbers",
    group: "trades",
    seoTitle: "How to Become a Plumber in Canada with Foreign Experience",
    seoDescription: "Plumbers trained abroad: the trade qualifier route, the Red Seal exam, and the provinces where plumbing is a compulsory trade, with each authority.",
    h1: "How to Get Certified as a Plumber in Canada with Experience from Abroad",
    firstStep: "Trade qualifier application",
    examShort: "Red Seal exam (CCQ in Quebec)",
    nocCodes: [
      { noc: "72300", title: "Plumbers" },
    ],
    regulatedIn: "some",
    protectedTitles: [],
    lead: "A plumber trained outside Canada needs a provincial Certificate of Qualification to work in the 7 provinces where plumbing is a compulsory trade: Alberta, Saskatchewan, Ontario, Quebec, New Brunswick, Nova Scotia and Prince Edward Island. The provincial apprenticeship authority checks your work hours, then you write the Red Seal exam. Elsewhere, certification is voluntary.",
    nationalBodies: [
      {
        name: "Red Seal Program",
        url: "https://red-seal.ca/eng/contact/contact.shtml",
        role: "Sets the interprovincial plumber exam; a Red Seal endorsement lets you work in other provinces without another exam.",
      },
      {
        name: "Ellis Chart (Employment and Social Development Canada)",
        url: "https://ellischart.ca/eng/trades/plumber/ellis-chart.shtml",
        role: "Shows, for each province and territory, if the plumber trade is compulsory and how many training hours it needs.",
      },
    ],
    steps: [
      {
        title: "Check if plumbing is compulsory there",
        body: "The Ellis Chart lists plumber as compulsory in AB, SK, ON, QC, NB, NS and PE, and voluntary in BC, MB, NL and the 3 territories. In a voluntary trade you can legally work without a certificate, but many employers still ask for one.",
      },
      {
        title: "Collect proof of your work hours",
        body: "Get employer letters that list your dates, hours and tasks. Most provinces want experience at least equal to the apprenticeship term: 7,200 hours in most provinces, 9,000 in Ontario and 9,680 in Quebec.",
      },
      {
        title: "Apply as a trade qualifier",
        body: "Apply to the provincial authority, for example the Trade Equivalency Assessment at Skilled Trades Ontario or the Trades Qualifier Work Experience Program in Alberta. In Quebec, the construction trade is tuyauteur and you apply to the CCQ.",
      },
      {
        title: "Write the certification exam",
        body: "If you are approved, you write the Red Seal plumber exam. Manitoba and Nova Scotia need a mark of 70 per cent or more.",
      },
      {
        title: "Get your Certificate of Qualification",
        body: "You receive a Certificate of Qualification, usually with a Red Seal endorsement. The Ellis Chart shows an extra licence requirement in New Brunswick and Ontario, so check with the province.",
      },
      {
        title: "Or start as a registered apprentice",
        body: "If your hours are not enough, an employer can register you as an apprentice. In Nova Scotia, the ISANS Work-based Trades Practical Assessment can lead to an apprenticeship or a challenge exam.",
      },
    ],
    exams: ["Red Seal exam: Plumber", "Quebec: provincial qualification exam (CCQ, tuyauteur trade)"],
    language: "Most trade authorities do not require a language test. SkilledTradesBC says no English test is needed to write its exams, and you can ask for an interpreter or a French Red Seal exam; colleges that give technical training can set their own rules.",
    recentChange: {
      text: "Since April 2, 2025, Skilled Trades Ontario registers apprentices and runs certifying exams itself, instead of the Ministry. Exams, including the trade qualifier exam for plumbers, are delivered through Prometric Canada Testing Services.",
      source: "https://www.skilledtradesontario.ca/changes-to-the-delivery-of-apprenticeship-and-certifying-exam-services/",
    },
    workWhileLicensing: [
      {
        role: "Registered plumbing apprentice",
        noc: "72300",
        note: "Legal in every province once an employer registers you with the provincial authority; you work under a certified journeyperson.",
      },
      {
        role: "Construction trades helper",
        noc: "75110",
        note: "You can help on sites, but in a compulsory province you cannot do plumbing work yourself without a certificate or apprentice registration.",
      },
      {
        role: "Building maintenance worker",
        noc: "73201",
        note: "General maintenance only; plumbing work in a compulsory province still needs a certificate or apprentice registration.",
      },
    ],
    regulators: [
      {
        code: "BC",
        province: "British Columbia",
        regulator: "SkilledTradesBC",
        url: "https://skilledtradesbc.ca/get-certified/newcomers-international-tradespersons",
        required: false,
        note: "Voluntary. Plumber is not on the BC compulsory (Skilled Trades Certification) list.",
      },
      {
        code: "AB",
        province: "Alberta",
        regulator: "Apprenticeship and Industry Training (AIT), Government of Alberta",
        url: "https://tradesecrets.alberta.ca/become-certified/recognized-trade-certificates/out-of-country-credentials/",
        required: true,
        note: "Compulsory trade.",
      },
      {
        code: "SK",
        province: "Saskatchewan",
        regulator: "Saskatchewan Apprenticeship and Trade Certification Commission (SATCC)",
        url: "https://saskapprenticeship.ca/international-application-process/",
        required: true,
        note: "Compulsory trade. You must be in Saskatchewan to write the exam.",
      },
      {
        code: "MB",
        province: "Manitoba",
        regulator: "Apprenticeship Manitoba",
        url: "https://www.gov.mb.ca/apprenticeship/experienced-tradespersons/trade-qualifier.html",
        required: false,
        note: "Voluntary trade in Manitoba.",
      },
      {
        code: "ON",
        province: "Ontario",
        regulator: "Skilled Trades Ontario",
        url: "https://www.skilledtradesontario.ca/experienced-workers/trade-equivalency-assessment/",
        required: true,
        note: "Compulsory trade. Start with a Trade Equivalency Assessment.",
      },
      {
        code: "QC",
        province: "Quebec",
        regulator: "Commission de la construction du Québec (CCQ)",
        url: "https://www.ccq.org/fr-CA/qualification-acces-industrie/exterieur-quebec",
        required: true,
        note: "Construction trade is tuyauteur (pipefitter/plumber) at CCQ; ministry plumbing certificate outside construction.",
      },
      {
        code: "NB",
        province: "New Brunswick",
        regulator: "Skilled Trades NB (Apprenticeship and Occupational Certification), Government of New Brunswick",
        url: "https://www.gnb.ca/en/topic/education-training/apprenticeship-trades/trained-trades-people.html",
        required: true,
        note: "Compulsory. Ellis Chart shows an extra licence requirement; check with the province.",
      },
      {
        code: "NS",
        province: "Nova Scotia",
        regulator: "Nova Scotia Apprenticeship Agency",
        url: "https://www.nsapprenticeship.ca/tradespersons/trade-qualifiers-military",
        required: true,
        note: "Compulsory trade.",
      },
      {
        code: "PE",
        province: "Prince Edward Island",
        regulator: "Apprenticeship Section, Department of Workforce, Advanced Learning and Population (SkillsPEI)",
        url: "https://www.princeedwardisland.ca/en/information/workforce-advanced-learning-and-population/trade-certification",
        required: true,
        note: "Compulsory trade. Website blocks automated checks; content not read directly.",
      },
      {
        code: "NL",
        province: "Newfoundland and Labrador",
        regulator: "Apprenticeship and Trades Certification Division (ATCD)",
        url: "https://www.gov.nl.ca/atcd/journeypersons-and-skilled-workers/trade-qualifiers/",
        required: false,
        note: "Voluntary. Plumber is not one of the five NL compulsory trades.",
      },
      {
        code: "YT",
        province: "Yukon",
        regulator: "Apprenticeship and Trade Certification Unit, Government of Yukon",
        url: "https://yukon.ca/en/get-trades-certification-qualification-yukon",
        required: false,
        note: "Voluntary trade certification per the Ellis Chart.",
      },
      {
        code: "NT",
        province: "Northwest Territories",
        regulator: "Apprenticeship, Trade and Occupation Certification (ATOC), Education, Culture and Employment",
        url: "https://www.ece.gov.nt.ca/en/services/apprenticeship-trade-and-occupation-certification",
        required: false,
        note: "Voluntary trade certification per the Ellis Chart.",
      },
      {
        code: "NU",
        province: "Nunavut",
        regulator: "Apprenticeship Unit, Department of Family Services, Government of Nunavut",
        url: "https://www.gov.nu.ca/en/employment-training-and-career-development/apprenticeship-trade-and-occupations-certification",
        required: false,
        note: "Voluntary trade certification per the Ellis Chart.",
      },
    ],
    faqs: [
      {
        q: "Do I need a licence to work as a plumber in Canada?",
        a: "It depends on the province. Plumber is a compulsory trade in Alberta, Saskatchewan, Ontario, Quebec, New Brunswick, Nova Scotia and Prince Edward Island. There, you must hold a Certificate of Qualification or be a registered apprentice. In British Columbia, Manitoba, Newfoundland and Labrador and the territories, certification is voluntary, but employers often prefer it.",
      },
      {
        q: "Can a foreign-trained plumber challenge the Red Seal exam?",
        a: "Yes, in most provinces. You apply to the provincial apprenticeship authority as a trade qualifier and prove experience at least equal to the apprenticeship term, often 7,200 hours. If the authority approves your hours and tasks, you write the Red Seal plumber exam. If you pass, you get a Certificate of Qualification with a Red Seal endorsement.",
      },
      {
        q: "Is plumbing a compulsory trade in British Columbia?",
        a: "No. SkilledTradesBC lists seven compulsory electrical and mechanical trades, and plumber is not one of them. You can work as a plumber in BC without a certificate. You can still challenge the plumber certification with SkilledTradesBC if you have enough experience, which many employers value.",
      },
    ],
    sources: [
      {
        url: "https://red-seal.ca/eng/contact/contact.shtml",
        supports: "regulators (names of the 13 apprenticeship authorities)",
      },
      {
        url: "https://skilledtradesbc.ca/skilledtradescertification",
        supports: "regulators BC (compulsory trade list)",
      },
      {
        url: "https://skilledtradesbc.ca/get-certified/newcomers-international-tradespersons",
        supports: "steps, language (no language test to write exams; interpreter or French exam on request)",
      },
      {
        url: "https://skilledtradesbc.ca/upcoming-policy-changes-level-challengers-trade-qualifiers",
        supports: "recentChange (BC trade qualifier policy, August 1, 2026)",
      },
      {
        url: "https://tradesecrets.alberta.ca/become-certified/recognized-trade-certificates/out-of-country-credentials/",
        supports: "steps, regulators AB (recognized out-of-country credentials, AIT)",
      },
      {
        url: "https://tradesecrets.alberta.ca/become-certified/trades-qualifier-programs/qualify-based-on-work-experience/",
        supports: "steps (Alberta Trades Qualifier - Work Experience Program, theory exam)",
      },
      {
        url: "https://saskapprenticeship.ca/international-application-process/",
        supports: "steps, regulators SK (assessment from any country; must be in Saskatchewan to write exam)",
      },
      {
        url: "https://www.gov.mb.ca/apprenticeship/experienced-tradespersons/trade-qualifier.html",
        supports: "steps, exams (Manitoba trade qualifier, 70 per cent pass mark)",
      },
      {
        url: "https://www.gov.mb.ca/apprenticeship/asset_library/en/apprenticeship/manitoba-designated-trades.pdf",
        supports: "regulators MB (compulsory vs voluntary list)",
      },
      {
        url: "https://www.skilledtradesontario.ca/experienced-workers/trade-equivalency-assessment/",
        supports: "steps (Trade Equivalency Assessment; experience at least equal to apprenticeship training time)",
      },
      {
        url: "https://www.skilledtradesontario.ca/changes-to-the-delivery-of-apprenticeship-and-certifying-exam-services/",
        supports: "steps (Ontario exams delivered through Prometric since April 2, 2025)",
      },
      {
        url: "https://www.ccq.org/fr-CA/qualification-acces-industrie/exterieur-quebec",
        supports: "regulators QC (recognition of training and experience from outside Quebec)",
      },
      {
        url: "https://www.quebec.ca/emploi/informer-metier-profession/profession-metier-reglemente/connaitre-certificats-qualification-obligatoire",
        supports: "regulators QC (ministry certificates in electricity and plumbing)",
      },
      {
        url: "https://www.quebec.ca/en/employment/learn-trade-occupation/practising-regulated-trade-occupation/learn-regulated-trades-occupations",
        supports: "regulators QC (CCQ for construction trades, Ministère de l'Emploi et de la Solidarité sociale for others)",
      },
      {
        url: "https://www.gnb.ca/en/topic/education-training/apprenticeship-trades/trained-trades-people.html",
        supports: "steps, regulators NB (Skilled Trades NB assessment of international experience)",
      },
      {
        url: "https://www.nsapprenticeship.ca/tradespersons/trade-qualifiers-military",
        supports: "steps, exams NS (trade qualifier, 70 per cent pass mark)",
      },
      {
        url: "https://www.nsapprenticeship.ca/get-started/newcomers-nova-scotia",
        supports: "steps NS (ISANS Work-based Trades Practical Assessment)",
      },
      {
        url: "https://www.gov.nl.ca/atcd/journeypersons-and-skilled-workers/trade-qualifiers/",
        supports: "steps, regulators NL (certified in another country: apply as trade qualifier)",
      },
      {
        url: "https://www.gov.nl.ca/atcd/designated-trades/request-compulsory-certification/",
        supports: "regulators NL (five compulsory trades)",
      },
      {
        url: "https://www.ece.gov.nt.ca/en/services/apprenticeship-trade-and-occupation-certification",
        supports: "regulators NT",
      },
      {
        url: "https://ellischart.ca/eng/trades/plumber/ellis-chart.shtml",
        supports: "regulators (compulsory/voluntary per jurisdiction), steps (training hours), faqs",
      },
      {
        url: "https://skilledtradesbc.ca/plumber",
        supports: "faqs (BC plumber apprenticeship or challenge)",
      },
      {
        url: "https://www.gov.nl.ca/atcd/designated-trades/request-compulsory-certification/",
        supports: "regulators NL (plumber not compulsory)",
      },
    ],
    lastVerified: "September 2026",
    confidence: "medium",
  },
];

/** Number of the 13 provinces and territories where a licence or certificate is required. */
export const regulatedCount = (c: CredentialProfession): number =>
  c.regulators.filter((r) => r.required).length;

export const getCredential = (slug: string): CredentialProfession | undefined =>
  CREDENTIALS.find((c) => c.slug === slug);

const BY_NOC = new Map(CREDENTIALS.flatMap((c) => c.nocCodes.map((n) => [n.noc, c] as const)));

/** The licensing guide for a NOC 2021 code, if we have one. */
export const credentialForNoc = (noc: string): CredentialProfession | undefined => BY_NOC.get(noc);

export const FCR_TOOL_URL =
  "https://www.canada.ca/en/employment-social-development/programs/foreign-credential-recognition.html";
export const CICIC_REGULATED_URL =
  "https://www.cicic.ca/928/find_out_if_your_occupation_is_regulated_or_not.canada";

// Hub-level FAQ (targets "foreign credential recognition canada", "which jobs are regulated in canada").
export const CREDENTIALS_HUB_FAQS: { q: string; a: string }[] = [
  {
    q: "Which jobs are regulated in Canada?",
    a: "About 20% of jobs in Canada are regulated, according to the Canadian Information Centre for International Credentials. They include most health professions, engineering, law, public accounting, teaching, and many trades such as electrician and plumber. Each province and territory decides, so a job can be regulated in one province and not in another.",
  },
  {
    q: "Is an Educational Credential Assessment (ECA) the same as a licence?",
    a: "No. An ECA shows that your degree equals a Canadian one for immigration. IRCC says it does not guarantee a licence to practise or a job in your field. If your job is regulated, the provincial regulator runs its own assessment, even if you already have an ECA.",
  },
  {
    q: "Can I start credential recognition before I arrive in Canada?",
    a: "Often, yes. National assessment bodies such as the National Nursing Assessment Service and the Medical Council of Canada accept applications from outside Canada, and many regulators do too. Job Bank advises applying early, because the sooner you start, the sooner you can qualify. Collect transcripts and certified translations before you leave.",
  },
  {
    q: "Can I work in my field while I get licensed?",
    a: "You can work in a related job that does not use the protected title or restricted tasks. For example, an internationally educated nurse can work as a health care aide, and an engineer can work as a technologist. Each profession page lists related jobs and their NOC codes.",
  },
  {
    q: "How long does it take to get foreign credentials recognized in Canada?",
    a: "It depends on the profession and on how close your training is to the Canadian standard. A document or degree assessment can take a few weeks to a few months. Full licensing with exams, extra courses, or supervised practice can take one year or more. Start early and ask the regulator for its current processing times.",
  },
];
