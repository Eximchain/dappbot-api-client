import { ViewDapp } from '@eximchain/dappbot-types/spec/methods/public';
import { APIModuleArgs } from '../types';
import RequestBuilder from '../requestBuilder';

/**
 * Collection of all methods available under the `public` resource.
 */
export class PublicAPI {
  constructor({ builder }:APIModuleArgs){
    this.builder = builder;
  }
  private builder:RequestBuilder


  /**
   * ReqFactory: Get the `Item.Core` repesentation of any Dapp,
   * sufficient information required to render within `DappHub`.
   */
  view = this.builder.reqFactoryWithArgsAndPath<ViewDapp.Args, ViewDapp.Response>(ViewDapp.Path, ViewDapp.HTTP);
}

export default PublicAPI;