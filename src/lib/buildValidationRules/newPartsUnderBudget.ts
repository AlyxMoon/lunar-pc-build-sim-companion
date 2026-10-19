import { BuildModelInterface, ValidationFunctionReturn } from '@/typings'
import partCost from '@/lib/partCost'

const newPartsUnderBudget = (build: BuildModelInterface): ValidationFunctionReturn => {
  if (!build.budget) return true

  const sumOfNewParts = build.parts.reduce((sum: number, part) => sum + partCost(part), 0) || 0

  return (
    build.budget >= sumOfNewParts ||
    'You are over budget.'
  )
}

export default newPartsUnderBudget
