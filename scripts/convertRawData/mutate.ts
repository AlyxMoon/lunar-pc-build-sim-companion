import { Parts } from '@/typings/interface/parts'

import calculateGpuStats from '../../src/lib/util/calculateGpuStats'

type ValueTypes = string | number | boolean | string[] | number[]
type PartType = Record<string, ValueTypes>

/* eslint-disable quote-props, @typescript-eslint/explicit-function-return-type */
type ObjectPartAliasAndMutation = {
  [key: string]: (value: string) => [string, ValueTypes],
}

const propertiesForAllParts: ObjectPartAliasAndMutation = {
  'Part Type': value => ['type', value],
  'Manufacturer': value => ['manufacturer', value],
  'Part Name': value => ['name', value],
  'Full Part Name': value => ['nameFull', value],
  'In Shop': value => ['availableInShop', value === 'Y'],
  'Price': value => ['price', Number(value)],
  'Level': value => ['level', Number(value)],
  'Level %': value => ['levelPercent', Number(value)],
  'Lighting': value => ['lighting', value],
  'Thickness': value => ['thickness', Number(value) || 0],
  'Wattage': value => ['wattage', Number(value)],
  'Length': value => ['length', Number(value)],
}

const fieldsToKeepAndModifyByCategory: Record<string, ObjectPartAliasAndMutation> = {
  casefans: {
    ...propertiesForAllParts,
    'Size': value => ['size', Number(value)],
    'Air Flow': value => ['airFlow', Number(value)],
    'Air Pressure': value => ['airPressure', Number(value)],
  },

  cases: {
    ...propertiesForAllParts,
    'Size': value => ['sizeType', value],
    'Mini-ITX': value => ['Mini-ITX', value === 'Y'],
    'Micro-ATX': value => ['Micro-ITX', value === 'Y'],
    'S-ATX': value => ['S-ATX', value === 'Y'],
    'E-ATX': value => ['E-ATX', value === 'Y'],
    'XL-ATX': value => ['XL-ATX', value === 'Y'],
    'PSU ATX': value => ['PSU ATX', value === 'Y'],
    'PSU SFX': value => ['PSU SFX', value === 'Y'],
    'Max 120mm Radiators': value => ['maxFan120', Number(value)],
    'Max 140mm Radiators': value => ['maxFan140', Number(value)],
    'Max PSU length': value => ['maxLengthPsu', Number(value)],
    'Max GPU length': value => ['maxLengthGpu', Number(value)],
    'Max CPU Fan Height': value => ['maxLengthCpuFan', Number(value)],
    'Is Open Bench': value => ['typeOpenBench', value === 'Y'],
    'Case Fan Type 1 Count': value => ['case1Count', Number(value)],
    'Case Fan Type 1 Model': value => ['case1Model', value],
    'Case Fan Type 1 Decorator': value => ['case1Decorator', value],
    'Case Fan Type 2 Count': value => ['case2Count', Number(value)],
    'Case Fan Type 2 Model': value => ['case2Model', value],
    'Case Fan Type 2 Decorator': value => ['case2Decorator', value],
    'Case Fan Type 3 Count': value => ['case3Count', Number(value)],
    'Case Fan Type 3 Model': value => ['case3Model', value],
    'Case Fan Type 3 Decorator': value => ['case3Decorator', value],
    'Restricted GPU length': value => ['restrictedLengthGpu', Number(value)],
  },

  cpucoolers: {
    ...propertiesForAllParts,
    'No Fan': value => ['hasFan', value !== 'Y'],
    'Air Flow': value => ['airFlow', Number(value)],
    'LGA 2011-V3': value => ['LGA 2011-V3', value === 'Y'],
    'AM4': value => ['AM4', value === 'Y'],
    'LGA 1151 (Skylake)': value => ['LGA 1151 (Skylake)', value === 'Y'],
    'LGA 1151 (Kaby Lake)': value => ['LGA 1151 (Kaby Lake)', value === 'Y'],
    'LGA 1200': value => ['LGA 1200', value === 'Y'],
    'LGA 2066': value => ['LGA 2066', value === 'Y'],
    'TR4': value => ['TR4', value === 'Y'],
    'sTRX4': value => ['sTRX4', value === 'Y'],
    'FM2+': value => ['FM2+', value === 'Y'],
    'Height': value => ['length', Number(value)],
    'Size': value => ['size', Number(value)],
    'Slots': value => ['slots', Number(value)],
    'Thickness': value => ['thickness', Number(value)],
    'Air Pressure': value => ['airPressure', Number(value)],
  },

  cpus: {
    ...propertiesForAllParts,
    'Frequency': value => ['frequency', Number(value)],
    'Cores': value => ['coreCount', Number(value)],
    'Socket': value => ['socket', value],
    'Can Overclock': value => ['canOverclock', value === 'Y'],
    'Multiplier Step': value => ['ocMultStep', Number(value)],
    'Default Memory Speed': value => ['defaultMemSpeed', Number(value)],
    'Max Memory Channels': value => ['maxMemChannels', Number(value)],
    'OC Base Voltage': value => ['baseVolt', Number(value)],
    'OC Base Freq': value => ['baseFreq', Number(value)],
    'CoreClockMultiplier': value => ['multCoreClock', Number(value)],
    'MemChannelsMultiplier': value => ['multMemChannels', Number(value)],
    'MemClockMultiplier': value => ['multMemClock', Number(value)],
    'FinalAdjustment': value => ['multAdjust', Number(value)],
  },

  gpus: {
    ...propertiesForAllParts,
    'VRAM (GB)': value => ['vramGb', Number(value)],
    'GPU Tuner Min Core Freq': value => ['minCoreFreq', Number(value)],
    'Base Core Freq': value => ['baseCoreFreq', Number(value)],
    'OC Base Core Freq': value => ['baseCoreFreqOc', Number(value)],
    'Max Core Freq': value => ['maxCoreFreq', Number(value)],
    'GPU Tuner Min Mem Freq': value => ['minMemFreq', Number(value)],
    'Base Mem Freq': value => ['baseMemFreq', Number(value)],
    'OC Base Mem Freq': value => ['baseMemFreqOc', Number(value)],
    'Max Mem Freq': value => ['maxMemFreq', Number(value)],
    'Multi-GPU': value => ['multi', value],
    'GT1 Single Core Clock Multiplier': value => ['multCoreSingle1', Number(value)],
    'GT1 Single Mem Clock Multiplier': value => ['multMemSingle1', Number(value)],
    'GT1 Single Benchmark Adjustment': value => ['multAdjustSingle1', Number(value)],
    'GT2 Single Core Clock Multiplier': value => ['multCoreSingle2', Number(value)],
    'GT2 Single Mem Clock Multiplier': value => ['multMemSingle2', Number(value)],
    'GT2 Single Benchmark Adjustment': value => ['multAdjustSingle2', Number(value)],
    'GT1 Dual Core Clock Multiplier': value => ['multCoreDual1', Number(value)],
    'GT1 Dual Mem Clock Multiplier': value => ['multMemDual1', Number(value)],
    'GT1 Dual Benchmark Adjustment': value => ['multAdjustDual1', Number(value)],
    'GT2 Dual Core Clock Multiplier': value => ['multCoreDual2', Number(value)],
    'GT2 Dual Mem Clock Multiplier': value => ['multMemDual2', Number(value)],
    'GT2 Dual Benchmark Adjustment': value => ['multAdjustDual2', Number(value)],
  },

  memory: {
    ...propertiesForAllParts,
    'Size (GB)': value => ['sizeGb', Number(value)],
    'Frequency': value => ['frequency', Number(value)],
    'Voltage': value => ['voltage', Number(value)],
    'Part Name (Base)': value => ['nameBase', value],
    'OC Base Voltage': value => ['ocBaseVoltage', Number(value)],
    'OC Base Freq': value => ['ocBaseFrequency', Number(value)],
  },

  motherboards: {
    ...propertiesForAllParts,
    'Chipset': value => ['chipset', value],
    'CPU Socket': value => ['socket', value],
    'Size': value => ['sizeType', value],
    'Max RAM Speed Step': value => ['ramSpeedMax', Number(value)],
    'Support CrossFire': value => ['gpuCrossFire', value === 'Y'],
    'Support SLI': value => ['gpuSLI', value === 'Y'],
    'Can Overclock': value => ['canOverclock', value === 'Y'],
    'M.2 Slots': value => ['storageMaxM2', Number(value)],
    'M.2 Slots Supporting Heatsinks': value => ['storageMaxHeatsinkM2', Number(value)],
    'RAM Slots': value => ['ramMax', Number(value)],
    'SATA Slots Usable': value => ['storageMaxSata', Number(value)],
    'Default RAM Speed': value => ['ramSpeedDefault', Number(value)],
    'RAM Speed Steps': value => ['ramSpeedOptions', value.split(',').map(Number)],
    'Min RAM Speed Step': value => ['ramSpeedMin', Number(value)],
    'Base Clock': value => ['baseClock', Number(value)],
  },

  powersupplies: {
    ...propertiesForAllParts,
    'Type': value => ['modularType', value],
    'Size': value => ['sizeType', value],
  },

  storage: {
    ...propertiesForAllParts,
    'Size (GB)': value => ['sizeGb', Number(value)],
    'Transfer Speed (MB/s)': value => ['transferSpeed', Number(value)],
    'Includes Heatsink': value => ['includesHeatsink', value === 'Y'],
    'Heatsink Thickness': value => ['heatsinkThickness', Number(value)],
  },

  programrequirements: {
    'Name': value => ['name', value],
    'Level': value => ['level', Number(value)],
    'Is Game': value => ['isGame', value === 'Y'],
    'Type': value => ['type', value],
    'Storage (GB)': value => ['storage', Number(value)],
    'RAM (GB)': value => ['memory', Number(value)],
    'CPU score': value => ['cpuScore', Number(value)],
    'GPU score': value => ['gpuScore', Number(value)],
    'VRAM': value => ['gpuVram', Number(value)],
    'Benchmark': value => ['benchmark', Number(value)],
  },
}

