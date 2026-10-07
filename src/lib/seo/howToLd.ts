export interface HowToStep {
  name: string;
  text: string;
}

const plain = (html: string) => html.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();

/**
 * schema.org HowTo for a page that already shows these steps, in this order.
 * Google retired the HowTo rich result in 2023, so this earns no special
 * search listing; it is here for other readers of the markup (Bing, AI
 * assistants). Never add steps that are not visible on the page.
 */
export function howToLd(opts: { name: string; description: string; url: string; steps: HowToStep[] }) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: opts.name,
    description: opts.description,
    url: opts.url,
    step: opts.steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: plain(s.name),
      text: plain(s.text),
    })),
  };
}
