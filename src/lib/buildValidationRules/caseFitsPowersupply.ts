import { BuildModelInterface, Parts, ValidationFunctionReturn } from '@/typings'

const caseFitsPowersupply = (build: BuildModelInterface): ValidationFunctionReturn => {
  const parts = build.parts.filter(part => part.isBeingKept)

  const computerCase = parts.find(part => part.type === 'Case') as Parts.CaseInterface | undefined
  const powerSupply = parts.find(part => part.type === 'Power Supply') as Parts.PowerSupplyInterface | undefined

  return (
    (!computerCase || !powerSupply) ||
    computerCase.supportedPowersupplies.includes(powerSupply.sizeType) ||
    'The power supply will not fit in the case.'
  )
}

export default caseFitsPowersupply
