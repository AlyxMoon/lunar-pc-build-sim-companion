import { BuildModelInterface, PlainObject, ValidationFunctionReturn } from '@/typings/interface'

const caseFitsMotherboard = (build: BuildModelInterface): ValidationFunctionReturn => {
  const parts = build.parts?.filter((part: PlainObject) => part.isBeingKept) || []

  const computerCase = parts.find((part: any) => part['Part Type'] === 'Case')

  const motherboard = parts.find((part: any) => part['Part Type'] === 'Motherboard')

  if (!computerCase || !motherboard) return true

  return (
    computerCase[motherboard.Size] ||
    'The motherboard will not fit in the case.'
  )
}

export default caseFitsMotherboard
