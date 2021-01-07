import { BuildModelInterface, PlainObject, ValidationFunctionReturn } from '@/typings/interface'

const caseFitsCpuCooler = (attributes: BuildModelInterface): ValidationFunctionReturn => {
  const parts: PlainObject[] = attributes.parts?.filter((part: PlainObject) => part.isBeingKept) || []

  const computerCase = parts.find((part) => part['Part Type'] === 'Case')
  const cooler = parts.find(part => part['Part Type'].startsWith('CPU Cooler'))

  if (!computerCase || !cooler) return true

  return (
    Number(computerCase['Max CPU Fan Height']) >= cooler.Size ||
    'The CPU Cooler does not fit in the case.'
  )
}

export default caseFitsCpuCooler
