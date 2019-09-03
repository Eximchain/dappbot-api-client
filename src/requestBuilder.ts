import { Request as FetchRequest, RequestInfo } from 'node-fetch';
import { request as resourceRequest } from 'react-request-hook';
import { AuthData } from '@eximchain/dappbot-types/spec/user';
import Response from '@eximchain/dappbot-types/spec/responses';
import { RootResources } from '@eximchain/dappbot-types/spec/methods';
import { Headers, ReqTypes } from './types';

export interface RequestBuilderConfig {
  dappbotUrl: string
  authData: AuthData
}
export class RequestBuilder {
  constructor({ dappbotUrl, authData }: RequestBuilderConfig) {
    this.authData = authData;
    this.dappbotUrl = dappbotUrl;
  }

  authData: AuthData
  dappbotUrl: string

  /**
   * 
   * @param path 
   * @param method 
   */
  argFactory<Args, Returns>(path:string, method:Response.HttpMethods) {
    return {
      resource : (args:Args) => this.resourceConf<Args, Returns>(path, method, args),
      axios : (args:Args) => this.axiosConf<Args>(path, method, args),
      request : (args:Args) => this.requestConf<Args>(path, method, args),
      fetch : (args:Args) => this.fetchConf<Args>(path, method, args)
    }
  }

  /**
   * 
   * @param path 
   * @param method 
   */
  argAndPathFactory<Args, Returns>(path:(suffix:string)=>string, method:Response.HttpMethods) {
    return {
      resource : (DappName:string, args:Args) => this.resourceConf<Args, Returns>(path(DappName), method, args),
      axios : (DappName:string, args:Args) => this.axiosConf<Args>(path(DappName), method, args),
      request : (DappName:string, args:Args) => this.requestConf<Args>(path(DappName), method, args),
      fetch : (DappName:string, args:Args) => this.fetchConf<Args>(path(DappName), method, args)
    }
  }

  baseConf(path: string, method: Response.HttpMethods): ReqTypes.base {
    return {
      method: method,
      headers: this.buildHeaders(path)
    }
  }

  buildFullPath(path: string) { return `${this.dappbotUrl}/${path}` }

  buildHeaders(path: string) {
    let privateResources = [RootResources.private, RootResources.public];
    function pathIncludes(name: string) { return path.indexOf(name) >= 0 }
    const headers: Headers = {
      'Content-Type': 'application/json'
    }
    if (privateResources.some(pathIncludes) && this.authData) {
      headers.Authorization = this.authData.Authorization;
    }
    return headers;
  }

  axiosConf<Args>(path: string, method: Response.HttpMethods, args: Args): ReqTypes.axios<Args> {
    return Object.assign(
      this.baseConf(path, method),
      {
        data: args,
        url: this.buildFullPath(path)
      }
    );
  }

  /**
   * Instruments `axiosConfig` to return
   * react-request-hook resources, specifically declaring
   * the return value of the resource.  The generic args
   * allow you to specify both the inputs and outputs of the
   * request.
   * @param path 
   * @param method 
   * @param args 
   */
  resourceConf<Args, Returns>(path:string, method:Response.HttpMethods, args:Args) {
    return resourceRequest<Returns>(this.axiosConf(path, method, args))
  }

  requestConf<Args>(path: string, method: Response.HttpMethods, args: Args): ReqTypes.request<Args> {
    return Object.assign(
      this.baseConf(path, method),
      {
        json: args,
        url: path
      }
    );
  }

  fetchConf<Args>(path: string, method: Response.HttpMethods, args: Args): ReqTypes.fetch {
    return new FetchRequest(this.buildFullPath(path), Object.assign(
      this.baseConf(path, method),
      { body: JSON.stringify(args) }
    ));
  }
}

export default RequestBuilder;