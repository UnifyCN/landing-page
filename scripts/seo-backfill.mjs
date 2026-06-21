// One-off backfill: set seoTitle + seoDescription on the blog posts that earn
// Google impressions, keyed to their real GSC queries. Keeps the editorial
// `title` (the on-page H1) untouched; only adds the SERP-tuned fields.
//
// Usage:
//   node scripts/seo-backfill.mjs            # dry run: prints copy + char counts, writes nothing
//   SANITY_WRITE_TOKEN=sk... node scripts/seo-backfill.mjs --commit   # applies changes
//
// Target lengths: seoTitle <= 60 chars (ideal 50-60), seoDescription 140-160.

import { createClient } from '@sanity/client';

// slug -> { seoTitle, seoDescription }. Slugs are the LIVE Sanity slugs.
const COPY = [
  {
    slug: 'the-easiest-skilled-jobs-to-transition-into-teer-3-for-pr-purposes-in-canada',
    seoTitle: 'TEER 3 Jobs in Canada: Easiest Skilled Jobs for PR',
    seoDescription:
      'TEER 3 jobs are skilled roles that can qualify you for Canadian PR and Express Entry. See the easiest TEER 3 occupations to transition into, with examples.',
  },
  {
    slug: 'reporting-foreign-income-as-a-canadian-newcomer-what-must-you-declare',
    seoTitle: 'Foreign Income in Canada: What Newcomers Must Declare',
    seoDescription:
      'New to Canada? You report worldwide income earned once you become a tax resident. Here is exactly what foreign income to declare to the CRA, and what is exempt.',
  },
  {
    slug: 'when-newcomers-can-claim-full-non-refundable-tax-credits-in-canada-the-90-rule-explained',
    seoTitle: "Canada's 90% Rule: Full Tax Credits for Newcomers",
    seoDescription:
      'The 90% rule decides whether newcomers can claim the full Basic Personal Amount and non-refundable tax credits in year one. Here is how to know if you qualify.',
  },
  {
    slug: 'how-to-immigrate-to-canada-in-2026',
    seoTitle: "How to Immigrate to Canada in 2026: Newcomer's Guide",
    seoDescription:
      'A clear, up-to-date 2026 guide to immigrating to Canada: study, work, Express Entry, PNP, and family sponsorship pathways, plus what changed this year.',
  },
  {
    slug: 'how-do-newcomers-file-their-first-tax-return-in-canada-step-by-step-guide',
    seoTitle: 'Filing Your First Tax Return in Canada as a Newcomer',
    seoDescription:
      'A step-by-step guide to your first Canadian tax return as a newcomer: residency status, the NR74 form, what to report, deadlines, and credits you can claim.',
  },
  {
    slug: 'canada-immigration-citizenship-guide',
    seoTitle: 'Immigration to Canada 2026: Study, Work & Citizenship',
    seoDescription:
      'Your complete 2026 guide to Canadian immigration: study permits, work permits, Express Entry, PNP, family sponsorship, and the path to citizenship.',
  },
  {
    slug: 'how-to-file-taxes-when-you-moved-to-canada-mid-year-split-year-residency',
    seoTitle: 'Split-Year Residency: Taxes After Moving to Canada',
    seoDescription:
      'Moved to Canada partway through the year? Split-year residency means you are taxed as a resident only from your arrival date. Here is how to file it correctly.',
  },
  {
    slug: 'credential-recognition-in-canada-a-step-by-step-guide-for-internationally-trained-professionals',
    seoTitle: 'Credential Recognition in Canada: Step-by-Step Guide',
    seoDescription:
      'How to get your foreign degree or professional credentials recognized in Canada: assessment bodies, regulated professions, typical costs, and timelines.',
  },
  {
    slug: 'bridging-programs-for-newcomers-in-canada-the-path-from-international-credentials-to-canadian-employment',
    seoTitle: 'Bridging Programs in Canada: Credentials to Jobs',
    seoDescription:
      'Bridging programs help internationally trained newcomers qualify for licensed Canadian jobs. See who they are for, what they cost, and how to find one.',
  },
  {
    slug: 'how-to-get-your-first-internship-in-canada-as-an-international-student',
    seoTitle: 'First Internship in Canada for International Students',
    seoDescription:
      'How international students land a first internship in Canada: where to look, work-permit rules, resume tips, and how to turn a co-op into a job offer.',
  },
  {
    slug: 'key-tax-refund-forms-for-newcomers-in-canada-a-guide',
    seoTitle: 'Tax Refund Forms Newcomers in Canada Need to Know',
    seoDescription:
      'The key CRA forms newcomers need to claim refunds and credits in Canada, from the T1 return to the NR74, explained in plain language with who needs each.',
  },
  {
    slug: 'what-actually-counts-as-skilled-work-in-canada-10-jobs-newcomers-always-miss',
    seoTitle: 'What Counts as Skilled Work in Canada? (10 Jobs)',
    seoDescription:
      'Skilled work in Canada is not only office jobs. See 10 TEER 0-3 occupations newcomers overlook that can qualify you for PR and Express Entry.',
  },
  {
    slug: 'best-platforms-for-career-guidance-for-immigrants-in-canada',
    seoTitle: 'Best Career Guidance Platforms for Immigrants (2026)',
    seoDescription:
      'The best career-guidance platforms and services for immigrants in Canada in 2026, compared by cost, who they help, and the kind of support they offer.',
  },
  {
    slug: 'language-for-work-programs-in-canada-beyond-linc-what-newcomers-actually-need',
    seoTitle: 'Language for Work Programs in Canada (Beyond LINC)',
    seoDescription:
      'LINC is not the only option. Compare occupation-specific language training like ELT and OSLT that helps newcomers reach the level Canadian employers expect.',
  },
  {
    slug: 'how-entry-level-jobs-can-lead-to-permanent-residency-pr-in-canada',
    seoTitle: 'Can Entry-Level Jobs Lead to PR in Canada?',
    seoDescription:
      'Entry-level work can be a stepping stone to Canadian PR via Express Entry and the PNP. Here is how to move from a survival job to a PR-eligible skilled role.',
  },
];

