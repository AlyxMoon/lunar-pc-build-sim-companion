import { BuildModelInterface, PlainObject, ValidationFunctionReturn } from '@/typings/interface'

const motherboardFitsCpu = (attributes: BuildModelInterface): ValidationFunctionReturn => {
  const parts: PlainObject[] = attributes.parts?.filter(part => part.isBeingKept) || []

  const cpu = parts.find(part => part['Part Type'] === 'CPU')
  const cooler = parts.find(part => part['Part Type'].startsWith('CPU Cooler'))

  if (!cpu || !cooler) return true
  return (
    cooler[cpu.Socket] ||
    'The CPU Cooler will not fit on the current CPU'
  )
}

export default motherboardFitsCpu
