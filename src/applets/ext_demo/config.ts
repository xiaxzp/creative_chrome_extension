import type { AccountInfo, LoginInfo } from './typings';
import { ACCOUNT_EXTENSION_MATCH_URLS } from '~/const';
import { createConfig } from '~/create/createConfig';

export type Context = {
  accountList: AccountInfo[]
  loginInfo: LoginInfo
};

export const CLIENT_ACCOUNTS_APPLET_KEY = 'ext_demo';

// find type AppletConfig in create/interface
export default createConfig<Context>({
  key: CLIENT_ACCOUNTS_APPLET_KEY,
  name: 'Demo about accounts',
  icon: 'imgs/switch-account-icon.svg',
  matches: ACCOUNT_EXTENSION_MATCH_URLS,
  context: {
    // storaged value accountList = []
    accountList: {
      storage: true,
      value: [],
    },
    // runtime value loginInfo = {account: '', password: '',}
    loginInfo: {
      account: '',
      password: '',
    },
  },
});
