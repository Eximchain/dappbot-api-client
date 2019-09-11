import { ViewDapp } from '@eximchain/dappbot-types/spec/methods/public';
import { APIModuleArgs, ReqFactoryWithArgsAndPath } from '../types';
import RequestBuilder from '../requestBuilder';

/**
 * Collection of all methods available under the `public` resource.
 */
export class PublicAPI {
  constructor({ builder }:APIModuleArgs){
    this.builder = builder;

    // These functions are assigned in the constructor because
    // the builder requires arguments which are provided when
    // the overall class is instantiated.
    this.viewDapp = this.builder.reqFactoryWithArgsAndPath<ViewDapp.Args, ViewDapp.Response>(ViewDapp.Path, ViewDapp.HTTP);
  }
  private builder:RequestBuilder


  /**
   * ReqFactory: Get the `Item.Core` repesentation of any Dapp,
   * sufficient information required to render within `DappHub`.
   */
  public viewDapp: ReqFactoryWithArgsAndPath<ViewDapp.Args, ViewDapp.Response>
}

export default PublicAPI;