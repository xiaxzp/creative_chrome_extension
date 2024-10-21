import type { Context } from './config';
import type {
  AccountInfo,
} from './typings';
import {
  EventKey,
} from './typings';
import { getAccountList, updateAccount } from './service';
import {
  getLoginInfoKey,
  unionAccountList,
} from './utils';
import { createBackground } from '~/create/createScript';

export default createBackground<Context>(async (context) => {
  context?.watch(
    ({ setContext }) => {
      getAccountList().then((accountList) => {
        setContext(context => ({
          accountList: unionAccountList(context.accountList, accountList),
        }));
      });
    },
    [],
    true,
  );

  context?.on<AccountInfo>(
    EventKey.updateAccount,
    (accountInfo, { context, setContext }) => {
      if (!context.accountList.some(item => item.uid === accountInfo.uid)) {
        // 添加新账号
        setContext({
          accountList: [accountInfo].concat(context.accountList),
        });
      }
      else {
        const newAccountList = context.accountList.map(item =>
          item.uid === accountInfo.uid ? accountInfo : item,
        );
        setContext({
          accountList: newAccountList,
        });
      }

      updateAccount(accountInfo);
    },
  );

  context?.on<string>(
    EventKey.delAccount,
    (uid, { context, setContext }) => {
      if (context.accountList.some(item => item.uid === uid)) {
        setContext({
          accountList: context.accountList.filter(item => item.uid !== uid),
        });
      }
    },
  );

  context?.on<string>(EventKey.login, (uid, { context, setContext }) => {
    const accountInfo = context.accountList.find(item => item.uid === uid);
    if (!accountInfo) {
      return;
    }

    setContext({
      [getLoginInfoKey()]: {
        account: accountInfo.account,
        password: accountInfo.password,
      },
    });
  });

  context?.on<string>(EventKey.logout, (uid, { context, setContext }) => {
    const accountInfo = context.accountList.find(item => item.uid === uid);
    if (!accountInfo) {
      return;
    }
    setContext({
      [getLoginInfoKey()]: { account: '', password: '' },
    });
  });
});
