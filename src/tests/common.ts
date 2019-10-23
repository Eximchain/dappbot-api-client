import fs from 'fs';
import User from '@eximchain/dappbot-types/spec/user';
import DappbotAPI from '../';
export const TEST_API = 'https://staging.dapp.bot';

export function testCreds(){
  return JSON.parse(fs.readFileSync('../../test-creds.json').toString())
}

export function configuredAPI() {
  let authData = User.newAuthData();
  let setAuthData = (newAuth:User.AuthData) => authData = newAuth;
  const API = new DappbotAPI({ authData, setAuthData, dappbotUrl: TEST_API })
  return { authData, setAuthData, API }
}