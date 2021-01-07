import { BuildModelInterface, PlainObject, ValidationFunctionReturn } from '@/typings/interface'

const psuProvidesEnoughWattage = (attributes: BuildModelInterface): ValidationFunctionReturn => {
  const parts: PlainObject[] = attributes.parts?.filter(part => part.isBeingKept) || []

  const powerSupply = parts.find(part => part['Part Type'] === 'Power Supply')
  const poweredParts = parts.filter(part => 'Wattage' in part && part['Part Type'] !== 'Power Supply')

  if (!powerSupply || !poweredParts.length) return true

  return (
    powerSupply.Wattage >= poweredParts.reduce((sum, part) => sum + part.Wattage, 0) ||
    'The power supply does not provide enough power to handle the included parts.'
  )
}

export default psuProvidesEnoughWattage
