
import { BuildModelInterface, PlainObject, ValidationFunctionReturn } from '@/typings/interface'

const motherboardSupportsMultiGpu = (attributes: BuildModelInterface): ValidationFunctionReturn => {
  const parts = attributes.parts?.filter(part => part.isBeingKept) || []

  const motherboard = parts.find(part => part.type === 'Motherboard')
  const gpus = parts.filter(part => part.type === 'GPU')

  if (!motherboard || gpus.length < 2) return true

  const [multi1, multi2] = [gpus[0].multi, gpus[1].multi]

  if (!multi1 || !multi2 || multi1 !== multi2) return true

  if (
    (multi1 === 'SLI' && !motherboard.gpuSLI) ||
    (multi1 === 'CrossFire' && !motherboard.gpuCrossFire)
  ) {
    return `The motherboard does not support ${multi1} multi-GPU`
  }

  return true
}

export default motherboardSupportsMultiGpu
