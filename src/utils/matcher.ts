export function matchUrlInPage(matchUrls?: string[]): boolean {
  return (
    matchUrls?.some((glob) => {
      try {
        const hostname = new URL(glob).hostname;
        const pattern = new URLPattern({ hostname });
        return pattern.test(location.href);
      } catch {
        return true;
      }
    }) ?? true
  );
}
