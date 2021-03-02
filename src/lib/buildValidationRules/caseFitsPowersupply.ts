import { BuildModelInterface, ValidationFunctionReturn } from '@/typings'

const caseFitsPowersupply = (build: BuildModelInterface): ValidationFunctionReturn => {
  const parts = build.parts?.filter(part => part.isBeingKept) || []

  const computerCase = parts.find(part => part.type === 'Case')
  const powerSupply = parts.find(part => part.type === 'Power Supply')

  return (
    (!computerCase || !powerSupply) ||
    computerCase.supportedPowersupplies.includes(powerSupply.sizeType) ||
    'The power supply will not fit in the case.'
  )
}

export default caseFitsPowersupply
