import { BuildModelInterface, ValidationFunctionReturn } from '@/typings/interface'

const newPartsUnderBudget = (build: BuildModelInterface): ValidationFunctionReturn => {
  if (!build.budget) return true

  const sumOfNewParts = build.parts?.reduce((sum: number, part) => {
    if (!part.isNewPart) return sum

    const partPrice = part.isNewUsedPart
      ? Math.floor(part.Price * 1.25 / 3)
      : part.Price

    return sum + partPrice
  }, 0) || 0

  return (
    build.budget >= sumOfNewParts ||
    'You are over budget.'
  )
}

export default newPartsUnderBudget
