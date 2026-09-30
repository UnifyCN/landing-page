// Selected from DESKTOP-only GSC Web clicks, 2026-09-01..2026-09-28.
// Selection and published Sanity route verification: docs/desktop-search-ctas.md.
export interface SearchCta {
  title: string;
  description: string;
  label: string;
  destination: string;
  topic: 'pr-pathways' | 'canadian-taxes' | 'bc-healthcare';
}

const prPathways = '/learn/9717e260-bdeb-4ee4-8d39-4159a48eb627/3d5abe49-8616-48f8-a857-b80317ddeb35';
const taxes = '/learn/4c79ebb5-b03a-47aa-862e-6d0853eba7d4/b7988f8b-6105-4a26-ade1-6df5864f8ee6';
const healthcare = '/learn/1f43061d-0062-4ea5-bd82-6b25e8ee5a55/9882f55c-6191-4c4f-85f3-8cf4e1873355';

const teer3: SearchCta = {
  title: 'Explore the PR pathways behind TEER 3 work',
  description: 'Continue with Unify’s Pathways at a Glance lessons, including skilled worker and provincial pathways.',
  label: 'Explore PR pathways on the web',
  destination: prPathways,
  topic: 'pr-pathways',
};

const ctas: Record<string, SearchCta> = {
  '/teer': {
    title: 'Put your TEER research in context',
    description: 'Explore skilled worker, provincial and other PR pathways in Unify’s Pathways at a Glance lessons.',
    label: 'Explore PR pathways on the web',
    destination: prPathways,
    topic: 'pr-pathways',
  },
  '/teer/teer-3': teer3,
  '/blog/the-easiest-skilled-jobs-to-transition-into-teer-3-for-pr-purposes-in-canada': teer3,
  '/blog/how-is-foreign-income-taxed-in-canada': {
    title: 'Get comfortable with filing taxes in Canada',
    description: 'Build on this guide with Unify’s Understanding Taxes in Canada lessons, including filing your return.',
    label: 'Explore Canadian tax lessons on the web',
    destination: taxes,
    topic: 'canadian-taxes',
  },
  '/blog/how-to-find-a-family-doctor-in-bc-as-a-newcomer': {
    title: 'Learn how to get care in BC',
    description: 'Explore types of care and when to use them in Unify’s Getting Care in BC’s Healthcare System lessons.',
    label: 'Explore BC healthcare lessons on the web',
    destination: healthcare,
    topic: 'bc-healthcare',
  },
};

export function searchCtaForPath(path: string): SearchCta | undefined {
  return Object.hasOwn(ctas, path) ? ctas[path] : undefined;
}
