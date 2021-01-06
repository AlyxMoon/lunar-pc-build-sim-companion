import { BuildModelInterface, PlainObject, ValidationFunctionReturn } from '@/typings/interface'

const motherboardFitsCpu = (build: BuildModelInterface): ValidationFunctionReturn => {
  const parts = build.parts?.filter((part: PlainObject) => part.isBeingKept) || []

  const cpu = parts.find((part: PlainObject) => part['Part Type'] === 'CPU')

  const motherboard = parts.find((part: PlainObject) => part['Part Type'] === 'Motherboard')

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
