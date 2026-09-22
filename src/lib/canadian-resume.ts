// Content for the /canadian-resume pillar guide.
// Rules are checked against the primary sources in RESUME_SOURCES (Job Bank, IRCC,
// Ontario Human Rights Commission, Ontario Ministry of Labour) in September 2026.
// When a source changes, update the entry and RESUME_LAST_VERIFIED, not the template.

export interface ResumeFaq {
  q: string;
  a: string;
}

export interface ResumeSection {
  title: string;
  /** HTML allowed. */
  body: string;
}

export interface ResumeRewrite {
  before: string;
  after: string;
  why: string;
}

export const RESUME_LAST_VERIFIED = "September 2026";

/** "Include" vs "leave out" table rows. */
export const RESUME_INCLUDE: { item: string; note: string }[] = [
  { item: "Name, city and province, phone, email", note: "A full street address is optional. Use an email based on your name." },
  { item: "A 3 to 4 line summary", note: "Your target role, years of experience, and top skills. Add your work status here." },
  { item: "Results with numbers", note: "How many people, how much money, how much time saved. Job Bank asks for this." },
  { item: "Canadian equivalent of your degree", note: "If you have an Educational Credential Assessment (ECA), show its result." },
  { item: "Licences and where you are in the process", note: "For regulated jobs, name the Canadian regulator and your status." },
  { item: "Volunteer work", note: "It counts as experience in Canada, paid or not." },
];

export const RESUME_LEAVE_OUT: { item: string; note: string }[] = [
  { item: "Photo", note: "Not the norm in Canada. Ontario's Human Rights Commission says employers should not ask for one." },
  { item: "Age or date of birth", note: "Human rights rules stop employers asking. Job Bank says leave it out." },
  { item: "Marital status, religion, children", note: "Personal details that employers cannot use to decide." },
  { item: "Social Insurance Number (SIN)", note: "Give it only after you are hired." },
  { item: "\"References available on request\"", note: "Job Bank says give references separately, when asked." },
  { item: "Reasons you left a job", note: "Save it for the interview." },
];

/** The sections of a Canadian resume, in order. */
export const RESUME_SECTIONS: ResumeSection[] = [
  {
    title: "Contact header",
    body: "Your name, <strong>city and province</strong>, phone number, and a professional email. Add a LinkedIn URL if your profile is complete. Use a Canadian phone number as soon as you have one.",
  },
  {
    title: "Summary (highlights of qualifications)",
    body: "Three or four lines: the role you want, your years of experience, and two or three strengths that match the posting. End with your work status, for example <em>\"Permanent resident, eligible to work in Canada.\"</em>",
  },
  {
    title: "Skills",
    body: "Six to ten skills, written with the same words the job posting uses. Split them into technical skills and tools if the list is long.",
  },
  {
    title: "Work experience",
    body: "Most recent job first. For each job: title, employer, city and country, and dates (month and year). Then 3 to 5 bullets that show <strong>results, not duties</strong>. Job Bank suggests roles from the last 15 years only.",
  },
  {
    title: "Education",
    body: "Degree, school, country, and year. If you have an ECA, add the Canadian equivalent, for example <em>\"Assessed by WES as equivalent to a Canadian bachelor's degree.\"</em>",
  },
  {
    title: "Licences and certifications",
    body: "For a regulated job, name the Canadian regulator and your stage, for example <em>\"NCLEX-RN passed; BCCNM registration in progress.\"</em> See <a href=\"/credentials\">licensing by profession</a>.",
  },
  {
    title: "Volunteer experience and languages",
    body: "Volunteer roles in Canada show local experience. List the languages you speak and your level. A second language is an advantage for many jobs.",
  },
];

/** Duties-to-results rewrites, the single biggest change most newcomer resumes need. */
export const RESUME_REWRITES: ResumeRewrite[] = [
  {
    before: "Responsible for managing customer accounts.",
    after: "Managed 45 business accounts worth about $1.2M CAD a year; kept 96% of them for 3 years.",
    why: "A number and a result replace a duty.",
  },
  {
    before: "Developer, Infotech Solutions Pvt. Ltd.",
    after: "Developer, Infotech Solutions (IT services firm, Mumbai, 3,000 staff). Built payment APIs used by 2M customers a month.",
    why: "One line of context makes a foreign employer's size clear.",
  },
  {
    before: "Staff nurse, ICU.",
    after: "Cared for 3 to 4 ICU patients a shift in a 40-bed unit; trained 6 new nurses on ventilator protocols.",
    why: "Shows scope, not just a title.",
  },
];