/* eslint-enable quote-props, @typescript-eslint/explicit-function-return-type */

export const mutateField = (
  value: any,
  field: string,
  category = '',
): [string, ValueTypes] | undefined => {
  return fieldsToKeepAndModifyByCategory?.[category]?.[field]?.(value)
}

export const mutatePart: Record<string, (part: PartType) => PartType> = {
  cases: part => {
    const newPart = { ...part }

    const supportedMotherboards: string[] = []
    const supportedPowersupplies: string[] = []

    const motherboardSizes = [
      'Mini-ITX',
      'Micro-ATX',
      'S-ATX',
      'E-ATX',
      'XL-ATX',
    ]

    const powersupplySizes = ['ATX', 'SFX']

    motherboardSizes.forEach(size => {
      if (newPart[size]) supportedMotherboards.push(size)
      delete newPart[size]
    })

    powersupplySizes.forEach(size => {
      if (newPart[`PSU ${size}`]) supportedPowersupplies.push(size)
      delete newPart[`PUS ${size}`]
    })

    newPart.supportedMotherboards = supportedMotherboards
    newPart.supportedPowersupplies = supportedPowersupplies

    return newPart
  },

  cpucoolers: part => {
    const newPart = { ...part }

    const cpuTypes = [
      'LGA 2011-V3',
      'AM4',
      'LGA 1151 (Skylake)',
      'LGA 1151 (Kaby Lake)',
      'LGA 1200',
      'LGA 2066',
      'TR4',
      'sTRX4',
      'FM2+',
    ]

    const supportedCpus: string[] = []

    cpuTypes.forEach(size => {
      if (newPart[size]) supportedCpus.push(size)
      delete newPart[size]
    })

    newPart.supportedCpus = supportedCpus

    newPart.typeSecondary = (newPart.type as string).split(' - ')[1]
    newPart.type = (newPart.type as string).split(' - ')[0]

    return newPart
  },

  cpus: part => {
    const newPart = {
      ...part,
    }

    return newPart
  },

  gpus: part => {
    const newPart = {
      ...part,
      ...calculateGpuStats(part as Parts.Gpu),
    }

    newPart.waterCooled = (newPart.type as string).endsWith('Water')
    newPart.type = (newPart.type as string).split(' - ')[0]

    return newPart
  },

  storage: part => {
    const newPart = { ...part }

    newPart.typeSecondary = (newPart.type as string).split(' - ')[1]
    newPart.type = (newPart.type as string).split(' - ')[0]

    return newPart
  },
}
