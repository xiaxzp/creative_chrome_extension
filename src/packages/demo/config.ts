import type { Config } from '@/types/config';
import { MATCH_URLS } from '@/const/url';
export default {
  defaultOn: true,
  matches: MATCH_URLS,
  showInCenter: true,
  name: 'Demo',
} as Config;
