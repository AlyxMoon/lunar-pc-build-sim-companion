import { BuildModelInterface, ValidationFunctionReturn } from '@/typings/interface'

const caseFitsGpu = (attributes: BuildModelInterface): ValidationFunctionReturn => {
  const parts = attributes.parts?.filter(part => part.isBeingKept) || []

  const computerCase = parts.find(part => part.type === 'Case')
  const gpus = parts.filter(part => part.type === 'GPU')

  return (
    (!computerCase || !gpus.length) ||
    gpus.every(part => {
      return computerCase.maxLengthGpu >= part.length
    }) || 'The GPU does not fit in the case.'
  )
}

export default caseFitsGpu
