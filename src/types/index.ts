import { Resource } from 'react-request-hook';
import User from '@eximchain/dappbot-types/spec/user';
import { RootResources } from '@eximchain/dappbot-types/spec/methods';
import { HttpMethods } from '@eximchain/dappbot-types/spec/responses';
import { Request as FetchRequest } from 'node-fetch';

export type AuthSetter = (newUser:User.AuthData) => void

export interface Headers {
  'Content-Type': string,
  Authorization?:string
}

export namespace ReqTypes {
  export interface base {
    headers: Headers
    method: HttpMethods
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

export type PathBuilder = (suffix:string)=>string

export type RequestFactory = <Args>(path:string, method:HttpMethods) => (args: Args) => ReqTypes.axios
export type ResourceFactory = <Args, Returns>(path:string, method:HttpMethods) => (args: Args) => Resource<Returns>