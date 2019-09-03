import { 
  SignUp, Read, Cancel, UpdateCard, UpdatePlanCount 
} from '@eximchain/dappbot-types/spec/methods/payment';
import { APIModuleArgs } from '../types';
import RequestBuilder from '../requestBuilder';

/**
 * Collection of all methods available under the `payment/stripe` resource.
 */
export class PaymentAPI {
  constructor({ builder }:APIModuleArgs){
    this.builder = builder;
  }
  private builder:RequestBuilder

  /**
   * ReqFactory: Create a new account with DappBot.
   */
  signUp = this.builder.reqFactoryWithArgs<SignUp.Args, SignUp.Response>(SignUp.Path, SignUp.HTTP);


  /**
   * ReqFactory: Check your Stripe payment data, including
   * the customer, subscription, and their upcoming invoice.
   * Returns the most recent failed invoice if it exists.
   */
  readStripe = this.builder.reqFactoryWithArgs<Read.Args, Read.Response>(Read.Path, Read.HTTP);


  /**
   * ReqFactory: Cancel your subscription to DappBot, deleting
   * all of your Dapps and stopping all future charges to your
   * card.
   */
  cancelSubscription = this.builder.reqFactoryWithArgs<Cancel.Args, Cancel.Response>(Cancel.Path, Cancel.HTTP);


  /**
   * ReqFactory: Update the number of dapp slots you are
   * subscribed for.
   */
  updatePlanCounts = this.builder.reqFactoryWithArgs<UpdatePlanCount.Args, UpdatePlanCount.Response>(UpdatePlanCount.Path, UpdatePlanCount.HTTP);

  /**
   * ReqFactory: Update the card associated with your Stripe account.
   */
  updateCard = this.builder.reqFactoryWithArgs<UpdateCard.Args, UpdateCard.Response>(UpdateCard.Path, UpdateCard.HTTP);
}

export default PaymentAPI;