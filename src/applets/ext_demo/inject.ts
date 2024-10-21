import type { Context } from './config';
import { getLoginInfoKey } from './utils';
import { createInject } from '~/create/createScript';
import { contextStorage } from '~/create/context';

export default createInject<Context>(async (context) => {
  context?.watch(({ context, setContext }) => {
    const { account, password } = context[getLoginInfoKey()];
    alert(`Inject: Select account: ${account}, password: ${password}`);

    const extensionAvailableContext = contextStorage.getAppletsEnablingContext();
    if (!extensionAvailableContext) {
      console.error('unexpected no context');
    }
    setContext((context) => {
      return {
        ...context,
        [getLoginInfoKey()]: {
          ...context[getLoginInfoKey()],
          account: '',
          password: '',
        },
      };
    });
    // 切换账号后关闭账号列表
    extensionAvailableContext.setContext((context) => {
      return {
        ...context,
        client_accounts: {
          ...context.client_accounts,
          enabled: false,
        },
      };
    });
  }, ['loginInfo']);
});
