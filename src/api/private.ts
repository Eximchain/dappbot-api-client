import User from '@eximchain/dappbot-types/spec/user';
import { MessageResponse } from '@eximchain/dappbot-types/spec/responses';
import { CreateDapp, DeleteDapp, UpdateDapp, ReadDapp, ListDapps } from '@eximchain/dappbot-types/spec/methods/private';
import { RequestFactory, ResourceFactory, AuthSetter, PathBuilder } from '../types';
import omit from 'lodash.omit';

export interface DappNameProperty {
  DappName : string
}

export class PrivateAPI {
  constructor(
    auth:User.AuthData, 
    setAuth:AuthSetter,
    resourceFactory:ResourceFactory, 
    requestFactory:RequestFactory
  ){
    this.auth = auth;
    this.setAuth = setAuth;
    this.resourceFactory = resourceFactory;
    this.requestFactory = requestFactory;
  }
  auth:User.AuthData
  setAuth:AuthSetter
  resourceFactory:ResourceFactory
  requestFactory:RequestFactory

  create() {
    return (args:CreateDapp.Args & DappNameProperty) => {
      return this.resourceFactory<CreateDapp.Args, MessageResponse>(CreateDapp.Path(args.DappName), CreateDapp.HTTP)(omit(args, ['DappName']));
    }
  }
  
  delete() {
    return (dappName:string) => {
      return this.resourceFactory<DeleteDapp.Args, DeleteDapp.Response>(DeleteDapp.Path(dappName), DeleteDapp.HTTP)();
    }
  }
  
  edit() {
    return (args:UpdateDapp.Args & DappNameProperty) => {
      return this.resourceFactory<UpdateDapp.Args, UpdateDapp.Response>(UpdateDapp.Path(args.DappName), UpdateDapp.HTTP)(omit(args, ['DappName']))
    }
  }
  
  list() {
    return this.resourceFactory<ListDapps.Args, ListDapps.Response>(ListDapps.Path, ListDapps.HTTP)
  }
  
  read() {
    return (dappName:string) => {
      return this.resourceFactory<ReadDapp.Args, ReadDapp.Response>(ReadDapp.Path(dappName), ReadDapp.HTTP)()
    }
  }
}

export default PrivateAPI;