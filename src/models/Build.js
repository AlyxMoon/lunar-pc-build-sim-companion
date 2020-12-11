import BaseModel from './_BaseModel'

const ensureNewPartsUnderBudget = (build) => {
  const { budget, newParts } = build

  return budget >= newParts.reduce((sum, part) => sum + part.Price, 0)
    ? true
    : 'You are over budget!'
}

class BuildModel extends BaseModel {
  constructor (attributes) {
    super(attributes, BuildModel)
  }

  defaults () {
    return {
      name: 'New Build',
      jobType: '',
      budget: 0,
      objectives: [],
      startingParts: [],
      newParts: [],
    }
  }

  validations () {
    return [
      ensureNewPartsUnderBudget,
    ]
  }
}

export default BuildModel
