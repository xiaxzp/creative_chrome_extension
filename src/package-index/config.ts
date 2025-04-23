
import type { Config } from '@/types/config';
import controlCenter from '@/packages/controlCenter/config.ts';
import demo from '@/packages/demo/config.ts';
import demo2 from '@/packages/demo2/config.ts';
export default {
  controlCenter,
demo,
demo2
} as Record<string, Config>;
    