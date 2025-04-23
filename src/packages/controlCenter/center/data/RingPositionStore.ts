// import { initMessager } from '@/messager';

export interface RingPosition {
  [loc: string]: {
    x: number;
    y: number;
  };
}
// export const RingPositionID = 'ring-position';

// export function initRingPosition() {
//   // 初始化配置
//   const initStats: RingPosition = {
//     x: 0,
//     y: 0,
//   };
//   return initMessager({
//     id: RingPositionID,
//     stats: initStats,
//     namespace: RingPositionID,
//     shouldStore: true,
//     // matcheURLs: MATCH_URLS,
//   });
// }
// const RingPosition = initRingPosition();
// export default RingPosition;

export const RingPositionStoreID = 'ring-position-store';

export async function getRingPosition() {
  const store = await storage.getItem<RingPosition>(`local:${RingPositionStoreID}`);
  return store;
}

export async function saveRingPosition(pos: RingPosition) {
  const nowStore = await getRingPosition();
  await storage.setItem<RingPosition>(`local:${RingPositionStoreID}`, {
    ...nowStore,
    ...pos,
  });
}
