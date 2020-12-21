import { BuildModelInterface, ValidationFunctionReturn } from '@/typings/interface'

const newPartsUnderBudget = (build: BuildModelInterface): ValidationFunctionReturn => {
  const { budget, newParts } = build
  if (!budget) return true

  const sumOfNewParts = (newParts || []).reduce((sum: number, part: any) => sum + part.Price, 0)

  return (
    budget >= sumOfNewParts ||
    'You are over budget.'
  )
}

export default newPartsUnderBudget
