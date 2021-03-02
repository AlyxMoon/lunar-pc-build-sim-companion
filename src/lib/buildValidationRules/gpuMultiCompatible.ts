import { BuildModelInterface, ValidationFunctionReturn } from '@/typings'

const gpuMultiCompatible = (attributes: BuildModelInterface): ValidationFunctionReturn => {
  const parts = attributes.parts?.filter(part => part.isBeingKept) || []
  const gpus = parts.filter(part => part.type === 'GPU')

  if (gpus.length < 2) return true

  const multi1 = gpus[0].multi
  const multi2 = gpus[1].multi

  if (!multi1 || !multi2) return 'One or both of the GPUs do not support multi-gpu'
  if (multi1 !== multi2) return 'The GPUs are incompatible (SLI vs CrossFire)'

  return true
}

export default gpuMultiCompatible
