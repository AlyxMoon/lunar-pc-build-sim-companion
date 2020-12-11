
const numFields = [
  'Level',
  'Price',
  'Sell Price',
  'Part Ranking Score',
  'Wattage',
  'Air Flow',
  'Size (GB)',
  'VRAM (GB)',
  'Frequency',
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
]

const isBooleanField = (field, category) => {
  if (fieldsAlwaysBoolean.includes(field)) return true
  return false
}

const mutate = (value, field, category) => {
  if (numFields.includes(field)) return Number(value)

  if (field === 'Size') {
    if (categorySizeIsNum.includes(category)) return Number(value || 0)
    return value
  }

  if (isBooleanField(field, category)) {
    return value === 'Y'
  }

  return value
}

module.exports = mutate
