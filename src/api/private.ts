import { 
  CreateDapp, DeleteDapp, UpdateDapp, ReadDapp, ListDapps 
} from '@eximchain/dappbot-types/spec/methods/private';
import { APIModuleArgs } from '../types';
import RequestBuilder from '../requestBuilder';

/**
 * Collection of all methods available under the `private` resource.
 */
export class PrivateAPI {
  constructor({ builder }:APIModuleArgs){
    this.builder = builder;
  }
  private builder:RequestBuilder

  /**
   * ReqFactory: Create a new Dapp.
   */
  create = this.builder.reqFactoryWithArgsAndPath<CreateDapp.Args, CreateDapp.Response>(CreateDapp.Path, CreateDapp.HTTP);


  /**
   * ReqFactory: Read one of your dapps' in the `Item.Api` format.
   */
  read = this.builder.reqFactoryWithArgsAndPath<ReadDapp.Args, ReadDapp.Response>(ReadDapp.Path, ReadDapp.HTTP)


  /**
   * ReqFactory: Delete one of your dapps.
   */
  delete = this.builder.reqFactoryWithArgsAndPath<DeleteDapp.Args, DeleteDapp.Response>(DeleteDapp.Path, DeleteDapp.HTTP)


  /**
   * ReqFactory: Update one of your dapps; only the `Item.Core` 
   * attributes other than `DappName` are allowed to be updated.
   */
  update = this.builder.reqFactoryWithArgsAndPath<UpdateDapp.Args, UpdateDapp.Response>(UpdateDapp.Path, UpdateDapp.HTTP)
  

  /**
   * ReqFactory: List all of your dapps.
   */
  list = this.builder.reqFactoryWithArgs<ListDapps.Args, ListDapps.Response>(ListDapps.Path, ListDapps.HTTP);
}

export default PrivateAPI;