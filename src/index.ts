import User from '@eximchain/dappbot-types/spec/user';
import { AuthSetter } from "./types";
import request from 'request-promise-native';
import { AuthAPI, PaymentAPI, PrivateAPI, PublicAPI } from './api';
import RequestBuilder from './requestBuilder';

import {
  APIConfig, APIModuleArgs
} from './types';

/**
 * Overall DappBot API client class.  Must be instantiated
 * with constructor in order to configure the base URL
 * and authentication info.
 * 
 * The user of the client is expected to maintain their own
 * storage for the `authData`, and to provide a setter.
 */
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

  readonly dappbotUrl:string
  readonly authData:User.AuthData
  private setAuthData:AuthSetter
  private builder:RequestBuilder


  /**
   * API submodule containing all `auth` methods.
   */
  auth:AuthAPI

  /**
   * API submodule containing all `payment` methods.
   */
  payment:PaymentAPI

  /**
   * API submodule containing all `private` methods.
   */
  private:PrivateAPI

  /**
   * API submodule containing all `public` methods.
   */
  public:PublicAPI

  /**
   * Checks the ExpiresAt field to see if the Authorization
   * needs to be updated, and then performs the update 
   * if necessary.  Returns a new API object if the user
   * was updated, returns self if nothing changed, throws
   * an error if something goes wrong in the process.
   */
  async refreshAuth(){
    if (this.hasNoAuth()){
      console.error("Please log in.");
    }

    if (this.hasStaleAuth()){
      return await this.loginViaRefresh();
    }

    return this;
  }

  /**
   * Convenience method which refreshes the full user 
   * object, updating each parameter except for RefreshToken, 
   * which remains constant for the life of the session.
   */
  async loginViaRefresh(){
    const { authData, setAuthData, dappbotUrl } = this;
    if (this.hasNoAuth()) {
      console.error("Please log in.");
      return this;
    }
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
      setAuthData(User.newAuthData());
      console.error("Unable to refresh your session, please log in again.");
    }
  }

  /**
   * Helper to check the API's authData: only
   * `true` if the authData is both non-null
   * and not stale.
   */
  hasActiveAuth():boolean {
    return User.authStatus(this.authData).isActive;
  }

  /**
   * Helper to check the API's authData: only
   * `true` if we have non-null authData whose
   * `ExpiresAt` value says that it is stale.
   */
  hasStaleAuth():boolean {
    return User.authStatus(this.authData).isStale;
    if (this.hasNoAuth()) return false;
    let expiryDate = Date.parse(this.authData.ExpiresAt);
    return expiryDate !== NaN && Date.now() > expiryDate;
  }

  /**
   * Helper to check the API's authData: only
   * `true` if the authData has null values,
   * meaning that a fresh login is required.
   */
  hasNoAuth():boolean {
    return User.authStatus(this.authData).isEmpty;
  }
}


export default API;