import { CollectionInterface, MutationFunctionMap, PlainObject, StringArray, StringMap, ValidationFunctionArray } from '@/typings'

import { reactive } from 'vue'
import { v4 as uuidv4 } from 'uuid'

import BaseModel from './_BaseModel'

const reservedAttributes = [
  '_attributes',
  'attributes',
]

class BaseCollection implements CollectionInterface {
  models!: BaseModel[]

  constructor (
    models: BaseModel[] = [],
    { ignoreId = false }: { ignoreId?: boolean } = {},
  ) {
    const activeAttributes = this.deepCopy(models)

    if (ignoreId) delete activeAttributes.id

    this.beforeCreate(activeAttributes)
    this.assignAttributes(activeAttributes)
    this.runMutations()
    this.afterCreate()
    this.validate()
  }

  assignAttributes (attributes: any): void {
    this._attributes = reactive({})

    for (const [key, value] of Object.entries(this.defaults())) {
      this.set(key, value)
    }

    for (const [key, value] of Object.entries(attributes)) {
      this.set(key, value)
    }

    if (!('id' in attributes)) {
      this.set('id', uuidv4())
    }
  }

  registerAttribute (attribute: string): void {
    if (reservedAttributes.includes(attribute)) {
      throw new Error(`The attribute name ${attribute} is reserved and cannot be used`)
    }

    Object.defineProperty(this, attribute, {
      get: () => this.get(attribute),
      set: value => {
        this.set(attribute, value)
        this.validate()
      },
    })
  }

  get (attribute: string, addDisplayFilter = false): any {
    const filter: any = (this.displayFilters() as { [key: string]: Function })[attribute]

    const runFilter = addDisplayFilter && !!filter
    const val: any = this._attributes[attribute]

    return runFilter ? filter(val, this) : val
  }

  set (attribute: string, value: any): any {
    const field: string = this.runSingleFieldAlias(attribute)

    const toKeep: string[] = this.keepAttributes() || []
    if (toKeep.length && !toKeep.includes(field)) return

    if (!(field in this._attributes)) {
      this.registerAttribute(field)
    }

    this._attributes[field] = this.deepCopy(value)
    return this._attributes[field]
  }

  validate (): boolean {
    this._errors = []

    const validations: Function[] = this.validations()

    validations.forEach((fn: Function) => {
      const result: any = fn(this.attributes, this)

      if (typeof result === 'boolean') {
        this._hasErrors = this._hasErrors && result
      }

      if (typeof result === 'string') {
        this._hasErrors = false
        this._errors.push(result)
      }

      if (Array.isArray(result)) {
        const [valid, message] = result
        this._hasErrors = this._hasErrors && valid
        if (message) this._errors.push(message)
      }
    })

    return this._hasErrors
  }

  deepCopy (value: any): any {
    let newVal: any

    if (value === null || value === undefined) {
      newVal = null
    } else if (Array.isArray(value)) {
      newVal = value.map(val => this.deepCopy(val))
    } else if (typeof value === 'object') {
      newVal = {}
      for (const [key, val] of Object.entries(value)) {
        newVal[key] = this.deepCopy(val)
      }
    } else {
      newVal = value
    }

    return value
  }

  clone (): this {
    return new (this.constructor as any)(this.attributes, { ignoreId: true })
  }

  runSingleFieldAlias (field = ''): string {
    const aliases: { [key: string]: string } = this.fieldAliases()

    return field in aliases
      ? aliases[field]
      : field
  }

  runFieldAliases (attributes: PlainObject): PlainObject {
    const aliases: { [key: string]: string } = this.fieldAliases()

    for (const [oldName, newName] of Object.entries(aliases)) {
      if (oldName in attributes) {
        attributes[newName] = attributes[oldName]
        delete attributes[oldName]
      }
    }

    return attributes
  }

  runMutations (): void {
    const mutations: [string, Function][] = Object.entries(this.mutations())

    for (const [field, func] of mutations) {
      if (field in this.attributes) {
        this.set(field, func(this.get(field)))
      }
    }
  }

  // Intended to be overwritten
  /* eslint-disable @typescript-eslint/no-unused-vars */
  defaults (): PlainObject { return {} }
  fieldAliases (): StringMap { return {} }
  keepAttributes (): StringArray { return [] }
  mutations (): MutationFunctionMap { return {} }
  validations (): ValidationFunctionArray { return [] }
  beforeCreate (attributes: PlainObject): void {}
  afterCreate (): void {}
  displayFilters (): DisplayFunctionMap { return {} }
  /* eslint-enable @typescript-eslint/no-unused-vars */
}

export default BaseModel
