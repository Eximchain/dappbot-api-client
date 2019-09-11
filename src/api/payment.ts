import { 
  SignUp, Read, Cancel, UpdateCard, UpdatePlanCount 
} from '@eximchain/dappbot-types/spec/methods/payment';
import { APIModuleArgs, ReqFactoryWithArgs } from '../types';
import RequestBuilder from '../requestBuilder';

/**
 * Collection of all methods available under the `payment/stripe` resource.
 */
export class PaymentAPI {
  constructor({ builder }:APIModuleArgs){
    this.builder = builder;

    // These functions are assigned in the constructor because
    // the builder requires arguments which are provided when
    // the overall class is instantiated.
    this.signUp = this.builder.reqFactoryWithArgs<SignUp.Args, SignUp.Response>(SignUp.Path, SignUp.HTTP);
    this.readStripe = this.builder.reqFactoryWithArgs<Read.Args, Read.Response>(Read.Path, Read.HTTP);
    this.cancelSubscription = this.builder.reqFactoryWithArgs<Cancel.Args, Cancel.Response>(Cancel.Path, Cancel.HTTP);
    this.updatePlanCounts = this.builder.reqFactoryWithArgs<UpdatePlanCount.Args, UpdatePlanCount.Response>(UpdatePlanCount.Path, UpdatePlanCount.HTTP);
    this.updateCard = this.builder.reqFactoryWithArgs<UpdateCard.Args, UpdateCard.Response>(UpdateCard.Path, UpdateCard.HTTP);
  }

  private builder:RequestBuilder

  /**
   * ReqFactory: Create a new account with DappBot.
   */
  public signUp: ReqFactoryWithArgs<SignUp.Args, SignUp.Response>

  /**
   * ReqFactory: Check your Stripe payment data, including
   * the customer, subscription, and their upcoming invoice.
   * Returns the most recent failed invoice if it exists.
   */
  public readStripe: ReqFactoryWithArgs<Read.Args, Read.Response>

  /**
   * ReqFactory: Cancel your subscription to DappBot, deleting
   * all of your Dapps and stopping all future charges to your
   * card.
   */
  public cancelSubscription: ReqFactoryWithArgs<Cancel.Args, Cancel.Response>

  /**
   * ReqFactory: Update the number of dapp slots you are
   * subscribed for.
   */
  public updatePlanCounts: ReqFactoryWithArgs<UpdatePlanCount.Args, UpdatePlanCount.Response>;

  /**
   * ReqFactory: Update the card associated with your Stripe account.
   */
  public updateCard: ReqFactoryWithArgs<UpdateCard.Args, UpdateCard.Response>
}

export default PaymentAPI;