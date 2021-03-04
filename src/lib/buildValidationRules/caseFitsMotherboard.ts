import { BuildModelInterface, Parts, ValidationFunctionReturn } from '@/typings'

const caseFitsMotherboard = (build: BuildModelInterface): ValidationFunctionReturn => {
  const parts = build.parts.filter(part => part.isBeingKept)

  const computerCase = parts.find(part => part.type === 'Case') as Parts.CaseInterface | undefined
  const motherboard = parts.find(part => part.type === 'Motherboard') as Parts.MotherboardInterface | undefined

  return (
    (!computerCase || !motherboard) ||
    computerCase.supportedMotherboards.includes(motherboard.sizeType) ||
    'The motherboard will not fit in the case.'
  )
}

export default caseFitsMotherboard
