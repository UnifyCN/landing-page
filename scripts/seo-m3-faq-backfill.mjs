// M3 backfill: add keyTakeaway (answer-first block) + faqs (FAQPage) to the 5
// tax-cluster posts. Facts verified against canada.ca (CRA). Does NOT touch the
// post body. Same safety model as seo-backfill.mjs.
//
//   node scripts/seo-m3-faq-backfill.mjs            # dry run, writes nothing
//   SANITY_WRITE_TOKEN=sk... node scripts/seo-m3-faq-backfill.mjs --commit

import { createClient } from '@sanity/client';

const CONTENT = [
  {
    slug: 'reporting-foreign-income-as-a-canadian-newcomer-what-must-you-declare',
    keyTakeaway:
      'As a newcomer, you report worldwide income to the CRA only from the date you became a Canadian tax resident, not before. That includes foreign employment, investment, and rental income earned after arrival. Income earned before you arrived is generally not taxable in Canada, though it can affect your credit and benefit calculations.',
    faqs: [
      {
        question: 'Do newcomers pay Canadian tax on foreign income?',
        answer:
          'Yes, but only on foreign income earned after you became a Canadian tax resident. From your date of entry you report world income from all sources, inside and outside Canada, in Canadian dollars. Income earned before you arrived is generally not taxed here.',
      },
      {
        question: 'What foreign income do I have to declare?',
        answer:
          'All income earned after becoming a resident: foreign employment or self-employment, pensions, interest, dividends, and rental income, reported in Canadian dollars. If you already paid tax on it abroad, you may claim a foreign tax credit (Form T2209) so the same income is not taxed twice.',
      },
      {
        question: 'Is income I earned before moving to Canada taxable?',
        answer:
          'Generally no. Income earned before you became a Canadian tax resident is not taxed in Canada. You may still need to report it as part of your net world income for the non-resident part of the year, because it affects whether you qualify for full non-refundable tax credits.',
      },
    ],
  },
  {
    slug: 'when-newcomers-can-claim-full-non-refundable-tax-credits-in-canada-the-90-rule-explained',
    keyTakeaway:
      'The 90% rule decides whether you can claim full federal non-refundable tax credits, like the Basic Personal Amount, in your year of arrival. If the Canadian-source income you report for the part of the year before you became a resident was 90% or more of your net world income for that period, you claim the credits in full. Otherwise they are prorated by your entry date.',
    faqs: [
      {
        question: 'What is the 90% rule for newcomers in Canada?',
        answer:
          'It is a CRA test for your year of arrival. If 90% or more of your net world income for the part of the year you were not a resident came from Canadian sources, you can claim full federal non-refundable tax credits. If not, the credits are prorated based on your date of entry.',
      },
      {
        question: "What happens if I don't meet the 90% rule?",
        answer:
          'Your federal non-refundable tax credits are prorated based on the number of days you were a resident during the year. You still receive credits, just a reduced amount that reflects the part of the year you actually lived in Canada.',
      },
      {
        question: 'Does declaring zero pre-arrival income meet the 90% rule?',
        answer:
          'No. Under a recent CRA change, declaring zero income (Canadian or foreign) for the period before you arrived no longer satisfies the 90% rule, so your non-refundable tax credits will be prorated. Report your actual pre-arrival net world income.',
      },
    ],
  },
  {
    slug: 'how-to-file-taxes-when-you-moved-to-canada-mid-year-split-year-residency',
    keyTakeaway:
      'If you moved to Canada partway through the year you are a part-year resident: you are taxed as a Canadian resident only from your date of entry to December 31. You report world income earned from that date onward and enter your date of entry on your return. Some amounts and credits are prorated for the part of the year you lived here.',
    faqs: [
      {
        question: 'What is split-year residency in Canada?',
        answer:
          'In your year of arrival you are a part-year resident. You are treated as a non-resident before your date of entry and as a resident from that date to year-end, so you only report world income for the resident part of the year.',
      },
      {
        question: 'What date do I use as my date of entry?',
        answer:
          'Use the date you established significant residential ties in Canada, usually when you arrived to live here with a home, spouse, or dependants. If you are unsure, you can ask the CRA to determine it using Form NR74.',
      },
      {
        question: 'Are my tax credits reduced if I moved mid-year?',
        answer:
          'They can be. Federal non-refundable tax credits may be prorated based on your date of entry unless you meet the 90% rule for the part of the year you were not a resident. Some credits also have their own newcomer rules.',
      },
    ],
  },
  {
    slug: 'how-do-newcomers-file-their-first-tax-return-in-canada-step-by-step-guide',
    keyTakeaway:
      'To file your first Canadian tax return as a newcomer, you need a SIN, you report your world income from your date of entry to December 31, and you file by April 30. You can file online with NETFILE-certified software or on paper. If you are unsure of your residency date, Form NR74 lets the CRA determine it.',
    faqs: [
      {
        question: 'How do newcomers file their first tax return in Canada?',
        answer:
          'Get a Social Insurance Number, gather your income slips, and report your world income from your date of entry to December 31 in Canadian dollars. File by April 30 using NETFILE-certified software or on paper, and apply separately for benefits like the GST/HST credit.',
      },
      {
        question: 'What is Form NR74?',
        answer:
          'Form NR74, Determination of Residency Status (Entering Canada), is how you ask the CRA to officially decide the date you became a Canadian tax resident. It helps when your residency date is unclear, since that date determines what income you report.',
      },
      {
        question: 'Can newcomers file taxes online with NETFILE?',
        answer:
          'Yes. You can file with NETFILE-certified tax software, which sends your return to the CRA and usually processes in about two weeks. You can also file on paper, which takes longer (around eight weeks). The deadline either way is April 30.',
      },
      {
        question: 'Do I need a SIN to file a tax return?',
        answer:
          'Yes. You need a Social Insurance Number to file a Canadian tax return and receive benefits and credits. If you are not eligible for a SIN, you can apply for an Individual Tax Number (ITN) instead.',
      },
    ],
  },
  {
    slug: 'key-tax-refund-forms-for-newcomers-in-canada-a-guide',
    keyTakeaway:
      'The main forms newcomers use are the T1 General (your income tax and benefit return), Form NR74 if you need the CRA to confirm your residency date, and benefit applications like Form RC151 for the GST/HST credit. To avoid double tax on foreign income already taxed abroad, you may also claim the foreign tax credit on Form T2209.',
    faqs: [
      {
        question: 'What tax forms do newcomers in Canada need?',
        answer:
          'The core form is the T1 General return. Newcomers often also use Form NR74 to confirm their residency date, Form RC151 to apply for the GST/HST credit, and Form T2209 to claim a foreign tax credit on income already taxed in another country.',
      },
      {
        question: 'How do newcomers apply for the GST/HST credit?',
        answer:
          'If you became a resident during the year, apply using Form RC151, the GST/HST Credit application for individuals who become residents of Canada. In your first year you generally cannot get the credit just by filing your return, so this separate application matters.',
      },
      {
        question: 'Which form avoids double tax on foreign income?',
        answer:
          'Form T2209, Federal Foreign Tax Credits, lets you claim a credit for income or profit tax you already paid to another country on income you also report in Canada, so the same income is not fully taxed twice.',
      },
    ],
  },
];

