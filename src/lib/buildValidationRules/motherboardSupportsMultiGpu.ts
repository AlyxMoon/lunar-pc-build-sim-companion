
import { BuildModelInterface, Parts, ValidationFunctionReturn } from '@/typings'

const motherboardSupportsMultiGpu = (build: BuildModelInterface): ValidationFunctionReturn => {
  const parts = build.parts.filter(part => part.isBeingKept)

  const motherboard = parts.find(part => {
    return part.type === 'Motherboard'
  }) as Parts.MotherboardInterface | undefined

  const gpus = parts.filter(part => part.type === 'GPU') as Parts.GpuInterface[]

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
