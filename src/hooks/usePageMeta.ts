import { useEffect } from 'react';

const BASE = 'https://platanos-del-norte.ai.studio';

export function usePageMeta(title: string, description?: string, path: string = '') {
  useEffect(() => {
    document.title = title;

    let desc = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!desc) {
      desc = document.createElement('meta');
      desc.name = 'description';
      document.head.appendChild(desc);
    }
    if (description) {
      desc.setAttribute('content', description);
    }

    let canon = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canon) {
      canon = document.createElement('link');
      canon.rel = 'canonical';
      document.head.appendChild(canon);
    }
    // cada página apunta a SÍ MISMA con URL absoluta
    const cleanPath = path ? (path.startsWith('/') ? path : `/${path}`) : '';
    canon.setAttribute('href', BASE + cleanPath);

    // Ensure robots is index, follow for public pages
    let robots = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
    if (!robots) {
      robots = document.createElement('meta');
      robots.name = 'robots';
      document.head.appendChild(robots);
    }
    robots.setAttribute('content', 'index, follow');

    // Sync OpenGraph meta tags
    const ogTitle = document.querySelector('meta[property="og:title"]') as HTMLMetaElement | null;
    if (ogTitle) {
      ogTitle.setAttribute('content', title);
    }
    if (description) {
      const ogDesc = document.querySelector('meta[property="og:description"]') as HTMLMetaElement | null;
      if (ogDesc) {
        ogDesc.setAttribute('content', description);
      }
    }
  }, [title, description, path]);
}
