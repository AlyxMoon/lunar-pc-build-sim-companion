import { BuildModelInterface, Parts, ValidationFunctionReturn } from '@/typings'

export const socketsAreCompatible = (cpuSocket: string, motherboardSocket: string): boolean => {
  const isSkyOrKabyCpu = (
    cpuSocket.endsWith('(Skylake)') ||
    cpuSocket.endsWith('(Kaby Lake)')
  )

  const isSkyOrKabyMotherboard = (
    motherboardSocket.endsWith('(Skylake)') ||
    motherboardSocket.endsWith('(Kaby Lake)')
  )

  return (
    (isSkyOrKabyCpu && isSkyOrKabyMotherboard) ||
    (!isSkyOrKabyCpu && motherboardSocket === cpuSocket)
  )
}

const motherboardFitsCpu = (build: BuildModelInterface): ValidationFunctionReturn => {
  const parts = build.parts.filter(part => part.isBeingKept)

  const cpu = parts.find(part => {
    return part.type === 'CPU'
  }) as Parts.CpuInterface | undefined

  const motherboard = parts.find(part => {
    return part.type === 'Motherboard'
  }) as Parts.MotherboardInterface | undefined

  if (!cpu || !motherboard) return true

  return socketsAreCompatible(cpu.socket, motherboard.socket) || 'The cpu will not fit in the motherboard.'
}

export default motherboardFitsCpu
