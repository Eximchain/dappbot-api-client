import User from '@eximchain/dappbot-types/spec/user';
import { AuthSetter } from "./types";
import request from 'request-promise-native';
import { AuthAPI, PaymentAPI, PrivateAPI, PublicAPI } from './api';
import RequestBuilder from './requestBuilder';

import {
  APIConfig, APIModuleArgs
} from './types';

export class API {
  constructor(args:APIConfig){
    this.dappbotUrl = args.dappbotUrl;
    this.authData = args.authData;
    this.setAuthData = args.setAuthData;

    this.builder = new RequestBuilder({
      dappbotUrl : args.dappbotUrl,
      authData : args.authData
    })
    const moduleArgs:APIModuleArgs = {
      builder : this.builder
    }
    this.auth = new AuthAPI(moduleArgs);
    this.payment = new PaymentAPI(moduleArgs);
    this.private = new PrivateAPI(moduleArgs);
    this.public = new PublicAPI(moduleArgs);
  }

  dappbotUrl:string
  authData:User.AuthData
  setAuthData:AuthSetter
  builder:RequestBuilder
  auth:AuthAPI
  payment:PaymentAPI
  private:PrivateAPI
  public:PublicAPI

  /**
   * Checks the ExpiresAt field to see if the Authorization
   * needs to be updated, and then performs the update 
   * if necessary.  Returns a new API object if the user
   * was updated, returns self if nothing changed, throws
   * an error if something goes wrong in the process.
   * 
   * Options arg let the caller request that the refresh
   * alert ask the user to repeat their action, in case
   * it was triggered by a button press.
   */
  async refreshAuthorization(){
    const { authData: user } = this;

    if (user.RefreshToken === '' || user.ExpiresAt === ''){
      throw new Error("Please log in.")
    }

    if (Date.now() < Date.parse(user.ExpiresAt)) {
      return this;
    } else {
      return await this.refreshUser()
    }
  }

  /**
   * Refreshes the full user object, updating each 
   * parameter except for RefreshToken.
   */
  async refreshUser(){
    const { authData, setAuthData, dappbotUrl } = this;
    if (!authData.RefreshToken) throw new Error("Please log in.");
    const refreshRequest = this.auth.refresh.request({
      refreshToken : authData.RefreshToken
    });
    try {
      const refreshResult = await request(refreshRequest);
      const RefreshedUser:User.AuthData = refreshResult.data;
      // Use the assign because RefreshedUser doesn't have
      // the RefreshToken on it.
      const NewUser = Object.assign({ RefreshToken : authData.RefreshToken }, RefreshedUser);
      setAuthData(NewUser)
      return new API({
        authData : NewUser,
        setAuthData, dappbotUrl
      })
    } catch (err) {
      setAuthData(User.emptyAuthData());
      throw new Error("Unable to refresh your session, please log in again.");
    }
  }
}


export default API;