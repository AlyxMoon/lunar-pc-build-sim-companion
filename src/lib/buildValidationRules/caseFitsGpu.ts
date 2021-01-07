import { BuildModelInterface, PlainObject, ValidationFunctionReturn } from '@/typings/interface'

const caseFitsGpu = (attributes: BuildModelInterface): ValidationFunctionReturn => {
  const parts: PlainObject[] = attributes.parts?.filter((part: PlainObject) => part.isBeingKept) || []

  const computerCase = parts.find((part) => part['Part Type'] === 'Case')
  const gpus = parts.filter((part) => ['GPU', 'GPU - Water'].includes(part['Part Type']))

  if (!computerCase || !gpus.length) return true

  return (
    gpus.every((part: PlainObject) => {
      return Number(computerCase['Max GPU length']) >= part.Length
    }) || 'The GPU does not fit in the case.'
  )
}

export default caseFitsGpu
