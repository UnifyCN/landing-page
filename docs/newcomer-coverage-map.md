# Newcomer coverage map

The goal: when a newcomer asks Google or an AI assistant a practical question about life in
Canada (money, work, resume, health, housing, status), a Unify page answers it. This map lists
every topic in the newcomer journey, the URL that owns it, and the gaps.

**Why it exists.** Search Console only shows topics where the site already appears. A topic
with no page has no impressions, so a GSC-driven process keeps writing deeper into what
already ranks (TEER, health cards, licences) and never finds the gaps. This map is the list
the weekly blog automation picks from. See "Rules for the weekly automation" at the bottom.

Evidence column: Search Console, last 3 months to 2026-09-19 (impressions, average position).
Baseline on that date: 251 of 1,128 clicks (22%) went to pages other than TEER and brand pages.
That share is the breadth metric. Re-check it monthly.

## Status legend

| Status | Meaning | What the automation may do |
|---|---|---|
| `hub` | A programmatic cluster page owns the intent. | Never write a post on the same intent. A spoke with a narrower intent is allowed (one occupation, one province, one country). |
| `post` | One blog post owns it. | Do not write a second post on the same intent. |
| `thin` | Owned for one audience or one province only. | A post that covers the general case is allowed. |
| `gap` | No page answers it. | Pick from here first, by priority. |

Priority: **P1** = demand evidence (GSC or web search) and a winnable SERP; **P2** = likely demand,
check the SERP first; **P3** = government-dominated or low demand, do last.

## 1. Arrival (first 30 days)

| Topic | Owner | Status | Evidence | Priority |
|---|---|---|---|---|
| Social Insurance Number (SIN) | `/blog/how-to-get-a-sin-number-in-canada-newcomer-guide` | post | 1,419 impr, pos 16 | improve post |
| First week / first 30 days checklist for PRs and workers | `/blog/what-should-international-students-do-in-their-first-week-in-canada` (students only) | thin | 137 impr | **P1** |
| Provincial health card | `/health-card` | hub | new 2026-09-21 | - |
| Family doctor | `/blog/how-to-find-a-family-doctor-in-bc-as-a-newcomer` (BC only) | thin | - | P2 |
| Driver's licence exchange | `/drivers-licence` | hub | new 2026-09-21 | - |
| Car insurance | `/blog/car-insurance-for-newcomers-in-bc-icbc-autoplan-guide` (BC only) | thin | - | P2 |
| Cell phone plan | `/blog/how-to-get-a-cell-phone-plan-in-canada-as-a-newcomer` | post | - | - |
| Public transit | `/resources/how-does-public-transit-work-in-metro-vancouver` (Vancouver video) | thin | 60 impr | P3 |
| Provincial photo ID card | - | gap | - | P3 |

## 2. Money and banking

| Topic | Owner | Status | Evidence | Priority |
|---|---|---|---|---|
| Open a bank account as a newcomer | `/blog/how-do-international-students-open-a-bank-account-in-canada` (students only) | thin | 167 queries, 3,429 impr, pos 47 | **P1** (planned `/banking` hub) |
| Build credit with no history | `/blog/how-to-build-credit-in-canada-as-a-newcomer`, `/blog/how-do-international-students-build-credit-in-canada` | post | 338 impr, pos 27 | - |
| TFSA vs RRSP | `/blog/tfsa-vs-rrsp-for-newcomers-to-canada-which-to-open-first` | post | - | - |
| Budgeting | `/resources/how-to-budget-your-money` (video) | thin | 5 impr | P3 |
| Government benefits (Canada Child Benefit, GST/HST credit, forms RC66 and RC151) | - | gap | web demand, not yet checked | **P1** (planned benefits hub) |
| Sending money home | - | gap | - | P2 |

## 3. Taxes

| Topic | Owner | Status | Evidence | Priority |
|---|---|---|---|---|
| First tax return | `/blog/how-do-newcomers-file-their-first-tax-return-in-canada-step-by-step-guide` | post | 58 impr | - |
| The 90% rule | `/blog/when-newcomers-can-claim-full-non-refundable-tax-credits-in-canada-the-90-rule-explained` | post | 13,081 impr, pos 3.9, CTR 0.38% | - |
| Moved mid-year (split-year) | `/blog/how-to-file-taxes-when-you-moved-to-canada-mid-year-split-year-residency` | post | 517 impr | - |
| Tax refund forms | `/blog/key-tax-refund-forms-for-newcomers-in-canada-a-guide` | post | 126 impr | - |
| Foreign income | `/blog/reporting-foreign-income-as-a-canadian-newcomer-what-must-you-declare` and `/blog/how-is-foreign-income-taxed-in-canada` | post (two posts compete) | 6,346 impr pos 13 + 2,709 impr pos 24 | planned merge; never add a third |
| Tax treaty by home country | - | gap | Countries.csv: India, Philippines, UK, Nigeria, Pakistan | P3 (high risk, needs care) |

## 4. Work and careers

