import { BuildModelInterface, ValidationFunctionReturn } from '@/typings'

const caseFitsCpuCooler = (attributes: BuildModelInterface): ValidationFunctionReturn => {
  const parts = attributes.parts?.filter(part => part.isBeingKept) || []

  const computerCase = parts.find(part => part.type === 'Case')
  const cooler = parts.find(part => part.type === 'CPU Cooler')

  return (
    (!computerCase || !cooler) ||
    computerCase.maxLengthCpuFan >= cooler.size ||
    'The CPU Cooler does not fit in the case.'
  )
}

export default caseFitsCpuCooler
