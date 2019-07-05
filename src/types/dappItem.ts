import { ContractAbi } from 'ethereum-types';
import { DappStates, Tiers } from '.';

interface BaseItem {
  DappName: string
  ContractAddr: string
  Web3URL: string
  GuardianURL: string
}

export interface RawPublicItem extends BaseItem {
  Abi: string
}

export interface PublicItem extends BaseItem {
  Abi: ContractAbi
}

interface BasePrivateItem extends BaseItem {
  OwnerEmail: string
  State: DappStates
  Tier: Tiers
}

export interface RawPrivateItem extends BasePrivateItem {
  Abi: string
  CreationTime: string
  UpdatedAt: string
}

export interface PrivateItem extends BasePrivateItem {
  Abi: ContractAbi
  CreationTime: Date
  UpdatedAt: Date
}