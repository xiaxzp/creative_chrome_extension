import { initMessager } from '@/messager';

export interface DemoData {
  something: string;
}
export const DemoDataID = 'DemoDataID';

export function initDemoData() {
  // 初始化配置
  const initStats: DemoData = {
    something: 'something',
  };
  return initMessager({
    id: DemoDataID,
    stats: initStats,
    namespace: DemoDataID,
    shouldStore: true,
    // matcheURLs: MATCH_URLS,
  });
}
const demoData = initDemoData();
export default demoData;
