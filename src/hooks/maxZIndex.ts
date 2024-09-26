const zIndexMap = new Map<string | symbol, number>();

export const ZIndexKeys = {
  GlassCard: Symbol('glass-card'),
};

export default function useMaxZIndex(key: string | symbol, initialZIndex = 0) {
  let index: number;

  if (zIndexMap.has(key)) {
    index = zIndexMap.get(key)! + 1;
  }
  else {
    index = initialZIndex;
  }

  zIndexMap.set(key, index);
  return index;
}