function report() {
  let problems = 0;
  console.log(`\nProposed seoTitle / seoDescription for ${COPY.length} posts:\n`);
  for (const { slug, seoTitle, seoDescription } of COPY) {
    const tLen = seoTitle.length;
    const dLen = seoDescription.length;
    const tFlag = tLen > 60 ? '  !! TITLE > 60' : '';
    const dFlag = dLen < 140 || dLen > 160 ? `  !! DESC ${dLen} out of 140-160` : '';
    if (tFlag || dFlag) problems++;
    console.log(`• ${slug}`);
    console.log(`   T(${tLen}): ${seoTitle}${tFlag}`);
    console.log(`   D(${dLen}): ${seoDescription}${dFlag}\n`);
  }
  console.log(problems ? `${problems} length issue(s) above.` : 'All within target lengths.');
  return problems;
}

async function commit() {
  const token = process.env.SANITY_WRITE_TOKEN;
  if (!token) {
    console.error('ERROR: set SANITY_WRITE_TOKEN to commit.');
    process.exit(1);
  }
  const client = createClient({
    projectId: 'j4gu2dbr',
    dataset: 'production',
    apiVersion: '2024-01-01',
    token,
    useCdn: false,
  });
  const idBySlug = new Map(
    (
      await client.fetch(`*[_type=="post" && !(_id in path("drafts.**")) && defined(slug.current)]{_id, "slug": slug.current}`)
    ).map((p) => [p.slug, p._id])
  );
  let ok = 0;
  for (const { slug, seoTitle, seoDescription } of COPY) {
    const id = idBySlug.get(slug);
    if (!id) {
      console.warn(`SKIP (no post found): ${slug}`);
      continue;
    }
    await client.patch(id).set({ seoTitle, seoDescription }).commit();
    console.log(`set: ${slug}`);
    ok++;
  }
  console.log(`\nDone. Patched ${ok}/${COPY.length} posts.`);
}

const problems = report();
if (process.argv.includes('--commit')) {
  if (problems) {
    console.error('\nRefusing to commit while length issues exist. Fix COPY first.');
    process.exit(1);
  }
  await commit();
} else {
  console.log('\nDry run only. Re-run with --commit and SANITY_WRITE_TOKEN to apply.');
}
