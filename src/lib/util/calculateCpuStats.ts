import { PlainObject } from '@/typings/interface'
import { Parts } from '@/typings/interface/parts'

const calculateGpuStats = (part: Parts.Cpu, memCount?: number, memFreq?: number): PlainObject => {
  const output = {
    rank: 0,
    scoreSingle: 0,
    scoreDual: 0,
  }

  output.rank = Math.floor((
    (part.multCoreClock * part.frequency) +
    (part.multMemChannels * part.maxMemChannels) +
    (part.multMemClock * part.mem)
  ) * 100)


  const coreClockMultiplier = part.CoreClockMultiplier as number
  const finalAdjustment = part.FinalAdjustment as number
  const frequency = part.Frequency as number
  const memChannelsMultiplier = part.MemChannelsMultiplier as number
  const memClockMultiplier = part.MemClockMultiplier as number

  const memoryChannels = (memCount || part['Max Memory Channels']) as number
  const memorySpeed = (memFreq || part['Default Memory Speed']) as number

  return Math.floor((
    (coreClockMultiplier * frequency) +
    (memChannelsMultiplier * memoryChannels) +
    (memClockMultiplier * memorySpeed) +
    finalAdjustment
  ) * 298)
}

export default calculateGpuStats