| Topic | Owner | Status | Evidence | Priority |
|---|---|---|---|---|
| TEER, NOC codes, skilled jobs for PR | `/teer` | hub | 103,932 impr, pos 6.9 | - |
| Credential recognition, regulated professions | `/credentials` | hub | new 2026-09 | - |
| Canadian resume format | `/canadian-resume` | hub | new 2026-09 | - |
| Cover letter | `/resources/how-to-write-a-cover-letter` (video) | thin | 4 impr, pos 46 | P2 |
| Job interview | `/resources/how-to-prepare-for-a-job-interview` (video) | thin | 20 impr, pos 39 | P2 |
| Find a job with no Canadian experience | - | gap | - | **P1** |
| Job search platforms | `/blog/best-platforms-for-career-guidance-for-immigrants-in-canada` | post | 238 impr | - |
| Bridging programs | `/blog/bridging-programs-for-newcomers-in-canada-the-path-from-international-credentials-to-canadian-employment` | post | 43 impr | - |
| Networking and mentoring | `/blog/mentoring-and-professional-networks-for-newcomers-in-canada-how-to-build-your-canadian-career-network` | post | 178 impr | - |
| Sector training, women's programs, pre-arrival programs | three `/blog/` posts | post | - | - |
| Internships and first Canadian work experience | two `/blog/` posts | post | - | - |
| Minimum wage by province | - | gap | "minimum wage toronto" earned a click | P2 (programmatic candidate) |
| Workers' rights and employment standards | - | gap | - | P2 |
| Part-time jobs for students | `/blog/how-can-international-students-find-a-part-time-job-in-canada` | post | 351 impr | - |

## 5. Status and immigration

| Topic | Owner | Status | Evidence | Priority |
|---|---|---|---|---|
| PR through LMIA and PNP | `/blog/how-to-get-pr-in-canada-lmia-and-pnp-for-international-workers` | post | 215 impr | - |
| Entry-level jobs to PR | `/blog/how-entry-level-jobs-can-lead-to-permanent-residency-pr-in-canada` | post | 1,194 impr | - |
| How to immigrate | `/blog/how-to-immigrate-to-canada-in-2026` | post | 164 impr | - |
| Citizenship | `/blog/canada-immigration-citizenship-guide` | post | 36 impr | - |
| Work permits and PGWP | - | gap | - | P2 |
| Express Entry and CRS | - | gap | government-dominated | P3 |

## 6. Housing

| Topic | Owner | Status | Evidence | Priority |
|---|---|---|---|---|
| Rent a first apartment with no credit | `/blog/how-to-rent-your-first-apartment-in-canada-as-a-newcomer-with-no-credit-history` | post | - | - |
| Student housing | `/blog/how-do-international-students-find-safe-affordable-housing-in-canada` | post | 321 impr | - |
| Tenant rights by province | - | gap | - | P2 (programmatic candidate) |
| Rental scams | - | gap | - | P3 |

## 7. Family and school

| Topic | Owner | Status | Evidence | Priority |
|---|---|---|---|---|
| Enrol children in school | - | gap | - | P2 |
| Child care and $10-a-day spaces | - | gap | - | P2 |

## 8. Language

| Topic | Owner | Status | Evidence | Priority |
|---|---|---|---|---|
| Language for work, LINC | `/blog/language-for-work-programs-in-canada-beyond-linc-what-newcomers-actually-need` | post | 66 impr | - |
| Free English and French classes (who qualifies) | - | gap | no GSC demand | P3 |

## 9. International students

Owned by posts: first week, housing, health insurance, bank account, credit, part-time jobs,
internships, co-op mistakes. Health insurance for students has demand at pos 24 to 31
("health insurance for international students in canada"); improve that post before adding more.

## 10. Community and settlement services

| Topic | Owner | Status | Evidence | Priority |
|---|---|---|---|---|
| Settlement services | `/partners` (Metro Vancouver and BC only) | thin | partner pages pos 20 to 37, 0 clicks | P3 (deferred) |
| Community events | `/community` | post | - | - |

## Rules for the weekly automation

1. **Gap first.** Pick the highest-priority `gap` or `thin` row that `/tmp/existing-posts.json`
   does not already cover. Confirm demand with a web search and confirm the SERP is winnable
   (not owned by canada.ca, CRA, or IRCC head terms).
2. **Spoke quota.** A spoke deepens an existing hub (a TEER occupation, one province's health
   card or licence rule, one regulated profession, a resume detail). Read the three most recent
   posts in `/tmp/existing-posts.json` (it is sorted newest first). If any of them is a spoke,
   this week's post MUST be a gap topic. So no more than about 1 post in 4 is a spoke.
3. **No intent overlap.** Never write a post whose main question a `hub` page or an existing
   `post` already answers. Improve or link to the owner instead.
4. **Link up.** Every post links to the hub or post that owns the nearest topic, and to `/`
   with the anchor "newcomer settlement app".
5. **Keep this map true.** When a person edits the repo after a run, they move the new post's
   row from `gap` to `post` and add its slug. The routine does not commit to the repo, so it
   re-derives coverage from `/tmp/existing-posts.json` each run.
