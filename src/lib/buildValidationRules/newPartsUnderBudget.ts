import { BuildModelInterface, PlainObject, ValidationFunctionReturn } from '@/typings/interface'

const newPartsUnderBudget = (build: BuildModelInterface): ValidationFunctionReturn => {
  if (!build.budget) return true

  const sumOfNewParts = build.parts?.reduce((sum: number, part: PlainObject) => {
    return sum + (part.isNewPart ? part.Price : 0)
  }, 0) || 0

  return (
    build.budget >= sumOfNewParts ||
    'You are over budget.'
  )
}

export default newPartsUnderBudget
