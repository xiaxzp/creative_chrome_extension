import type { AccountInfo } from './typings';

export function getCurrentAccountId() {
  return localStorage.getItem('tcm_account_id') || '';
}

export function getLoginInfoKey() {
  return 'loginInfo';
}

export function unionAccountList(localAccountList: AccountInfo[], remoteAccountList: AccountInfo[]) {
  const accountList = localAccountList.filter(item =>
    !remoteAccountList.some(remoteItem => remoteItem.uid === item.uid),
  );
  return accountList.concat(remoteAccountList.map(item => ({
    ...item,
  })));
}
