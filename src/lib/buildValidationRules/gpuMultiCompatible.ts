import { BuildModelInterface, PlainObject, ValidationFunctionReturn } from '@/typings/interface'

const gpuMultiCompatible = (
  attributes: PlainObject,
  build: BuildModelInterface,
): ValidationFunctionReturn => {
  const gpus = build.findPartOfType('GPU')
  if (gpus.length < 2) return true

  const multi1 = gpus[0]['Multi-GPU']
  const multi2 = gpus[1]['Multi-GPU']

  if (!multi1 || !multi2) return 'One or both of the GPUs do not support multi-gpu'
  if (multi1 !== multi2) return 'The GPUs are incompatible (SLI vs CrossFire)'

  return true
}

export default gpuMultiCompatible
