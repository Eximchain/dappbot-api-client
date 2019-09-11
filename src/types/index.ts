import { Resource } from 'react-request-hook';
import User from '@eximchain/dappbot-types/spec/user';
import { HttpMethods } from '@eximchain/dappbot-types/spec/responses';
import { RequestInfo as FetchRequest } from 'node-fetch';
import RequestBuilder from '../requestBuilder';

export interface Headers {
  'Content-Type': string,
  Authorization?:string
}

export namespace ReqTypes {
  export interface base {
    headers: Headers
    method: HttpMethods.ANY
  }

  export interface request<Args=any> extends base {
    json: Args
    url: string
  }

  export interface axios<Args=any> extends base {
    data: Args
    url: string
  }

  export type fetch = FetchRequest;
}

export type AuthSetter = (newUser:User.AuthData) => void

export interface APIConfig {
  dappbotUrl: string
  authData: User.AuthData
  setAuthData: AuthSetter
}

export interface APIModuleArgs {
  builder : RequestBuilder
}

export interface ReqFactoryWithArgs<Args, Returns> {
  resource : (args:Args) => Resource<Returns>
  axios : (args:Args) => ReqTypes.axios<Args>
  request : (args:Args) => ReqTypes.request<Args>
  fetch : (args:Args) => ReqTypes.fetch
}

export interface ReqFactoryWithArgsAndPath<Args, Returns> {
  resource : (DappName:string, args:Args) => Resource<Returns>
  axios : (DappName:string, args:Args) => ReqTypes.axios<Args>
  request : (DappName:string, args:Args) => ReqTypes.request<Args>
  fetch : (DappName:string, args:Args) => ReqTypes.fetch
}