import { BuildModelInterface, ValidationFunctionReturn } from '@/typings/interface'

const caseFitsPowersupply = (build: BuildModelInterface): ValidationFunctionReturn => {
  const { startingParts = [], newParts = [] } = build

  const computerCase = (
    newParts.find((part: any) => part['Part Type'] === 'Case') ||
    startingParts.find((part: any) => part['Part Type'] === 'Case')
  )

  const powerSupply = (
    newParts.find((part: any) => part['Part Type'] === 'Power Supply') ||
    startingParts.find((part: any) => part['Part Type'] === 'Power Supply')
  )

  if (!computerCase || !powerSupply) return true

  return (
    computerCase[`PSU ${powerSupply.Size}`] ||
    'The power supply will not fit in the case.'
  )
}

export default caseFitsPowersupply
