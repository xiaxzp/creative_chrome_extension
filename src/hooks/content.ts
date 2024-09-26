import { reactive } from 'vue';
import ALL_APPLET_CONFIGS from '~/create/configs';

export interface ContentMessage {
  key: string
  value: any
  type: string
}

export function useInitContent() {
  const contentMap = reactive(
    ALL_APPLET_CONFIGS.reduce((res, item) => {
      res[item.key] = {
        value: null,
        set: (content) => {
          contentMap[item.key].value = content;
        },
      };
      return res;
    }, {}),
  );

  return contentMap;
}
