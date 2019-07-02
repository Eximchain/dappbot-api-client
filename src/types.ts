import { ContractAbi } from 'ethereum-types';

export type Tiers = 'STANDARD' | 'PROFESSIONAL' | 'ENTERPRISE';

export type TerminalStates = 'AVAILABLE' | 'FAILED' | 'DEPOSED';
export type TransientStates = 'CREATING' | 'BUILDING_DAPP' | 'DELETING';
export type DappStates = TerminalStates | TransientStates;

export interface BaseDappItem {
  DappName: string
  OwnerEmail: string
  Web3URL: string
  GuardianURL: string
  State: DappStates
  Tier: Tiers
}

export interface RawDappItem extends BaseDappItem {
  CreationTime: string
  UpdatedAt: string
  Abi: string
}

export interface DappItem extends BaseDappItem {
  CreationTime: Date
  UpdatedAt: Date
  Abi: ContractAbi
}

export interface BaseDappBotResponse {
  data : any
  err : Error | null
}

export interface ReadResponse extends BaseDappBotResponse {
  data : {
    exists : boolean
    item : RawDappItem
  }
}

export interface ListResponse extends BaseDappBotResponse {
  data : {
    count : number
    items : RawDappItem[]
  }
}

export interface WriteResponse extends BaseDappBotResponse {
  data : {
    message : string
  }
}