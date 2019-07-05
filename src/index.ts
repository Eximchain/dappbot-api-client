export * from './types';
import { 
  PrivateApiType, PublicApiType
} from './types';
import { PublicApi, PrivateApi } from './api';

export interface DappBotClient {
  public : PublicApiType
  private : PrivateApiType
}

export interface DappBotClientParameters {
  apiEndpoint: string
}

export function newClient(params:DappBotClientParameters):DappBotClient {
  const apiEndpoint = params.apiEndpoint;
  return {
    public : { ...PublicApi },
    private : { ...PrivateApi }
  }
}

// TODO: Refactor this to just export the DappbotApi class