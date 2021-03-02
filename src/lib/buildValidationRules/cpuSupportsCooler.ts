import { BuildModelInterface, ValidationFunctionReturn } from '@/typings'

const motherboardFitsCpu = (attributes: BuildModelInterface): ValidationFunctionReturn => {
  const parts = attributes.parts?.filter(part => part.isBeingKept) || []

  const cpu = parts.find(part => part.type === 'CPU')
  const cooler = parts.find(part => part.type === 'CPU Cooler')

  return (
    (!cpu || !cooler) ||
    cooler.supportedCpus.includes(cpu.socket) ||
    'The CPU Cooler will not fit on the current CPU'
  )
}

export default motherboardFitsCpu
