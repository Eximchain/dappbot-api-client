import { Request as FetchRequest, RequestInfo } from 'node-fetch';
import { request as resourceRequest } from 'react-request-hook';
import { AuthData } from '@eximchain/dappbot-types/spec/user';
import Response from '@eximchain/dappbot-types/spec/responses';
import { RootResources } from '@eximchain/dappbot-types/spec/methods';
import { Headers, ReqTypes, ReqFactoryWithArgs, ReqFactoryWithArgsAndPath } from './types';

export interface RequestBuilderConfig {
  dappbotUrl: string
  authData: AuthData
}
export class RequestBuilder {
  constructor({ dappbotUrl, authData }: RequestBuilderConfig) {
    this.authData = authData;
    this.dappbotUrl = dappbotUrl;
  }

  private authData: AuthData
  private dappbotUrl: string

  /**
   * Given the configuraton for an API method which has a fixed path,
   * returns an object containing functions which produce valid
   * req configs for `react-request-hook`, `axios`, `request`, and
   * `fetch`.  
   * 
   * This is used, for example, with the signup request, which does 
   * a POST to /payment/stripe with a JSON arg body. Note that the 
   * generic `Returns` annotation is only leveraged by the
   * `.resource()` function.
   * 
   * @param path A fixed string, as the path does not change per request
   * @param method 
   */
  reqFactoryWithArgs<Args, Returns>(
    path:string, method:Response.HttpMethods
  ):ReqFactoryWithArgs<Args, Returns> {
    return {
      resource : (args:Args) => this.resourceConf<Args, Returns>(path, method, args),
      axios : (args:Args) => this.axiosConf<Args>(path, method, args),
      request : (args:Args) => this.requestConf<Args>(path, method, args),
      fetch : (args:Args) => this.fetchConf<Args>(path, method, args)
    }
  }

  /**
   * Given the configuration for an API method with a variable path,
   * returns an object containing functions which produce valid req
   * configs fro `react-request-hook`, `axios`, `request`, and `fetch`.
   * 
   * This is used, for example, with the create dapp request, which
   * does a POST to /private/{DappName} with a JSON arg body.  Note
   * that the generic `Returns` annotation is only leveraged by the
   * `.resource()` function.
   * 
   * @param path A function which produces the full path given the variable
   * @param method 
   */
  reqFactoryWithArgsAndPath<Args, Returns>(
    path:(suffix:string)=>string, method:Response.HttpMethods
  ):ReqFactoryWithArgsAndPath<Args, Returns> {
    return {
      resource : (DappName:string, args:Args) => this.resourceConf<Args, Returns>(path(DappName), method, args),
      axios : (DappName:string, args:Args) => this.axiosConf<Args>(path(DappName), method, args),
      request : (DappName:string, args:Args) => this.requestConf<Args>(path(DappName), method, args),
      fetch : (DappName:string, args:Args) => this.fetchConf<Args>(path(DappName), method, args)
    }
  }

  /**
   * Produces the `ReqTypes.base` object which contains the common
   * properties shared among all of the request libraries.  Specifically,
   * its output has `method` and `headers` set.
   * @param path 
   * @param method 
   */
  private baseConf(path: string, method: Response.HttpMethods): ReqTypes.base {
    return {
      method: method,
      headers: this.buildHeaders(path)
    }
  }

  /**
   * Given a path string which corresponds to an endpoint (e.g. /auth/login), 
   * produce the fully qualified request path by prefixing it with the 
   * DappBot API url.
   * @param path 
   */
  buildFullPath(path: string) { return `${this.dappbotUrl}/${path}` }

  /**
   * Given a path string, returns an object with required headers to call
   * that path.  Checks if it is a call to the Private or Payment methods, 
   * and adds the `Authorization` argument if so.  The `Content-Type` is 
   * always set.
   * @param path 
   */
  buildHeaders(path: string) {
    let privateResources = [RootResources.private, RootResources.payment];
    function pathIncludes(name: string) { return path.indexOf(name) >= 0 }
    const headers: Headers = {
      'Content-Type': 'application/json'
    }
    if (privateResources.some(pathIncludes) && this.authData) {
      headers.Authorization = this.authData.Authorization;
    }
    return headers;
  }

  /**
   * Given a relative API path, method, and an args value to put into
   * the JSON body, returns a req config object compatible with `axios`.
   * @param path 
   * @param method 
   * @param args 
   */
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

  /**
   * Given a relative API path, method, and an args value to put into
   * the JSON body, returns a req config object compatible with `request`.
   * @param path 
   * @param method 
   * @param args 
   */
  requestConf<Args>(path: string, method: Response.HttpMethods, args: Args): ReqTypes.request<Args> {
    return Object.assign(
      this.baseConf(path, method),
      {
        json: args,
        url: path
      }
    );
  }

  /**
   * Given a relative API path, method, and an args value to put into
   * the JSON body, returns a req config object compatible with `fetch`.
   * @param path 
   * @param method 
   * @param args 
   */
  fetchConf<Args>(path: string, method: Response.HttpMethods, args: Args): ReqTypes.fetch {
    return new FetchRequest(this.buildFullPath(path), Object.assign(
      this.baseConf(path, method),
      { body: JSON.stringify(args) }
    ));
  }
}

export default RequestBuilder;