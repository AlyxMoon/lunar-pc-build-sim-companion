import { BuildModelInterface, ValidationFunctionReturn } from '@/typings'

const caseFitsCpuCooler = (build: BuildModelInterface): ValidationFunctionReturn => {
  const parts = build.parts.filter(part => part.isBeingKept)

  const computerCase = parts.find(part => part.type === 'Case')
  const cooler = parts.find(part => part.type === 'CPU Cooler')

  return (
    (!computerCase || !cooler) ||
    computerCase.maxLengthCpuFan >= cooler.length ||
    'The CPU Cooler does not fit in the case.'
  )
}

export default caseFitsCpuCooler
