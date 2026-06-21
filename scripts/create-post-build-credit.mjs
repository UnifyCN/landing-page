// Creates (and publishes) the "How to Build Credit in Canada as a Newcomer" post
// in Sanity: uploads the thumbnail, builds the Portable Text body, sets SEO fields
// + FAQs. Idempotent (createOrReplace on a fixed _id).
//
//   node scripts/create-post-build-credit.mjs            # dry run: prints summary, writes nothing
//   SANITY_WRITE_TOKEN=sk... node scripts/create-post-build-credit.mjs --commit
//
// Run from repo root.

import { createClient } from '@sanity/client';
import { readFileSync } from 'node:fs';

const SLUG = 'how-to-build-credit-in-canada-as-a-newcomer';
const THUMB = '.design-staging/credit-post-thumb.png';
const PUBLISHED_AT = '2026-06-21T12:00:00.000Z';

// ---- Portable Text builders ----
let kc = 0;
const key = () => `k${kc++}`;
const span = (text, marks = []) => ({ _type: 'span', _key: key(), text, marks });
const para = (text) => ({ _type: 'block', _key: key(), style: 'normal', markDefs: [], children: [span(text)] });
const h2 = (text) => ({ _type: 'block', _key: key(), style: 'h2', markDefs: [], children: [span(text)] });
const li = (lead, rest) => ({
  _type: 'block', _key: key(), style: 'normal', listItem: 'bullet', level: 1, markDefs: [],
  children: rest ? [span(lead, ['strong']), span(' ' + rest)] : [span(lead)],
});
const table = (rows) => ({
  _type: 'table', _key: key(),
  rows: rows.map((cells) => ({ _type: 'tableRow', _key: key(), cells })),
});

const body = [
  para('When you arrive in Canada, one surprise catches almost every newcomer off guard: your credit history does not come with you. Years of on-time payments and a strong score back home count for nothing here. You start at zero. That matters more than most people expect, because a Canadian credit score shapes whether you can rent an apartment, get a phone plan on contract, qualify for a credit card, or borrow for a car. In a recent TD survey, more than 80% of newcomers said they had faced challenges applying for credit. The good news: building credit in Canada is simple once you know the steps, and you can have a usable score in about six months.'),

  h2('Why your credit history does not transfer'),
  para('Canada’s two credit bureaus, Equifax and TransUnion, only track financial activity that happens in Canada. Your file back home is invisible to them, so when you arrive you have no Canadian credit file at all. This is not the same as having a low score. You simply have no score yet, and lenders cannot see any track record to judge you on.'),
  para('A few banks run newcomer programs that will look at your international credit history to approve a first credit card or loan. That can help you get started, but your actual Canadian score still has to be built here, from your activity after you land.'),

  h2('Step 1: Put the basics in place'),
  para('Before you can build credit, you need two things most newcomers set up in their first weeks:'),
  li('A Social Insurance Number (SIN).', 'You need it to work and to open most financial products.'),
  li('A Canadian bank account.', 'Open a chequing account for day-to-day money and a savings account for goals. Most major banks offer newcomer packages that waive monthly fees for a year or more.'),

  h2('Step 2: Get your first credit card'),
  para('Here is the catch-22 every newcomer hits: you need credit history to get approved for a card, but you need a card to build credit history. There are two reliable ways around it:'),
  li('A secured credit card.', 'You provide a refundable security deposit, often around $500, which becomes your credit limit. Because your deposit covers the lender’s risk, these cards are easy to qualify for with no Canadian history, and they report to the bureaus exactly like a regular card.'),
  li('A newcomer credit card.', 'Several banks offer cards designed for people new to Canada that do not require an existing Canadian credit file.'),
  table([
    ['Card type', 'Who it suits', 'Deposit needed', 'Builds credit?'],
    ['Secured card', 'Anyone, even with no history', 'Yes (refundable)', 'Yes'],
    ['Newcomer card', 'Recent arrivals (bank programs)', 'Usually no', 'Yes'],
    ['Regular card', 'Once you have some history', 'No', 'Yes'],
  ]),
  para('Either way, the card itself is just a tool. What actually builds your score is how you use it.'),

  h2('Step 3: Build the habits that grow your score'),
  li('Pay on time, every time.', 'Payment history is the single biggest factor in your score. Always pay at least the minimum by the due date, and ideally pay the full balance.'),
  li('Keep your balance low.', 'Try to use less than 30% of your limit. On a $1,000 limit, that means keeping your balance under $300, even if you pay it off in full.'),
  li('Do not apply for several products at once.', 'Each application triggers a hard check that can ding your score, and many checks in a short window look risky to lenders.'),
  li('Keep your first card open.', 'The longer your accounts stay active, the better, so avoid closing your oldest card once you upgrade.'),

  h2('A realistic timeline'),
  para('Building credit is a marathon, not a sprint, but the early milestones come faster than most people think:'),
  li('Month 1:', 'Open your bank account and get your first secured or newcomer card.'),
  li('Month 3:', 'Your first credit file is typically created at the bureaus.'),
  li('Month 6:', 'You usually have a visible score, often in the 600s.'),
  li('Month 12:', 'With consistent on-time payments and low balances, many newcomers reach 700 or higher, which unlocks better rates on loans and cards.'),

  h2('Common mistakes to avoid'),
  li('Missing a payment.', 'A single missed payment can stay on your report for years and is the fastest way to set your progress back.'),
  li('Maxing out the card.', 'High utilization hurts your score even if you eventually pay it off.'),
  li('Application-hopping.', 'Chasing several cards at once for sign-up perks creates hard checks that pull your score down.'),
  li('Waiting too long to start.', 'The clock only begins once you have an active credit product, so the sooner you start, the sooner you have a strong score.'),

  h2('Settle with confidence'),
  para('Building credit is one of the first practical steps to feeling at home in Canada, and it connects to almost everything else: housing, phone plans, even some rental and job applications. The sooner you start, the sooner it stops being a barrier, and the closer you are to settling in with confidence.'),
];

