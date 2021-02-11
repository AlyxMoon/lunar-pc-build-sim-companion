import { BuildModelInterface, ValidationFunctionReturn } from '@/typings/interface'

const caseFitsMotherboard = (build: BuildModelInterface): ValidationFunctionReturn => {
  const parts = build.parts?.filter(part => part.isBeingKept) || []

  const computerCase = parts.find(part => part.type === 'Case')
  const motherboard = parts.find(part => part.type === 'Motherboard')

  return (
    (!computerCase || !motherboard) ||
    computerCase.supportedMotherboards.includes(motherboard.sizeType) ||
    'The motherboard will not fit in the case.'
  )
}

export default caseFitsMotherboard
