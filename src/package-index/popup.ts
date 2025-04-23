
import type { jsxFunction } from '@/types/config';
import controlCenter from '@/packages/controlCenter/popup.tsx';
import demo from '@/packages/demo/popup.tsx';
import demo2 from '@/packages/demo2/popup.tsx';
export default {
  controlCenter,
demo,
demo2
} as Record<string, jsxFunction>;
    