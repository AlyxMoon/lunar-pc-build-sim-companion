import { BuildModelInterface, ValidationFunctionReturn } from '@/typings/interface'

const caseFitsMotherboard = (build: BuildModelInterface): ValidationFunctionReturn => {
  const { startingParts = [], newParts = [] } = build

  const computerCase = (
    newParts.find((part: any) => part['Part Type'] === 'Case') ||
    startingParts.find((part: any) => part['Part Type'] === 'Case')
  )

  const motherboard = (
    newParts.find((part: any) => part['Part Type'] === 'Motherboard') ||
    startingParts.find((part: any) => part['Part Type'] === 'Motherboard')
  )

  if (!computerCase || !motherboard) return true

  return (
    computerCase[motherboard.Size] ||
    'The motherboard will not fit in the case.'
  )
}

export default caseFitsMotherboard
