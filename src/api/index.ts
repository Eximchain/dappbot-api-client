import { RootResources } from '@eximchain/dappbot-types/spec/methods';
import User from '@eximchain/dappbot-types/spec/user';
import Response from '@eximchain/dappbot-types/spec/responses';
import { AuthSetter } from "../types";
import { request as resourceRequest } from 'react-request-hook';
import request from 'request-promise-native';
import AuthAPI from './auth';
import PrivateAPI from './private';
import PaymentAPI from './payment';
import {
  Headers, ReqTypes
} from '../types';


export interface APIConfig {
  dappbotUrl: string
  authData: User.AuthData
  setAuthData: AuthSetter
}

export interface RefreshOptions {
  userMustRetry : boolean
}

export class API {
  constructor(args:APIConfig){
    const { authData, setAuthData, dappbotUrl } = args;
    this.dappbotUrl = dappbotUrl;
    this.authData = authData;
    this.setAuthData = setAuthData;
    this.auth = new AuthAPI(authData, setAuthData, this.resourceFactory, this.requestFactory);
    this.private = new PrivateAPI(authData, setAuthData, this.resourceFactory, this.requestFactory);
    this.payment = new PaymentAPI(authData, setAuthData, this.resourceFactory, this.requestFactory);
  }

  dappbotUrl:string
  authData:User.AuthData
  setAuthData:AuthSetter
  auth:AuthAPI
  private:PrivateAPI
  payment:PaymentAPI

  // Instruments the `requestFactory` to specifically return
  // react-request-hook resources, specifically declaring
  // the return value of the resource.  The generic args
  // alow you to specify both the inputs and outputs of the
  // request.
  resourceFactory<Args, Returns>(path:string, method:Response.HttpMethods) {
    return (args:Args) => resourceRequest<Returns>(this.requestFactory(path, method)(args))
  }

  buildFullPath(path:string) { return `${this.dappbotUrl}/${path}`}

  buildHeaders(path:string) {
    let privateResources = [RootResources.private, RootResources.public];
    function pathIncludes(name:string){ return path.indexOf(name) >= 0 }
    const headers:Headers = {
      'Content-Type': 'application/json'
    }
    if (privateResources.some(pathIncludes) && this.authData) {
      headers.Authorization = this.authData.Authorization;
    }
    return headers;
  }

  baseObject(path:string, method:Response.HttpMethods):ReqTypes.base {
    return {
      method : method,
      headers : this.buildHeaders(path)
    }
  }

  axiosObject<Args>(path:string, method:Response.HttpMethods, args:Args):ReqTypes.axios<Args> {
    return Object.assign(
      this.baseObject(path, method), 
      { 
        data : args,
        url : this.buildFullPath(path)
      }
    );
  }

  requestObject<Args>(path:string, method:Response.HttpMethods, args:Args):ReqTypes.request<Args> {
    return Object.assign(
      this.baseObject(path, method), 
      { 
        json : args,
        url : path
      }
    );
  }

  // The <Data> declares a generic type, which represents the request
  // data.  The returned function takes an argument of the same type
  // as <Data>, so calls to `authorizedRequestFactory` simply need to
  // provide a sample `data` in order to get a properly typed request fxn.
  // The objects returned by `requestFactory` can be given to any
  // fetch library. Defining the helpers within this same function so
  // that the fxns are still available when these methods get copied
  // onto child API's `this` values.
  requestFactory<Args>(path:string, method:Response.HttpMethods) {
    return (args:Args) => this.axiosObject<Args>(path, method, args);
  }

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
  async refreshAuthorization(opts:RefreshOptions={userMustRetry : false}){
    const { authData: user } = this;

    if (user.RefreshToken === '' || user.ExpiresAt === ''){
      throw new Error("Please log in.")
    }

    let stillFresh = true;
    // TODO: Write a bespoke fxn for this, as it's the only
    // time op in the whole API
    // stillFresh = moment(user.ExpiresAt).isAfter(moment.now());
    if (stillFresh) {
      return this;
    } else {
      return await this.refreshUser(opts)
    }
  }

  /**
   * Refreshes the full user object, updating each 
   * parameter except for RefreshToken.
   */
  async refreshUser(opts:RefreshOptions={userMustRetry : false}){
    const { authData: user, setAuthData: setUser, dappbotUrl } = this;
    if (!user.RefreshToken) throw new Error("Please log in.");
    const refreshRequest = this.auth.refresh()({
      refreshToken : user.RefreshToken
    });
    try {
      const refreshResult = await request(refreshRequest);
      const RefreshedUser:User.AuthData = refreshResult.data;
      // Use the assign because RefreshedUser doesn't have
      // the RefreshToken on it.
      const NewUser = Object.assign({ RefreshToken : user.RefreshToken }, RefreshedUser);
      setUser(NewUser)
      // Alert.info(opts.userMustRetry ?
      //   'We just refreshed your authorization to our server, please try that again.' :
      //   'We just refreshed your authorization to our server, one moment...');
      return new API({
        authData : NewUser,
        setAuthData: setUser, dappbotUrl
      })
    } catch (err) {
      setUser(User.emptyAuthData());
      throw new Error("Unable to refresh your session, please log in again.");
    }
  }
}


export default API;