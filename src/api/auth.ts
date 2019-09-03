import { 
  Login, NewPassChallenge, Refresh , BeginPassReset, ConfirmPassReset
} from '@eximchain/dappbot-types/spec/methods/auth';
import { APIModuleArgs } from '../types'
import RequestBuilder from '../requestBuilder';

const passwordValidator = require('password-validator');

export class AuthAPI {
  constructor({ builder }:APIModuleArgs){
    this.builder = builder;
  }
  builder:RequestBuilder

  signIn = this.builder.argFactory<Login.Args, Login.Response>(Login.Path, Login.HTTP)
  
  newPassword = this.builder.argFactory<NewPassChallenge.Args, NewPassChallenge.Response>(NewPassChallenge.Path, NewPassChallenge.HTTP);
  
  refresh = this.builder.argFactory<Refresh.Args, Refresh.Response>(Refresh.Path, Refresh.HTTP);
  
  beginPasswordReset =  this.builder.argFactory<BeginPassReset.Args, BeginPassReset.Response>(BeginPassReset.Path, BeginPassReset.HTTP);

  confirmPasswordReset = this.builder.argFactory<ConfirmPassReset.Args, ConfirmPassReset.Response>(ConfirmPassReset.Path, ConfirmPassReset.HTTP);
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