import { 
  Login, NewPassChallenge, Refresh , BeginPassReset, ConfirmPassReset
} from '@eximchain/dappbot-types/spec/methods/auth';
import { User, Response } from '@eximchain/dappbot-types';
import { AuthSetter } from '../types';
import { 
  RequestFactory, ResourceFactory, PathBuilder
} from '../types'

const passwordValidator = require('password-validator');

export class AuthAPI {
  constructor(
    user:User.AuthData, 
    setUser:AuthSetter, 
    resourceFactory:ResourceFactory, 
    requestFactory:RequestFactory
  ){
    this.user = user;
    this.setUser = setUser;
    this.requestFactory = requestFactory;
    this.resourceFactory = resourceFactory;
  }
  user:User.AuthData
  setUser:AuthSetter
  resourceFactory:ResourceFactory
  requestFactory:RequestFactory

  signIn(){
    return this.resourceFactory<Login.Args, Login.Response>(Login.Path, Login.HTTP)
  }
  
  newPassword(){
    return this.resourceFactory<NewPassChallenge.Args, NewPassChallenge.Response>(NewPassChallenge.Path, NewPassChallenge.HTTP);
  }
  
  refresh(){
    return (args:Refresh.Args) => {
      // This function is a *requestFactory* because we just want the config object,
      // doing our request directly.  
      let refreshRequest = this.requestFactory<Refresh.Args>(Refresh.Path, Refresh.HTTP)(args);

      // @ts-ignore The `.data` field is copied to `.json`, because
      // that's where `request` expects to find it. Don't tell
      // Typescript though, it'll get angry.
      refreshRequest.json = refreshRequest.data;
      return refreshRequest
    }
  }
  
  beginPasswordReset() {
    return this.resourceFactory<BeginPassReset.Args, BeginPassReset.Response>(BeginPassReset.Path, BeginPassReset.HTTP);
  }
  
  confirmPasswordReset() {
    return this.resourceFactory<ConfirmPassReset.Args, ConfirmPassReset.Response>(ConfirmPassReset.Path, ConfirmPassReset.HTTP);
  }
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