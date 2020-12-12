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

  constructor (attributes = {}, CurrentClass) {
    this.CurrentClass = CurrentClass

    this.assignAttributes(attributes)

    this.validate()

    this.afterCreate()
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

  get (attribute) {
    return this._attributes[attribute]
  }

  set (attribute, value) {
    if (!(attribute in this._attributes)) {
      this.registerAttribute(attribute)
    }

    this._attributes[attribute] = this.deepCopy(value)
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
    return new this.CurrentClass(this._attributes)
  }

  // Intended to be overwritten
  defaults () { return {} }

  validations () { return [] }

  afterCreate () {}
}

export default Model
