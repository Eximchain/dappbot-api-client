import { 
  CreateDapp, DeleteDapp, UpdateDapp, ReadDapp, ListDapps 
} from '@eximchain/dappbot-types/spec/methods/private';
import { APIModuleArgs, ReqFactoryWithArgs, ReqFactoryWithArgsAndPath } from '../types';
import RequestBuilder from '../requestBuilder';

/**
 * Collection of all methods available under the `private` resource.
 */
export class PrivateAPI {
  constructor({ builder }:APIModuleArgs){
    this.builder = builder;

    // These functions are assigned in the constructor because
    // the builder requires arguments which are provided when
    // the overall class is instantiated.
    this.createDapp = this.builder.reqFactoryWithArgsAndPath<CreateDapp.Args, CreateDapp.Response>(CreateDapp.Path, CreateDapp.HTTP);
    this.readDapp = this.builder.reqFactoryWithArgsAndPath<ReadDapp.Args, ReadDapp.Response>(ReadDapp.Path, ReadDapp.HTTP)
    this.updateDapp = this.builder.reqFactoryWithArgsAndPath<UpdateDapp.Args, UpdateDapp.Response>(UpdateDapp.Path, UpdateDapp.HTTP);
    this.deleteDapp = this.builder.reqFactoryWithArgsAndPath<DeleteDapp.Args, DeleteDapp.Response>(DeleteDapp.Path, DeleteDapp.HTTP);
    this.listDapps = this.builder.reqFactoryWithArgs<ListDapps.Args, ListDapps.Response>(ListDapps.Path, ListDapps.HTTP);
  }
  private builder:RequestBuilder

  /**
   * ReqFactory: Create a new Dapp.
   */
  public createDapp: ReqFactoryWithArgsAndPath<CreateDapp.Args, CreateDapp.Response>

  /**
   * ReqFactory: Read one of your dapps' in the `Item.Api` format.
   */
  public readDapp: ReqFactoryWithArgsAndPath<ReadDapp.Args, ReadDapp.Response>

  /**
   * ReqFactory: Delete one of your dapps.
   */
  public deleteDapp: ReqFactoryWithArgsAndPath<DeleteDapp.Args, DeleteDapp.Response>

  /**
   * ReqFactory: Update one of your dapps; only the `Item.Core` 
   * attributes other than `DappName` are allowed to be updated,
   * and at least one must be set.
   */
  public updateDapp: ReqFactoryWithArgsAndPath<UpdateDapp.Args, UpdateDapp.Response>

  /**
   * ReqFactory: List all of your dapps.
   */
  public listDapps: ReqFactoryWithArgs<ListDapps.Args, ListDapps.Response>
  
}

export default PrivateAPI;