const faqs = [
  {
    question: 'Does my credit history transfer to Canada?',
    answer: 'No. Equifax and TransUnion only track activity in Canada, so you build a Canadian credit file from scratch when you arrive. Some banks will consider your international history for a newcomer credit card, but your Canadian score itself starts fresh.',
  },
  {
    question: 'How long does it take to build credit in Canada?',
    answer: 'A credit file usually appears within about three months of your first card or loan, and most newcomers have a usable score within six months. With on-time payments and low balances, many reach 700 or higher within a year.',
  },
  {
    question: 'What is a secured credit card?',
    answer: 'A secured card requires a refundable security deposit, often around $500, that becomes your credit limit. Because the deposit lowers the lender’s risk, it is easy to qualify for with no Canadian credit history, and it reports to the credit bureaus like a regular card.',
  },
  {
    question: 'What credit score do newcomers start with in Canada?',
    answer: 'You start with no score at all, rather than a low one, because there is no credit file yet. After a few months of using credit responsibly, a score appears (often in the 600s) and grows from there.',
  },
].map((f) => ({ _type: 'faq', _key: key(), ...f }));

const docBase = {
  _id: SLUG,
  _type: 'post',
  title: 'How to Build Credit in Canada as a Newcomer: A Step-by-Step Guide',
  slug: { _type: 'slug', current: SLUG },
  description: 'New to Canada with no credit history? Learn how to build a Canadian credit score from scratch: secured cards, the right habits, and a realistic timeline.',
  seoTitle: 'How to Build Credit in Canada as a Newcomer',
  seoDescription: 'New to Canada with no credit history? Learn how to build a Canadian credit score from scratch: secured cards, the right habits, and a realistic timeline.',
  keyTakeaway: 'Your credit history from abroad does not transfer to Canada, so almost every newcomer starts from zero. The fastest way to build a Canadian credit score is to get a SIN, open a bank account, and use a secured or newcomer credit card responsibly, paying it off in full each month. Most newcomers have a usable score within about six months.',
  publishedAt: PUBLISHED_AT,
  updatedAt: PUBLISHED_AT,
  order: 0,
  faqs,
  body,
};

function summary() {
  console.log(`\nPost: ${docBase.title}`);
  console.log(`  slug:        ${SLUG}`);
  console.log(`  seoTitle:    ${docBase.seoTitle} (${docBase.seoTitle.length} chars)`);
  console.log(`  description: ${docBase.description.length} chars`);
  console.log(`  keyTakeaway: ${docBase.keyTakeaway.trim().split(/\s+/).length} words`);
  console.log(`  body blocks: ${body.length} (incl. ${body.filter((b) => b.style === 'h2').length} H2, 1 table)`);
  console.log(`  faqs:        ${faqs.length}`);
  console.log(`  thumbnail:   ${THUMB}`);
}

async function commit() {
  const token = process.env.SANITY_WRITE_TOKEN;
  if (!token) { console.error('ERROR: set SANITY_WRITE_TOKEN to commit.'); process.exit(1); }
  const client = createClient({ projectId: 'j4gu2dbr', dataset: 'production', apiVersion: '2024-01-01', token, useCdn: false });

  console.log('Uploading thumbnail...');
  const asset = await client.assets.upload('image', readFileSync(THUMB), {
    filename: 'build-credit-canada-newcomer.png',
  });
  console.log(`  asset: ${asset._id}`);

  const doc = {
    ...docBase,
    thumbnail: { _type: 'image', asset: { _type: 'reference', _ref: asset._id } },
  };
  const res = await client.createOrReplace(doc);
  console.log(`\nPublished: ${res._id}`);
  console.log(`Live at: https://unifysocial.ca/blog/${SLUG}`);
}

summary();
if (process.argv.includes('--commit')) {
  await commit();
} else {
  console.log('\nDry run only. Re-run with --commit and SANITY_WRITE_TOKEN to create + publish.');
}
