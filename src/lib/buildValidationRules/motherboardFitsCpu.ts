import { BuildModelInterface, ValidationFunctionReturn } from '@/typings/interface'

const motherboardFitsCpu = (build: BuildModelInterface): ValidationFunctionReturn => {
  const { startingParts = [], newParts = [] } = build

  const cpu = (
    newParts.find((part: any) => part['Part Type'] === 'CPU') ||
    startingParts.find((part: any) => part['Part Type'] === 'CPU')
  )

  const motherboard = (
    newParts.find((part: any) => part['Part Type'] === 'Motherboard') ||
    startingParts.find((part: any) => part['Part Type'] === 'Motherboard')
  )

  if (!cpu || !motherboard) return true

  const isSkyOrKabyCpu = (
    cpu.Socket.endsWith('(Skylake)') ||
    cpu.Socket.endsWith('(Kaby Lake)')
  )

  const isSkyOrKabyMotherboard = (
    motherboard['CPU Socket'].endsWith('(Skylake)') ||
    motherboard['CPU Socket'].endsWith('(Kaby Lake)')
  )

  return (
    (isSkyOrKabyCpu && isSkyOrKabyMotherboard) ||
    (!isSkyOrKabyCpu && motherboard['CPU Socket'] === cpu.Socket) ||
    'The cpu will not fit in the motherboard.'
  )
}

export default motherboardFitsCpu
