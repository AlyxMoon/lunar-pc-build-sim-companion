
import { BuildModelInterface, PlainObject, ValidationFunctionReturn } from '@/typings/interface'

const motherboardSupportsMultiGpu = (
  attributes: PlainObject,
  build: BuildModelInterface,
): ValidationFunctionReturn => {
  const gpus = build.findPartOfType('GPU')
  const motherboard = build.findPartOfType('Motherboard')

  if (!motherboard || gpus.length < 2) return true

  const multi1 = gpus[0]['Multi-GPU']
  const multi2 = gpus[1]['Multi-GPU']

  if (!multi1 || !multi2 || multi1 !== multi2) return true

  if (multi1 === 'SLI' && !motherboard['Support SLI']) {
    return 'The motherboard does not support SLI multi-GPU'
  }

  if (multi1 === 'CrossFire' && !motherboard['Support CrossFire']) {
    return 'The motherboard does not support CrossFire multi-GPU'
  }

  return true
}

export default motherboardSupportsMultiGpu
