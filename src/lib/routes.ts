import type { MainPage } from '../components/Navbar';

export const PAGE_PATHS: Record<MainPage, string> = {
  topic: '/',
  swarm: '/council',
  spawner: '/agents',
  math: '/math',
  markdown: '/report-editor',
  harness: '/harness',
};

export function pageFromLocation(): MainPage {
  const path = window.location.pathname.replace(/\/$/, '') || '/';
  return (Object.entries(PAGE_PATHS).find(([, route]) => route === path)?.[0] as MainPage) || 'topic';
}

export function navigateToPage(page: MainPage, replace = false) {
  const path = PAGE_PATHS[page];
  if (window.location.pathname === path) return;
  window.history[replace ? 'replaceState' : 'pushState']({ page }, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
}
