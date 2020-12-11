import BaseModel from './_BaseModel'

const ensureNewPartsUnderBudget = build => {
  const { budget, newParts } = build
  const sumOfNewParts = newParts.reduce((sum, part) => sum + part.Price, 0)

  return (
    budget >= sumOfNewParts ||
    'You are over budget!'
  )
}

const checkPowerSupplyFitsInCase = build => {
  const { startingParts, newParts } = build

  const computerCase = (
    newParts.find(part => part['Part Type'] === 'Case') ||
    startingParts.find(part => part['Part Type'] === 'Case')
  )

  const powerSupply = (
    newParts.find(part => part['Part Type'] === 'Power Supply') ||
    startingParts.find(part => part['Part Type'] === 'Power Supply')
  )

  if (!computerCase || !powerSupply) return true

  return (
    computerCase[`PSU ${powerSupply.Size}`] === 'Y' ||
    'The power supply will not fit in the case.'
  )
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
      checkPowerSupplyFitsInCase,
    ]
  }
}

export default BuildModel
