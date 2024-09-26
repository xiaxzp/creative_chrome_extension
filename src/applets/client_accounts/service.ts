import type { AccountInfo } from './typings';

const Accounts: AccountInfo[] = [{
  uid: '1',
  account: 'test 1',
  password: 'xxx',
  name: 'name 1',
  country: 'US',
  tags: ['happy'],
  comment: 'comment 1',
  updatedAt: '2024-09-24',
}, {
  uid: '2',
  account: 'test 2',
  password: 'yyy',
  name: 'name 2',
  country: 'CA',
  tags: ['sad'],
  comment: 'comment 2',
  updatedAt: '2024-09-25',
}];
export async function getAccountList(): Promise<AccountInfo[]> {
  // await new Promise((r) => {
  //   setTimeout(() => {
  //     r(1);
  //   }, 1000);
  // });
  return Promise.resolve(Accounts);
}

export async function updateAccount(accountInfo: AccountInfo) {
  const targetIdx = Accounts.findIndex(item => item.uid === accountInfo.uid);
  if (targetIdx > -1) {
    Accounts[targetIdx] = { ...accountInfo };
  }
  else {
    Accounts.push({ ...accountInfo });
  }
}
