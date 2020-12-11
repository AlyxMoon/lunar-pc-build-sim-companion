import BaseModel from './_BaseModel'

const ensureNewPartsUnderBudget = build => {
  const { budget, newParts } = build
  const sumOfNewParts = newParts.reduce((sum, part) => sum + part.Price, 0)

  return (
    budget >= sumOfNewParts ||
    'You are over budget.'
  )
}

const checkCpuCompatibleWithMotherboard = build => {
  const { startingParts, newParts } = build

  const cpu = (
    newParts.find(part => part['Part Type'] === 'CPU') ||
    startingParts.find(part => part['Part Type'] === 'CPU')
  )

  const motherboard = (
    newParts.find(part => part['Part Type'] === 'Motherboard') ||
    startingParts.find(part => part['Part Type'] === 'Motherboard')
  )

  if (!cpu || !motherboard) return true

  const isSkyOrKabyCpu = (
    cpu.Socket.endsWith('(Skylake)') ||
    cpu.Socket.endsWith('(Kaby Lake)')
  )

  const isSkyOrKabyMotherboard = (
    motherboard['CPU Socket'].endsWith('(Skylake)') ||
    motherboard['CPU Socket'].endsWith('(Kaby Lake)')
  )

  return (
    (isSkyOrKabyCpu && isSkyOrKabyMotherboard) ||
    (!isSkyOrKabyCpu && motherboard['CPU Socket'] === cpu.Socket) ||
    'The cpu will not fit in the motherboard.'
  )
}

const checkMotherboardFitsInCase = build => {
  const { startingParts, newParts } = build

  const computerCase = (
    newParts.find(part => part['Part Type'] === 'Case') ||
    startingParts.find(part => part['Part Type'] === 'Case')
  )

  const motherboard = (
    newParts.find(part => part['Part Type'] === 'Motherboard') ||
    startingParts.find(part => part['Part Type'] === 'Motherboard')
  )

  if (!computerCase || !motherboard) return true

  return (
    computerCase[motherboard.Size] === 'Y' ||
    'The motherboard will not fit in the case.'
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
      checkMotherboardFitsInCase,
      checkPowerSupplyFitsInCase,
      checkCpuCompatibleWithMotherboard,
    ]
  }
}

export default BuildModel