function report() {
  console.log(`\nProposed keyTakeaway + FAQs for ${CONTENT.length} tax posts:\n`);
  let warn = 0;
  for (const { slug, keyTakeaway, faqs } of CONTENT) {
    const words = keyTakeaway.trim().split(/\s+/).length;
    const flag = words < 35 || words > 75 ? `  !! takeaway ${words} words (aim 40-60)` : '';
    if (flag) warn++;
    console.log(`• ${slug}`);
    console.log(`   Key takeaway (${words} words):${flag}`);
    console.log(`     ${keyTakeaway}`);
    console.log(`   FAQs (${faqs.length}):`);
    faqs.forEach((f) => console.log(`     Q: ${f.question}`));
    console.log('');
  }
  console.log(warn ? `${warn} takeaway length warning(s).` : 'All takeaways within target length.');
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
  for (const { slug, keyTakeaway, faqs } of CONTENT) {
    const id = idBySlug.get(slug);
    if (!id) {
      console.warn(`SKIP (no post found): ${slug}`);
      continue;
    }
    const faqItems = faqs.map((f, i) => ({
      _type: 'faq',
      _key: `faq-${i}`,
      question: f.question,
      answer: f.answer,
    }));
    await client.patch(id).set({ keyTakeaway, faqs: faqItems }).commit();
    console.log(`set: ${slug}`);
    ok++;
  }
  console.log(`\nDone. Patched ${ok}/${CONTENT.length} posts.`);
}

report();
if (process.argv.includes('--commit')) {
  await commit();
} else {
  console.log('\nDry run only. Re-run with --commit and SANITY_WRITE_TOKEN to apply.');
}
