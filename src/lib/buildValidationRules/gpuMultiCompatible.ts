import { BuildModelInterface, Parts, ValidationFunctionReturn } from '@/typings'

const gpuMultiCompatible = (build: BuildModelInterface): ValidationFunctionReturn => {
  const gpus = build.parts.filter(part => {
    return part.isBeingKept && part.type === 'GPU'
  }) as Parts.GpuInterface[]

  if (gpus.length < 2) return true

  const [multi1, multi2] = [gpus[0].multi, gpus[1].multi]

  if (!multi1 || !multi2) return 'One or both of the GPUs do not support multi-gpu'
  if (multi1 !== multi2) return 'The GPUs are incompatible (SLI vs CrossFire)'

  return true
}

export default gpuMultiCompatible
