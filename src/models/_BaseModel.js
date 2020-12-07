import { reactive } from 'vue'

const reservedAttributes = [
  '_attributes',
  'attributes',
]

class Model {
  get attributes () {
    return this._attributes
  }

  constructor (attributes = {}, CurrentClass) {
    this.assignAttributes(attributes)

    this.CurrentClass = CurrentClass
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
      set: value => this.set(attribute, value),
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

  deepCopy (value) {
    let newVal

    if (typeof value === 'object') {
      newVal = {}
      for (const [key, val] of Object.entries(value)) {
        newVal[key] = this.deepCopy(val)
      }
    } else if (Array.isArray(value)) {
      newVal = value.map(val => this.deepCopy(val))
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
}

export default Model
