import { BuildModelInterface, Parts, ValidationFunctionReturn } from '@/typings'

const psuProvidesEnoughWattage = (build: BuildModelInterface): ValidationFunctionReturn => {
  const parts = build.parts.filter(part => part.isBeingKept)

  const powerSupply = parts.find(part => {
    return part.type === 'Power Supply'
  }) as Parts.PowerSupplyInterface | undefined

  const poweredParts = parts.filter(part => {
    return 'wattage' in part && part.type !== 'Power Supply'
  }) as (Parts.CpuInterface | Parts.GpuInterface)[]

  if (!powerSupply || !poweredParts.length) return true

  return (
    powerSupply.wattage >= poweredParts.reduce((sum, part) => sum + part.wattage, 0) ||
    'The power supply does not provide enough power to handle the included parts.'
  )
}

export default psuProvidesEnoughWattage
