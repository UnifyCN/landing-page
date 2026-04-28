export type PartnerCategory = "Education" | "Financial" | "Community" | "Libraries" | "Nonprofit";

export interface Partner {
  slug: string;
  name: string;
  shortName: string;
  logo: string;
  website: string;
  city: string;
  category: PartnerCategory;
  partnershipDescription: string;
  orgDescription: string;
}

export const partners: Partner[] = [
  {
    slug: "rbc",
    name: "RBC — Royal Bank of Canada",
    shortName: "RBC",
    logo: "/assets/images/partners/rbc_foundation.png",
    website: "https://www.rbc.com",
    city: "Vancouver, BC",
    category: "Financial",
    partnershipDescription:
      "The RBC Foundation provides funding to Unify, helping power the resources, tools, and community support we bring to newcomers across Canada.",
    orgDescription:
      "RBC is a leading Canadian bank dedicated to helping individuals, businesses, and communities thrive through financial support and innovation.",
  },
  {
    slug: "ey",
    name: "EY",
    shortName: "EY",
    logo: "/assets/images/partners/ey.png",
    website: "https://www.ey.com/en_ca",
    city: "Vancouver, BC",
    category: "Financial",
    partnershipDescription:
      "EY supports Unify through their EY Ripples program, providing mentorship across product development, compliance, and broader business strategy to help strengthen and scale the platform.",
    orgDescription:
      "EY is one of the world's leading professional services firms, providing expertise across assurance, consulting, tax, and strategy to help organizations navigate complexity and drive sustainable growth.",
  },
  {
    slug: "global-connect-immigration",
    name: "Global Connect Immigration",
    shortName: "Global Connect",
    logo: "/assets/images/partners/global_connect_immigration.png",
    website: "https://globalconnectmigration.com/",
    city: "Vancouver, BC",
    category: "Nonprofit",
    partnershipDescription:
      "Global Connect Migration partnered with Unify to co-deliver PR Pathways workshops for newcomers and international students, supporting content creation, information refinement, and live facilitation, while providing ongoing guidance to shape Unify's product development.",
    orgDescription:
      "Global Connect Migration is a registered Canadian immigration consulting firm helping newcomers navigate permanent residency pathways, visa processes, and settlement planning with expert, personalized guidance.",
  },
  {
    slug: "ymca-bc",
    name: "YMCA BC",
    shortName: "YMCA BC",
    logo: "/assets/images/partners/ymca_bc.png",
    website: "https://www.gv.ymca.ca",
    city: "British Columbia",
    category: "Community",
    partnershipDescription:
      "Through a partnership with the YMCA, Unify co-hosts employment events and integrates YMCA programs and services into the app, while the YMCA amplifies Unify's reach across their community networks.",
    orgDescription:
      "YMCA BC supports families, children, and seniors in communities across British Columbia. YMCA creates vibrant and healthy communities with a shared sense of social responsibility, where children and families can thrive and experience better health in spirit, mind and body.",
  },
  {
    slug: "sfu",
    name: "Simon Fraser University",
    shortName: "SFU",
    logo: "/assets/images/partners/sfu.png",
    website: "https://www.sfu.ca",
    city: "Burnaby, BC",
    category: "Education",
    partnershipDescription:
      "Simon Fraser University's International Student Services partners with Unify to collaborate on events that support international students transitioning to Canada. SFU also provides funding to advance Unify's mission.",
    orgDescription:
      "One of BC's leading research universities, SFU offers newcomers pathways into higher education, English language programs, and professional development across three campuses.",
  },
  {
    slug: "fraser-international-college",
    name: "Fraser International College",
    shortName: "FIC",
    logo: "/assets/images/partners/fraser_international_college.png",
    website: "https://www.fraseric.ca",
    city: "Burnaby, BC",
    category: "Education",
    partnershipDescription:
      "Fraser International College partners with Unify to host events that support their international student community throughout their transition to Canada.",
    orgDescription:
      "FIC bridges international students into university-level study with pathway programs and robust settlement support to ease the transition into Canadian academic life.",
  },
  {
    slug: "capilano-university",
    name: "Capilano University",
    shortName: "CapU",
    logo: "/assets/images/partners/capilano_university.avif",
    website: "https://www.capilanou.ca",
    city: "North Vancouver, BC",
    category: "Education",
    partnershipDescription:
      "Partnered with SquareOne to host New Roots, an event designed to build financial literacy among newcomers and international students in Canada.",
    orgDescription:
      "Capilano University transforms the lives of learners, employees and communities with experiences and engagement opportunities to actualize their passion and potential. CapU operates across campuses in North Vancouver, Sechelt, and Squamish.",
  },
  {
    slug: "united-way-bc",
    name: "United Way BC",
    shortName: "United Way",
    logo: "/assets/images/partners/united_way_bc.png",
    website: "https://uwbc.ca",
    city: "Vancouver, BC",
    category: "Nonprofit",
    partnershipDescription:
      "Unify collaborated with United Way on beta testing and co-hosted financial literacy workshops to better serve newcomers navigating life in Canada.",
    orgDescription:
      "United Way serves over 5 million British Columbians, delivering resources and support to the people who need it most. Areas of focus include Emergency Response, Children & Youth, Seniors, Poverty, Mental Health, and Food Security. United Way strengthens vital connections to foster a healthy, caring, and inclusive community.",
  },
  {
    slug: "burnaby-neighbourhood-house",
    name: "Burnaby Neighbourhood House",
    shortName: "BNH",
    logo: "/assets/images/partners/burnaby_neighbourhood_house.avif",
    website: "https://burnabynh.ca",
    city: "Burnaby, BC",
    category: "Community",
    partnershipDescription:
      "In collaboration with Burnaby Neighbourhood House, Unify hosts events through their Newcomers Welcome Space and cross-promotes programming to connect newcomers to a wider network of support.",
    orgDescription:
      "Burnaby Neighbourhood House enables people to enhance their lives and strengthen their community. They work with communities to develop innovative programs and services that meet the changing needs of a diverse population. Through childcare programs, tackling family and food security, and providing newcomer support, BNH supports all members of the Burnaby community.",
  },
  {
    slug: "vancouver-public-library",
    name: "Vancouver Public Library",
    shortName: "VPL",
    logo: "/assets/images/partners/vancouver_public_library.png",
    website: "https://www.vpl.ca",
    city: "Vancouver, BC",
    category: "Libraries",
    partnershipDescription:
      "Unify partners with the Vancouver Public Library to host events and workshops across their branches, leveraging their spaces to bring newcomer programming directly into the community.",
    orgDescription:
      "Vancouver Public Library has been dedicated to meeting the lifelong learning, reading and information needs of Vancouver residents for more than 100 years, currently operating 21 branches. VPL provides free places for everyone to discover, create, and share ideas and information.",
  },
  {
    slug: "surrey-libraries",
    name: "Surrey Libraries",
    shortName: "Surrey Libraries",
    logo: "/assets/images/partners/surrey_libraries.png",
    website: "https://www.surreylibraries.ca",
    city: "Surrey, BC",
    category: "Libraries",
    partnershipDescription:
      "Unify partners with the Surrey Public Library to host events and workshops across their branches, leveraging their spaces to bring newcomer programming directly into the community.",
    orgDescription:
      "Surrey Libraries connects people, sparks curiosity, and inspires lifelong learning to enhance the lives of Surrey residents across 10 branches.",
  },
  {
    slug: "burnaby-public-library",
    name: "Burnaby Public Library",
    shortName: "BPL",
    logo: "/assets/images/partners/burnaby_public_library.png",
    website: "https://bpl.bc.ca",
    city: "Burnaby, BC",
    category: "Libraries",
    partnershipDescription:
      "Unify partners with the Burnaby Public Library to host events and workshops across their branches, leveraging their spaces to bring newcomer programming directly into the community.",
    orgDescription:
      "Burnaby Public Library creates inclusive spaces where people can gather, learn and play across 4 branches.",
  },
  {
    slug: "trout-lake-community-centre",
    name: "Trout Lake Community Centre",
    shortName: "Trout Lake CC",
    logo: "/assets/images/partners/trout_lake_community_centre.png",
    website: "https://troutlakecc.com",
    city: "Vancouver, BC",
    category: "Community",
    partnershipDescription:
      "Unify partners with Trout Lake Community Centre to host events and workshops at their venue, bringing newcomer programming directly into the local community.",
    orgDescription:
      "Trout Lake Community Centre offers more than 200 programs for people of all ages.",
  },
  {
    slug: "newcomer-jobs-canada",
    name: "Newcomer Jobs Canada",
    shortName: "Newcomer Jobs",
    logo: "/assets/images/partners/newcomer_jobs_canada.png",
    website: "https://www.newcomersjobscanada.ca/",
    city: "Canada",
    category: "Nonprofit",
    partnershipDescription:
      "Through a cross-promotional partnership, Unify and Newcomer Jobs Canada feature each other's services — ensuring newcomers have access to both the guidance and employment resources they need to build their lives in Canada.",
    orgDescription:
      "Newcomer Jobs Canada is a dedicated job board connecting newcomers to Canada with employment opportunities across the country, making the job search process more accessible for those starting their Canadian journey.",
  },
  {
    slug: "promise-vancouver",
    name: "Promise Vancouver",
    shortName: "Promise",
    logo: "/assets/images/partners/promise_vancouver.png",
    website: "https://promisevancouver.ca",
    city: "Vancouver, BC",
    category: "Community",
    partnershipDescription:
      "In collaboration with United Way, Unify hosted a Budgeting Basics workshop for Promise Vancouver's Future Leaders program participants, delivering practical financial literacy to young newcomers building their futures in Canada.",
    orgDescription:
      "Promise Vancouver offers accessible, year-round programming in Vancouver's Downtown Eastside to families who need it most. At Promise, young people find a place of belonging and purpose: children are making friends and learning self-regulation skills, youth take on deeply meaningful leadership roles, and the whole community benefits, both immediately and in the long run.",
  },
  {
    slug: "big-brothers-big-sisters",
    name: "Big Brothers Big Sisters",
    shortName: "BBBS",
    logo: "/assets/images/partners/big_brothers_big_sisters.avif",
    website: "https://www.bigbrothersvancouver.com",
    city: "Vancouver, BC",
    category: "Community",
    partnershipDescription:
      "Partnered with Big Brothers Big Sisters to collaborate on workshops covering key topics for youth.",
    orgDescription:
      "Big Brothers Big Sisters champions the health and wellbeing of youth by providing life changing mentoring experiences and ensuring children are supported by caring adults.",
  },
  {
    slug: "enactus",
    name: "Enactus",
    shortName: "Enactus",
    logo: "/assets/images/partners/enactus.png",
    website: "https://enactus.ca/",
    city: "Burnaby, BC",
    category: "Nonprofit",
    partnershipDescription:
      "Enactus SFU provides Unify with access to SFU resources and support from the broader Enactus Canada network.",
    orgDescription:
      "Enactus inspires and educates post-secondary students to use innovation and entrepreneurship to solve big problems. By empowering post-secondary students at over 78 campuses across Canada through real-world, experiential learning, Enactus is fostering a community of values-driven changemakers who are using business as a catalyst for good.",
  },
];

export function getPartnerBySlug(slug: string): Partner | undefined {
  return partners.find((p) => p.slug === slug);
}

export const categories: PartnerCategory[] = [
  "Education",
  "Financial",
  "Community",
  "Libraries",
  "Nonprofit",
];
