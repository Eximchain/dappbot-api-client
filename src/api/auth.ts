import Auth, {
  Login, NewPassChallenge, Refresh, BeginPassReset, ConfirmPassReset
} from '@eximchain/dappbot-types/spec/methods/auth';
import { APIModuleArgs, ReqFactoryWithArgs } from '../types'
import RequestBuilder from '../requestBuilder';

const passwordValidator = require('password-validator');

/**
 * Collection of all methods available under the `auth` resource.
 */
export class AuthAPI {
  constructor({ builder }: APIModuleArgs) {
    this.builder              = builder;

    // These functions are assigned in the constructor because
    // the builder requires arguments which are provided when
    // the overall class is instantiated.
    this.login                = this.builder.reqFactoryWithArgs<Login.Args, Login.Response>(Login.Path, Login.HTTP)
    this.newPassword          = this.builder.reqFactoryWithArgs<NewPassChallenge.Args, NewPassChallenge.Response>(NewPassChallenge.Path, NewPassChallenge.HTTP);
    this.refresh              = this.builder.reqFactoryWithArgs<Refresh.Args, Refresh.Response>(Refresh.Path, Refresh.HTTP);
    this.beginPasswordReset   = this.builder.reqFactoryWithArgs<BeginPassReset.Args, BeginPassReset.Response>(BeginPassReset.Path, BeginPassReset.HTTP);
    this.confirmPasswordReset = this.builder.reqFactoryWithArgs<ConfirmPassReset.Args, ConfirmPassReset.Response>(ConfirmPassReset.Path, ConfirmPassReset.HTTP);
  }

  private builder: RequestBuilder

  /**
   * ReqFactory: Log into DappBot.
   */
  public login: ReqFactoryWithArgs<Login.Args, Login.Response>

  /**
   * ReqFactory: Set a new password after account creation.
   */
  public newPassword: ReqFactoryWithArgs<NewPassChallenge.Args, NewPassChallenge.Response>
  
  /**
   * ReqFactory: Refresh a user's authentication with DappBot.
   */
  public refresh: ReqFactoryWithArgs<Refresh.Args, Refresh.Response>

  /**
   * ReqFactory: Begin a password reset.
   */
  public beginPasswordReset: ReqFactoryWithArgs<BeginPassReset.Args, BeginPassReset.Response>;

  /**
   * ReqFactory: Confirm a password reset.
   */
  public confirmPasswordReset: ReqFactoryWithArgs<ConfirmPassReset.Args, ConfirmPassReset.Response>;
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