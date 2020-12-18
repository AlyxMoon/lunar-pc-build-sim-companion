
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

const isBooleanField = (field: string = '') => {
  if (fieldsAlwaysBoolean.includes(field)) return true
  return false
}

const mutate = (value: any, field: string, category: string = '') => {
  if (numFields.includes(field)) return Number(value)

  if (field === 'Size') {
    if (categorySizeIsNum.includes(category)) return Number(value || 0)
    return value
  }

  if (numIfIncludes.some(inc => field.includes(inc))) {
    return Number(value || 0)
  }

  if (isBooleanField(field)) {
    return value === 'Y'
  }

  return value
}

export default mutate
