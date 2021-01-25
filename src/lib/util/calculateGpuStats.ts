import { PlainObject } from '@/typings/interface'
import { Parts } from '@/typings/interface/parts'

const calculateGpuStats = (part: Parts.Gpu): PlainObject => {
  const output = {
    rank: 0,
    scoreSingle: 0,
    scoreDual: 0,
  }

  output.rank = Math.floor(
    100 * (
      (part.multCoreSingle1 * part.baseCoreFreq) +
      (part.multMemSingle1 * part.baseMemFreq) +
      part.multAdjustSingle1
    ),
  )

  output.scoreSingle = Math.floor(164 / (
    0.5 / (
      (part.multCoreSingle1 * part.baseCoreFreq) +
      (part.multMemSingle1 * part.baseMemFreq) +
      part.multAdjustSingle1
    ) +
    0.5 / (
      (part.multCoreSingle2 * part.baseCoreFreq) +
      (part.multMemSingle2 * part.baseMemFreq) +
      part.multAdjustSingle2
    )
  ))

  output.scoreDual = part.multi ? Math.floor(164 / (
    0.5 / (
      (part.multCoreDual1 * part.baseCoreFreq) +
      (part.multMemDual1 * part.baseMemFreq) +
      part.multAdjustDual1
    ) +
    0.5 / (
      (part.multCoreDual2 * part.baseCoreFreq) +
      (part.multMemDual2 * part.baseMemFreq) +
      part.multAdjustDual2
    )
  )) : 0

  return output
}

export default calculateGpuStats
