import { BuildModelInterface, PlainObject, ValidationFunctionReturn } from '@/typings/interface'

const caseFitsPowersupply = (build: BuildModelInterface): ValidationFunctionReturn => {
  const parts = build.parts?.filter((part: PlainObject) => part.isBeingKept) || []

  const computerCase = parts.find((part: any) => part['Part Type'] === 'Case')

  const powerSupply = parts.find((part: any) => part['Part Type'] === 'Power Supply')

  if (!computerCase || !powerSupply) return true

  return (
    computerCase[`PSU ${powerSupply.Size}`] ||
    'The power supply will not fit in the case.'
  )
}

export default caseFitsPowersupply
