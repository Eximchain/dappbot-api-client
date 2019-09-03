import { CreateDapp, DeleteDapp, UpdateDapp, ReadDapp, ListDapps } from '@eximchain/dappbot-types/spec/methods/private';
import { APIModuleArgs } from '../types';
import RequestBuilder from '../requestBuilder';

export class PrivateAPI {
  constructor({ builder }:APIModuleArgs){
    this.builder = builder;
  }
  private builder:RequestBuilder

  create = this.builder.argAndPathFactory<CreateDapp.Args, CreateDapp.Response>(CreateDapp.Path, CreateDapp.HTTP);

  read = this.builder.argAndPathFactory<ReadDapp.Args, ReadDapp.Response>(ReadDapp.Path, ReadDapp.HTTP)

  delete = this.builder.argAndPathFactory<DeleteDapp.Args, DeleteDapp.Response>(DeleteDapp.Path, DeleteDapp.HTTP)

  update = this.builder.argAndPathFactory<UpdateDapp.Args, UpdateDapp.Response>(UpdateDapp.Path, UpdateDapp.HTTP)
  
  list = this.builder.argFactory<ListDapps.Args, ListDapps.Response>(ListDapps.Path, ListDapps.HTTP);
}

export default PrivateAPI;