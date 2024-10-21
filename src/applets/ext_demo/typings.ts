export type AccountInfoCredential = {
  content: string
  valid: boolean
};

export interface AccountInfo {
  uid: string
  account: string
  password: string
  name?: string
  country: string
  tags?: string[]
  comment?: string
  updatedAt?: string
}

export enum EventKey {
  updateAccount = 'update-account',
  delAccount = 'del-account',
  login = 'login',
  logout = 'logout',
}

export interface LoginInfo {
  account: string
  password: string
}
