import { BuildModelInterface, ValidationFunctionReturn } from '@/typings/interface'

const psuProvidesEnoughWattage = (attributes: BuildModelInterface): ValidationFunctionReturn => {
  const parts = attributes.parts?.filter(part => part.isBeingKept) || []

  const powerSupply = parts.find(part => part.type === 'Power Supply')
  const poweredParts = parts.filter(part => 'wattage' in part && part.type !== 'Power Supply')

  if (!powerSupply || !poweredParts.length) return true

  return (
    powerSupply.wattage >= poweredParts.reduce((sum, part) => sum + part.wattage, 0) ||
    'The power supply does not provide enough power to handle the included parts.'
  )
}

export default psuProvidesEnoughWattage
