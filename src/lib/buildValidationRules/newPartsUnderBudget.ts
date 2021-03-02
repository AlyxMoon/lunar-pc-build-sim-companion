import { BuildModelInterface, ValidationFunctionReturn } from '@/typings'

const newPartsUnderBudget = (build: BuildModelInterface): ValidationFunctionReturn => {
  if (!build.budget) return true

  const sumOfNewParts = build.parts?.reduce((sum: number, part) => {
    if (!part.isNewPart || part.isPartOfCase) return sum

    const partPrice = part.isNewUsedPart
      ? Math.floor((part.Price || part.price) * 1.25 / 3)
      : (part.Price || part.price)

    return sum + partPrice
  }, 0) || 0

  return (
    build.budget >= sumOfNewParts ||
    'You are over budget.'
  )
}

export default newPartsUnderBudget
