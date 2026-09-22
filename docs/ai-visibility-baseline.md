# AI visibility baseline

Search Console cannot show when an AI assistant cites a site. This file is the only measure
of that. It records, for 20 fixed newcomer questions, whether Google AI Overviews, Perplexity,
and ChatGPT cite unifysocial.ca. Re-run it monthly with the same questions, word for word, and
add a dated results section. Do not change the questions; add new ones at the end.

## Summary: 2026-09-22 (first run)

| Engine | Questions run | unifysocial.ca cited | Most-cited domains |
|---|---|---|---|
| Google AI Overview | 20 (AI Overview on all 20) | **6** (Q3, Q4, Q5, Q12, Q13, Q14) | canada.ca, rbcroyalbank.com, unifysocial.ca, youtube.com |
| Perplexity | 20 | **4** (Q3, Q4, Q13, Q20) | canada.ca, rbcroyalbank.com, cicnews.com, unifysocial.ca |
| ChatGPT (web search) | 20 | **0** | canada.ca (13 of 20), then provincial .gc.ca and .gov sites |

What it shows:
- Unify is already cited where it has deep, ranking content: taxes (foreign income, the 90% rule,
  first return), TEER, and the BC MSP wait. These match the pages with the most Search Console
  impressions, so ranking and citation move together.
- Money questions (bank account, credit, benefits), resume and job-search questions, and
  credential questions cite banks, resume sites, and regulators, never Unify. These are the
  gaps that `/banking`, the benefits hub, `/canadian-resume`, and `/credentials` target.
- ChatGPT cites almost only government sources. Winning there needs third-party mentions and
  time, not only on-site pages.

Pages that did not exist at this run: `/credentials`, `/canadian-resume` (built 2026-09-22),
and `/health-card`, `/drivers-licence` (built 2026-09-21, not yet indexed). Expect changes on
Q7 to Q11 and Q15 to Q16 at the next run.

## Method

- Browser: the Aside browser (`aside repl`), signed in to Google.
- Google: `google.ca/search?q=<question>&hl=en&gl=ca`, cited links inside the AI Overview only.
- Perplexity: signed out, default mode.
- ChatGPT: temporary chat with web search, on a signed-in account. **Caveat:** that account has
  a ChatGPT project named "Unify", so answers can be biased toward Unify. The two ChatGPT answers
  that named Unify without a link (Q14, Q20) are not counted. Use a signed-out session next time.
- "Cited" = a link to unifysocial.ca in the answer's sources. Google's own help and policy links
  are removed. The Google Q20 row picked up car-dealer ads and needs a manual re-run.

## The 20 questions and results (2026-09-22)

Each cell: whether unifysocial.ca is cited, then the first two other domains cited.

| # | Question | Google AI Overview | Perplexity | ChatGPT |
|---|---|---|---|---|
| 1 | How do I open a bank account in Canada as a new immigrant? | No (wealthsimple.com, cibc.com) | No (canada.ca, rbcroyalbank.com) | No (canada.ca) |
| 2 | How can a newcomer build credit in Canada with no credit history? | No (wealthsimple.com, rbcroyalbank.com) | No (canada.ca, startright.scotiabank.com) | No (canada.ca) |
| 3 | Do I have to report foreign income on my Canadian tax return as a newcomer? | **Cited** (canada.ca, boyer-boyer.com) | **Cited** (canada.ca, questrade.com) | No (canada.ca) |
| 4 | What is the 90% rule for newcomers filing taxes in Canada? | **Cited** (turbotax.intuit.ca, acomptax.com) | **Cited** (canada.ca, help.wealthsimple.com) | No (canada.ca) |
| 5 | How do I file my first tax return in Canada after moving mid-year? | **Cited** (canada.ca, hrblock.ca) | No (canada.ca) | No (canada.ca) |
| 6 | What government benefits can newcomers get in Canada, like the Canada Child Benefit? | No (canada.ca, cibc.com) | No (canada.ca, diasporanorth.ca) | No (canada.ca) |
| 7 | How do I write a Canadian-style resume as a newcomer? | No (canadavisa.com, linkedin.com) | No (rbcroyalbank.com, cicnews.com) | No |
| 8 | How can a newcomer find a job in Canada with no Canadian experience? | No (youtube.com, rbcroyalbank.com) | No (hirenewcomerscanada.ca, definitelycanada.com) | No (bc.jobbank.gc.ca, canada.ca) |
| 9 | How do I get my foreign credentials recognized in Canada? | No (canada.ca, remitly.com) | No (canada.ca, educanada.ca) | No (canada.ca, welcomebc.ca) |
| 10 | How do I become a registered nurse in Canada as an internationally educated nurse? | No (bccnm.ca, nnas.ca) | No (internationalhealthprofessionals.ca, albertanursing.ca) | No (nnas.ca, bccnm.ca) |
| 11 | How can a foreign-trained engineer get licensed in Canada? | No (engineerscanada.ca, egbc.ca) | No (engineerscanada.ca, globalstudyboard.com) | No (engineerscanada.ca, egbc.ca) |
| 12 | Which TEER categories are eligible for Express Entry? | **Cited** (upimmigration.ca, expressentryprogram.com) | No (canada.ca, canadim.com) | No (canada.ca) |
| 13 | What are some TEER 3 jobs that can lead to PR in Canada? | **Cited** (canadavisa.com, canada.ca) | **Cited** (cicnews.com, k7immigration.com) | No (canada.ca, noc.esdc.gc.ca) |
| 14 | How long is the MSP waiting period in BC for newcomers? | **Cited** (www2.gov.bc.ca, peopleslawschool.ca) | No (www2.gov.bc.ca, peopleslawschool.ca) | No (www2.gov.bc.ca) |
| 15 | Which provinces have no waiting period for health coverage for newcomers? | No (insubuy.com, cibc.com) | No (ontario.ca, canada.ca) | No |
| 16 | Can I exchange my foreign driver's licence in Ontario? | No (drivetest.ca, news.ontario.ca) | No (ontario.ca, honeymilkstudio.ca) | No (ontario.ca) |
| 17 | How do I get a SIN number when I arrive in Canada? | No (canada.ca, sin-nas.canada.ca) | No (canada.ca, sin-nas.canada.ca) | No (canada.ca) |
| 18 | What should I do in my first week after landing in Canada as a newcomer? | No (canada.ca, mosaicbc.org) | No (canada.ca, cibc.com) | No (canada.ca, www2.gov.bc.ca) |
| 19 | How can international students find a part-time job in Canada? | No (aeccglobal.com, canada.ca) | No (canada.ca, rbcroyalbank.com) | No (canada.ca, jobbank.gc.ca) |
| 20 | What apps help newcomers settle in Canada? | extraction error (ads); re-run by hand | **Cited** (apps.apple.com, play.google.com) | No (apps.apple.com, play.google.com) |
