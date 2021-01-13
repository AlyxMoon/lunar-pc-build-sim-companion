
const numFields = [
  'Level',
  'Percent Through',
  'Price',
  'Sell Price',
  'Part Ranking Score',
  'Wattage',
  'Air Flow',
  'Size (GB)',
  'VRAM (GB)',
  'Frequency',
  'Height',
  'Length',

  'Cores',
  'CoreClockMultiplier',
  'MemChannelsMultiplier',
  'MemClockMultiplier',
  'FinalAdjustment',
  'OC Base Freq',
  'Max Memory Channels',
  'Default Memory Speed',

  // program requirements
  'Storage (GB)',
  'RAM (GB)',
  'CPU score',
  'GPU score',
  'VRAM',
  'Benchmark',
  'Case Fan Type 1 Count',
  'Case Fan Type 2 Count',
  'Case Fan Type 3 Count',
]

type ValueTypes = string | number | boolean
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
  'Size': value => ['size', Number(value) || 0],
  'Thickness': value => ['thickness', Number(value) || 0],
}

const fieldsToKeepAndModifyByCategory: Record<string, ObjectPartAliasAndMutation> = {
  'casefans': {
    ...propertiesForAllParts,
    'Air Flow': value => ['airFlow', Number(value)],
    'Air Pressure': value => ['airPressure', Number(value)],
  },

  'memory': {
    ...propertiesForAllParts,
    'Size (GB)': value => ['sizeGb', Number(value)],
    'Frequency': value => ['frequency', Number(value)],
    'Voltage': value => ['voltage', Number(value)],
    'Part Name (Base)': value => ['nameBase', value],
    'OC Base Voltage': value => ['ocBaseVoltage', Number(value)],
    'OC Base Freq': value => ['ocBaseFrequency', Number(value)],
  },

  'storage': {
    ...propertiesForAllParts,
    'Size (GB)': value => ['sizeGb', Number(value)],
    'Transfer Speed (MB/s)': value => ['transferSpeed', Number(value)],
    'Includes Heatsink': value => ['includesHeatsink', value === 'Y'],
    'Heatsink Thickness': value => ['heatsinkThickness', Number(value)],
  },
}

/* eslint-enable quote-props, @typescript-eslint/explicit-function-return-type */

const numIfIncludes = [
  'Freq',
  'Score',
  'Multiplier',
  'Adjustment',
]

const categorySizeIsNum = [
  'casefans',
  'cpu-coolers',
]

const fieldsAlwaysBoolean = [
  // all
  'HEM',
  'In Shop',
  'Is DLC',
  'Platform Lock',

  // cases
  'Mini-ITX',
  'Micro-ATX',
  'S-ATX',
  'E-ATX',
  'XL-ATX',
  'PSU ATX',
  'PSU SFX',
  'Use For WC Jobs',
  'Is Open Bench',

  // cpu-coolers
  'No Fan',
  'LGA 2011-V3',
  'AM4',
  'LGA 1151 (Skylake)',
  'LGA 1151 (Kaby Lake)',
  'LGA 1151 (Coffee Lake)',
  'LGA 1200',
  'LGA 2066',
  'TR4',
  'sTRX4',
  'FM2+',

  // cpus/motherboards
  'Can Overclock',

  // motherboards
  'Support CrossFire',
  'Support SLI',

  // power-supplies
  'Includes Heatsink',

  // program requirements
  'Is Game',
]

const isBooleanField = (field = ''): boolean => {
  if (fieldsAlwaysBoolean.includes(field)) return true
  return false
}

export const mutateField = (value: any, field: string, category = ''): [string, ValueTypes] | false => {
  const newFieldAndVal = fieldsToKeepAndModifyByCategory?.[category]?.[field]?.(value)
  if (newFieldAndVal) return newFieldAndVal
  else if (category in fieldsToKeepAndModifyByCategory) return false

  if (numFields.includes(field)) return [field, Number(value)]

  if (field === 'Size') {
    if (categorySizeIsNum.includes(category)) return [field, Number(value || 0)]
    return [field, value]
  }

  if (numIfIncludes.some(inc => field.includes(inc))) {
    return [field, Number(value || 0)]
  }

  if (isBooleanField(field)) {
    return [field, value === 'Y']
  }

  return [field, value]
}

export const mutatePart: Record<string, (part: PartType) => PartType> = {
  storage: part => {
    const newPart = { ...part }

    newPart.typeSecondary = (newPart.type as string).split(' - ')[1]
    newPart.type = (newPart.type as string).split(' - ')[0]

    return newPart
  },
}
