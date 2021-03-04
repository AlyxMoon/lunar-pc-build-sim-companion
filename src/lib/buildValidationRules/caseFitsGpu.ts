import { BuildModelInterface, ValidationFunctionReturn } from '@/typings'

const caseFitsGpu = (build: BuildModelInterface): ValidationFunctionReturn => {
  const parts = build.parts.filter(part => part.isBeingKept)

  const computerCase = parts.find(part => part.type === 'Case')
  const gpus = parts.filter(part => part.type === 'GPU')

  return (
    (!computerCase || !gpus.length) ||
    gpus.every(part => computerCase.maxLengthGpu >= part.length) ||
    'The GPU does not fit in the case.'
  )
}

export default caseFitsGpu
