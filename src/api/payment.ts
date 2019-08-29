import User from '@eximchain/dappbot-types/spec/user';
import { SignUp, Read, Cancel, UpdateCard, UpdatePlanCount } from '@eximchain/dappbot-types/spec/methods/payment';
import { AuthSetter, RequestFactory, ResourceFactory, PathBuilder } from '../types';

export class PaymentAPI {
  constructor(
    user: User.AuthData,
    setUser: AuthSetter,
    resourceFactory:ResourceFactory, 
    requestFactory:RequestFactory
  ){
    this.user = user;
    this.setUser = setUser;
    this.requestFactory = requestFactory;
    this.resourceFactory = resourceFactory;
  }

  user:User.AuthData
  setUser:(newUser:User.AuthData) => void
  resourceFactory:ResourceFactory
  requestFactory:RequestFactory


  createUser(){
    return this.resourceFactory<SignUp.Args, SignUp.Response>(SignUp.Path, SignUp.HTTP);
  }

  getUserStripeData(){
    return this.resourceFactory<Read.Args, Read.Response>(Read.Path, Read.HTTP);
  }

  cancelSubscription(){
    return this.resourceFactory<Cancel.Args, Cancel.Response>(Cancel.Path, Cancel.HTTP);
  }

  updatePlanCounts(){
    return this.resourceFactory<UpdatePlanCount.Args, UpdatePlanCount.Response>(UpdatePlanCount.Path, UpdatePlanCount.HTTP);
  }

  updateCard(){
    return this.resourceFactory<UpdateCard.Args, UpdateCard.Response>(UpdateCard.Path, UpdateCard.HTTP);
  }

}

export default PaymentAPI;