import { SignUp, Read, Cancel, UpdateCard, UpdatePlanCount } from '@eximchain/dappbot-types/spec/methods/payment';
import { APIModuleArgs } from '../types';
import RequestBuilder from '../requestBuilder';

export class PaymentAPI {
  constructor({ builder }:APIModuleArgs){
    this.builder = builder;
  }
  builder:RequestBuilder

  signUp = this.builder.argFactory<SignUp.Args, SignUp.Response>(SignUp.Path, SignUp.HTTP);

  readStripe = this.builder.argFactory<Read.Args, Read.Response>(Read.Path, Read.HTTP);

  cancelSubscription = this.builder.argFactory<Cancel.Args, Cancel.Response>(Cancel.Path, Cancel.HTTP);

  updatePlanCounts = this.builder.argFactory<UpdatePlanCount.Args, UpdatePlanCount.Response>(UpdatePlanCount.Path, UpdatePlanCount.HTTP);

  updateCard = this.builder.argFactory<UpdateCard.Args, UpdateCard.Response>(UpdateCard.Path, UpdateCard.HTTP);
}

export default PaymentAPI;