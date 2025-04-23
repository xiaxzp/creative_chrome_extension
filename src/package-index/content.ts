
import type { scriptFunction } from '@/types/config';
import controlCenter from '@/packages/controlCenter/content.ts';
import demo from '@/packages/demo/content.ts';
export default {
  controlCenter,
demo
} as Record<string, scriptFunction>;
    