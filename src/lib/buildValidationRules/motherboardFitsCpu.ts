import { BuildModelInterface, ValidationFunctionReturn } from '@/typings'

const motherboardFitsCpu = (build: BuildModelInterface): ValidationFunctionReturn => {
  const parts = build.parts?.filter(part => part.isBeingKept) || []

  const cpu = parts.find(part => part.type === 'CPU')
  const motherboard = parts.find(part => part.type === 'Motherboard')

  if (!cpu || !motherboard) return true

  const isSkyOrKabyCpu = (
    cpu.socket.endsWith('(Skylake)') ||
    cpu.socket.endsWith('(Kaby Lake)')
  )

  const isSkyOrKabyMotherboard = (
    motherboard.socket.endsWith('(Skylake)') ||
    motherboard.socket.endsWith('(Kaby Lake)')
  )

  return (
    (isSkyOrKabyCpu && isSkyOrKabyMotherboard) ||
    (!isSkyOrKabyCpu && motherboard.socket === cpu.socket) ||
    'The cpu will not fit in the motherboard.'
  )
}

export default motherboardFitsCpu
