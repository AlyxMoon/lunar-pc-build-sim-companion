import { BuildModelInterface, ValidationFunctionReturn } from '@/typings/interface'

const memoryIsCompatible = (attributes: BuildModelInterface): ValidationFunctionReturn => {
  const parts = attributes.parts?.filter(part => part.isBeingKept) || []

  const memory = parts.filter(part => part.type === 'Memory')
  if (!memory.length) return true

  return (
    memory.every(mem => (
      mem.manufacturer === memory[0].manufacturer &&
      mem.sizeGb === memory[0].sizeGb &&
      mem.frequency === memory[0].frequency &&
      mem.nameBase === memory[0].nameBase
    )) ||
    'The memory sticks are not compatible (must all match: manufacturer, model, frequency, size)'
  )
}

export default memoryIsCompatible
