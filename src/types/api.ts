import { PrivateItem, PublicItem } from './dappItem';

interface ReadData<ItemType> {
  exists : boolean
  item : ItemType
}

interface ListData<ItemType> {
  count : number
  items : ItemType[]
}

interface WriteData {
  message : string
}

interface BaseDappBotResponse {
  data : any
  err : Error | null
}

export interface PublicReadResponse extends BaseDappBotResponse {
  data : ReadData<PublicItem>
}

export interface PrivateReadResponse extends BaseDappBotResponse {
  data : ReadData<PublicItem>
}

export interface PublicListResponse extends BaseDappBotResponse {
  data : ListData<PrivateItem>
}

export interface PrivateReadResponse extends BaseDappBotResponse {
  data : ReadData<PublicItem>
}

export interface PrivateListResponse extends BaseDappBotResponse {
  data : ListData<PrivateItem>
}

export interface WriteResponse extends BaseDappBotResponse {
  data : WriteData
}

export interface PrivateApiType {
  read : (dappname:string) => Promise<PrivateItem>
  list : () => Promise<PrivateItem[]>
  create : () => Promise<WriteResponse>
  update : () => Promise<WriteResponse>
  remove : () => Promise<WriteResponse>
}

export interface PublicApiType {
  read : (dappname:string) => Promise<PublicItem>
}