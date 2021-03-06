import { BuildModelInterface, Parts, ValidationFunctionReturn } from '@/typings'

const memoryIsCompatible = (build: BuildModelInterface): ValidationFunctionReturn => {
  const memory = build.parts.filter(part => {
    return part.isBeingKept && part.type === 'Memory'
  }) as Parts.MemoryInterface[]

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
