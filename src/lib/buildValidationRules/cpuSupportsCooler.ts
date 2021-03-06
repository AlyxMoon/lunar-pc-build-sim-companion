import { BuildModelInterface, Parts, ValidationFunctionReturn } from '@/typings'

const cpuSupportsCooler = (build: BuildModelInterface): ValidationFunctionReturn => {
  const parts = build.parts.filter(part => part.isBeingKept)

  const cpu = parts.find(part => part.type === 'CPU') as Parts.CpuInterface | undefined
  const cooler = parts.find(part => part.type === 'CPU Cooler') as Parts.CpuCoolerInterface | undefined

  return (
    (!cpu || !cooler) ||
    cooler.supportedCpus.includes(cpu.socket) ||
    'The CPU Cooler will not fit on the current CPU'
  )
}

export default cpuSupportsCooler