/** How-to steps for newcomer-specific problems (foreign experience, gaps, titles). */
export const RESUME_NEWCOMER_TIPS: ResumeSection[] = [
  {
    title: "Match your job title to the Canadian one",
    body: "Titles differ between countries. Find the Canadian title for your work in the <a href=\"/teer\">NOC job lists</a> and use it, with your original title in brackets if it helps.",
  },
  {
    title: "Explain employers Canadians do not know",
    body: "Add one short line after the employer name: the industry, size, or what it does. Recruiters in Canada may not know large firms from your home country.",
  },
  {
    title: "Show numbers in Canadian terms",
    body: "Convert money to Canadian dollars (\"about $1.2M CAD\"), and use metric units and Canadian spelling (\"centre\", \"organization\").",
  },
  {
    title: "Explain a gap in one line",
    body: "A move to Canada is a normal reason for a gap. A line such as <em>\"Relocation to Canada and settlement, 2025\"</em> is enough. Add any courses or volunteer work from that time.",
  },
  {
    title: "Write one resume per job",
    body: "Job Bank says to change your resume for each posting. Keep a long master copy and cut it down to the 1 to 2 pages that match each job.",
  },
];

export const RESUME_FAQS: ResumeFaq[] = [
  {
    q: "Should I put a photo on my resume in Canada?",
    a: "No. A photo is not the norm in Canada, and Job Bank says it can lower your chances. The Ontario Human Rights Commission says employers should not ask for photos, because a photo shows age, sex, and race. Put your effort into results and skills instead.",
  },
  {
    q: "How long should a Canadian resume be?",
    a: "One to two pages. Job Bank recommends no more than two pages, 5 to 7 bullets per section, and roles from the last 15 years only. A new graduate or career changer usually fits on one page. Academic and medical CVs are the exception and can be longer.",
  },
  {
    q: "Should I include my immigration status on my resume?",
    a: "You do not have to, but a short line in your summary helps, for example \"Permanent resident, eligible to work in Canada\" or \"Open work permit valid to 2028\". Employers may ask if you are legally entitled to work in Canada, so answering it early removes a doubt.",
  },
  {
    q: "What is the difference between a CV and a resume in Canada?",
    a: "Most Canadian employers want a resume: one to two pages, focused on the job. A CV is longer and lists publications, research, and teaching. Use a CV only for academic, research, and some medical roles, or when the posting asks for one.",
  },
  {
    q: "How do I list a foreign degree on a Canadian resume?",
    a: "List the degree, school, country, and year, then the Canadian equivalent from your Educational Credential Assessment (ECA), for example \"Assessed by WES as equivalent to a Canadian master's degree\". IRCC designates five organizations that issue ECAs, including WES and ICAS.",
  },
  {
    q: "Can an employer ask for Canadian experience?",
    a: "In Ontario, since January 1, 2026, employers cannot put a Canadian experience requirement in a public job posting or its application form. Licensing requirements are not affected. The Ontario Human Rights Commission also treats a strict Canadian experience rule as discrimination in most cases.",
  },
];

export const RESUME_SOURCES: { label: string; url: string }[] = [
  { label: "Job Bank, How to write a good resume", url: "https://www.jobbank.gc.ca/findajob/resources/write-good-resume" },
  { label: "Job Bank, Find a job in Canada as a newcomer", url: "https://www.jobbank.gc.ca/findajob/newcomers" },
  {
    label: "IRCC, Educational Credential Assessment",
    url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/documents/education-assessed.html",
  },
  {
    label: "Ontario Human Rights Commission, Designing application forms",
    url: "https://www.ohrc.on.ca/en/iv-human-rights-issues-all-stages-employment/4-designing-application-forms",
  },
  {
    label: "Ontario, Employment Standards Act job posting rules",
    url: "https://www.ontario.ca/document/your-guide-employment-standards-act-0/requirements-related-publicly-advertised-job",
  },
];

export const JOB_BANK_RESUME_BUILDER = "https://www.jobbank.gc.ca/findajob/resume-builder";

// Unify web app tools, linked from the top of the guide. Both need a sign-in; the
// app's auth redirect keeps the query string, so the UTMs reach PostHog either way.
const APP_UTM = "utm_source=unifysocial.ca&utm_medium=referral&utm_campaign=canadian-resume";
export const UNIFY_RESUME_BUILDER = `https://app.unifysocial.ca/resume?${APP_UTM}`;
export const UNIFY_COVER_LETTER = `https://app.unifysocial.ca/cover-letter?${APP_UTM}`;
