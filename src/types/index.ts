import { ContractAbi } from 'ethereum-types';

export type Tiers = 'STANDARD' | 'PROFESSIONAL' | 'ENTERPRISE';

export type TerminalStates = 'AVAILABLE' | 'FAILED' | 'DEPOSED';
export type TransientStates = 'CREATING' | 'BUILDING_DAPP' | 'DELETING';
export type DappStates = TerminalStates | TransientStates;


export * from './api';
export * from './dappItem';