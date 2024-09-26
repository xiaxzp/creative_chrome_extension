import Plausible from '~/tracker';

const { trackEvent, trackPageview } = Plausible({
  domain: 'creative-fe-devtools',
  trackLocalhost: true,
  apiHost: 'http://127.0.0.1:4000',
  apiPath: 'tracker',
});

export function useTracker() {
  return {
    trackEvent,
    trackPageview,
  };
}
