import { reactive } from 'vue'

const reservedAttributes = [
  '_attributes',
  'attributes',
]

class Model {
  _hasErrors = false
  _errors = []

  get attributes () {
    return this._attributes
  }

  get hasErrors () {
    return this._hasErrors
  }

  get errors () {
    return this._errors.slice()
  }

  constructor (attributes = {}) {
    const activeAttributes = this.deepCopy(attributes)

    this.beforeCreate(activeAttributes)
    this.assignAttributes(activeAttributes)
    this.runMutations()
    this.afterCreate()
    this.validate()
  }

  assignAttributes (attributes) {
    this._attributes = reactive({})

    for (const [key, value] of Object.entries(this.defaults())) {
      this.set(key, value)
    }

    for (const [key, value] of Object.entries(attributes)) {
      this.set(key, value)
    }
  }

  registerAttribute (attribute) {
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

  get (attribute, addDisplayFilter = false) {
    const filter = addDisplayFilter && this.displayFilters()[attribute]
    const val = this._attributes[attribute]

    return filter ? filter(val, this) : val
  }

  set (attribute, value) {
    const field = this.runSingleFieldAlias(attribute)

    const toKeep = this.keepAttributes()
    if (toKeep.length && !toKeep.includes(field)) return

    if (!(field in this._attributes)) {
      this.registerAttribute(field)
    }

    this._attributes[field] = this.deepCopy(value)
  }

  validate () {
    this._errors = []

    this.validations().forEach(fn => {
      const result = fn(this.attributes)

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

  deepCopy (value) {
    let newVal

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

  clone () {
    return new this.constructor(this.attributes)
  }

  runSingleFieldAlias (attribute = '') {
    const aliases = this.fieldAliases()

    return attribute in aliases
      ? aliases[attribute]
      : attribute
  }

  runFieldAliases (attributes = {}) {
    const aliases = this.fieldAliases()

    for (const [oldName, newName] of Object.entries(aliases)) {
      if (oldName in attributes) {
        attributes[newName] = attributes[oldName]
        delete attributes[oldName]
      }
    }

    return attributes
  }

  runMutations () {
    for (const [field, func] of Object.entries(this.mutations())) {
      if (field in this.attributes) {
        this.set(field, func(this.get(field)))
      }
    }
  }

  // Intended to be overwritten
  defaults () { return {} }
  fieldAliases () { return {} }
  keepAttributes () { return [] }
  mutations () { return {} }
  validations () { return [] }
  beforeCreate () {}
  afterCreate () {}
  displayFilters () { return {} }
}

export default Model
