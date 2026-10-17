import { PartModelInterface, Parts } from '@/typings'
import BaseModel from './_BaseModel'

class PartModel extends BaseModel implements PartModelInterface {
  [key: string]: any

  declare _attributes: Parts.BaseInterface
  declare name: string
  declare nameFull: string
  declare type: string
  declare moddedPartHEM: boolean
  declare manufacturer: string
  declare level: number
  declare levelPercent: number
  declare price: number
  declare availableInShop: boolean
  declare isBeingKept: boolean
  declare isNewPart: boolean
  declare isNewUsedPart: boolean
  declare isPartOfCase: boolean

  get attributes (): Parts.BaseInterface {
    return this._attributes
  }
}

export default PartModel
