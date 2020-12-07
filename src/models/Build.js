import BaseModel from './_BaseModel'

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
}

export default BuildModel
