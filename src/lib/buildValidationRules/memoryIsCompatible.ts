import { BuildModelInterface, PlainObject, ValidationFunctionReturn } from '@/typings/interface'

const memoryIsCompatible = (
  attributes: BuildModelInterface,
): ValidationFunctionReturn => {
  const parts: PlainObject[] = attributes.parts?.filter(part => part.isBeingKept) || []

  const memory = parts.filter(part => part['Part Type'] === 'Memory')
  if (!memory.length) return true

  return (
    memory.every(mem => (
      mem.Manufacturer === memory[0].Manufacturer &&
      mem['Size (GB)'] === memory[0]['Size (GB)'] &&
      mem.Frequency === memory[0].Frequency &&
      mem['Part Name (Base)'] === memory[0]['Part Name (Base)']
    )) ||
    'The memory sticks are not compatible (must all match: manufacturer, model, frequency, size)'
  )
}

export default memoryIsCompatible
