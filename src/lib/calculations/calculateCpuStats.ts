import { Parts } from '@/typings'

const calculateCpuStats = (
  cpu: Parts.CpuInterface,
  memFreq = cpu.defaultMemSpeed,
  memCount = cpu.maxMemChannels,
): { rank: number, score: number } => {
  const output = {
    rank: 0,
    score: 0,
  }

  output.rank = Math.floor((
    (cpu.multCoreClock * cpu.frequency) +
    (cpu.multMemChannels * cpu.maxMemChannels) +
    (cpu.multMemClock * cpu.defaultMemSpeed) +
    cpu.multAdjust
  ) * 100)

  output.score = Math.floor((
    (cpu.multCoreClock * cpu.frequency) +
    (cpu.multMemChannels * memCount) +
    (cpu.multMemClock * memFreq) +
    cpu.multAdjust
  ) * 298)

  return output
}

export default calculateCpuStats
