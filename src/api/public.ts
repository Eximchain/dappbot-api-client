import { ViewDapp } from '@eximchain/dappbot-types/spec/methods/public';
import { APIModuleArgs, CallFactory } from '../types';
import RequestBuilder from '../requestBuilder';

export interface DappNameProperty {
  DappName : string
}

export class PublicAPI {
  constructor({ builder }:APIModuleArgs){
    this.builder = builder;
  }
  private builder:RequestBuilder

  view = {
    axios : (DappName:string) => this.builder.axiosConf<ViewDapp.Args>(ViewDapp.Path(DappName), ViewDapp.HTTP, undefined),
    resource : (DappName:string) => this.builder.resourceConf<ViewDapp.Args, ViewDapp.Response>(ViewDapp.Path(DappName), ViewDapp.HTTP, undefined),
    request : (DappName:string) => this.builder.requestConf<ViewDapp.Args>(ViewDapp.Path(DappName), ViewDapp.HTTP, undefined),
    fetch : (DappName:string) => this.builder.fetchConf<ViewDapp.Args>(ViewDapp.Path(DappName), ViewDapp.HTTP, undefined)
  }
}

export default PublicAPI;