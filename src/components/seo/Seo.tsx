import { useEffect } from 'react';

type SeoProps = {
  title: string;
  description?: string;
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogSiteName?: string;
  twitterCard?: 'summary' | 'summary_large_image';
  twitterSite?: string;
  noindex?: boolean;
  jsonLd?: Record<string, any> | Array<Record<string, any>>;
};

function upsertMeta(selector: string, attr: 'name' | 'property', key: string, content: string) {
  let el = document.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

export function Seo({
  title,
  description,
  canonical,
  ogTitle,
  ogDescription,
  ogImage,
  ogSiteName,
  twitterCard = 'summary_large_image',
  twitterSite,
  noindex,
  jsonLd,
}: SeoProps) {
  useEffect(() => {
    if (title) document.title = title;

    if (description) {
      upsertMeta('meta[name="description"]', 'name', 'description', description);
    }

    if (canonical) {
      let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'canonical');
        document.head.appendChild(link);
      }
      link.setAttribute('href', canonical);
    }

    if (noindex) {
      upsertMeta('meta[name="robots"]', 'name', 'robots', 'noindex,nofollow');
    }

    if (ogTitle || title) {
      upsertMeta('meta[property="og:title"]', 'property', 'og:title', ogTitle || title);
    }
    if (ogDescription || description) {
      upsertMeta(
        'meta[property="og:description"]',
        'property',
        'og:description',
        ogDescription || description || ''
      );
    }
    if (ogImage) {
      upsertMeta('meta[property="og:image"]', 'property', 'og:image', ogImage);
    }
    if (ogSiteName) {
      upsertMeta('meta[property="og:site_name"]', 'property', 'og:site_name', ogSiteName);
    }
    if (twitterCard) {
      upsertMeta('meta[name="twitter:card"]', 'name', 'twitter:card', twitterCard);
    }
    if (twitterSite) {
      upsertMeta('meta[name="twitter:site"]', 'name', 'twitter:site', twitterSite);
    }

    if (jsonLd) {
      // Remove existing structured data we manage to avoid duplicates
      document.querySelectorAll('script[data-managed="jsonld"]').forEach((el) => el.remove());
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-managed', 'jsonld');
      script.text = JSON.stringify(jsonLd);
      document.head.appendChild(script);
    }
  }, [
    title,
    description,
    canonical,
    ogTitle,
    ogDescription,
    ogImage,
    ogSiteName,
    twitterCard,
    twitterSite,
    noindex,
    jsonLd,
  ]);

  return null;
}
