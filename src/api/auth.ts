import {
  Login, NewPassChallenge, Refresh, BeginPassReset, ConfirmPassReset
} from '@eximchain/dappbot-types/spec/methods/auth';
import { APIModuleArgs } from '../types'
import RequestBuilder from '../requestBuilder';

const passwordValidator = require('password-validator');

/**
 * Collection of all methods available under the `auth` resource.
 */
export class AuthAPI {
  constructor({ builder }: APIModuleArgs) {
    this.builder = builder;
  }
  private builder: RequestBuilder

  /**
   * ReqFactory: Log into DappBot.
   */
  login = this.builder.reqFactoryWithArgs<Login.Args, Login.Response>(Login.Path, Login.HTTP)


  /**
   * ReqFactory: Set a new password after account creation.
   */
  newPassword = this.builder.reqFactoryWithArgs<NewPassChallenge.Args, NewPassChallenge.Response>(NewPassChallenge.Path, NewPassChallenge.HTTP);


  /**
   * ReqFactory: Refresh a user's authentication with DappBot.
   */
  refresh = this.builder.reqFactoryWithArgs<Refresh.Args, Refresh.Response>(Refresh.Path, Refresh.HTTP);


  /**
   * ReqFactory: Begin a password reset.
   */
  beginPasswordReset = this.builder.reqFactoryWithArgs<BeginPassReset.Args, BeginPassReset.Response>(BeginPassReset.Path, BeginPassReset.HTTP);

  
  /**
   * ReqFactory: Confirm a password reset.
   */
  confirmPasswordReset = this.builder.reqFactoryWithArgs<ConfirmPassReset.Args, ConfirmPassReset.Response>(ConfirmPassReset.Path, ConfirmPassReset.HTTP);
}

export const passwordChecker = new passwordValidator();
passwordChecker
  .is().min(8).max(64)
  .has().uppercase()
  .has().lowercase()
  .has().digits()
  .has().symbols()
  .has().not().spaces();

export default AuthAPI;