// The guide hubs, in the order a newcomer usually needs them. One list for the
// navbar "Guides" menu, the home page grid, and the 404 page, so a new hub is
// added once. (The footer keeps its own longer labels; llms.txt, the smoke test
// and docs/newcomer-coverage-map.md still need the new hub by hand.)
export interface GuideHub {
  href: string;
  /** Card and menu title. */
  title: string;
  /** One short line: what the page answers. */
  desc: string;
}

export const GUIDE_HUBS: GuideHub[] = [
  { href: "/new-to-canada", title: "New to Canada Checklist", desc: "Your first 30 days, in order." },
  { href: "/newcomer-benefits", title: "Benefits for Newcomers", desc: "Payments and free services you can apply for." },
  { href: "/banking", title: "Banking for Newcomers", desc: "Open an account and compare newcomer offers." },
  { href: "/health-card", title: "Health Card by Province", desc: "Waiting periods and how to apply." },
  { href: "/drivers-licence", title: "Driver's Licence by Province", desc: "Which foreign licences exchange without a road test." },
  { href: "/teer", title: "Skilled Jobs (TEER)", desc: "TEER categories and the jobs in each one." },
  { href: "/credentials", title: "Credential Recognition", desc: "Getting licensed in your profession." },
  { href: "/canadian-resume", title: "Canadian Resume Format", desc: "What to include and what to leave out." },
  { href: "/who-is-a-newcomer", title: "Who Is a Newcomer", desc: "How banks, the CRA and IRCC each define it." },
];
