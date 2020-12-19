
const filterCurrency = (value: any): any => {
  if (
    !(value || value === 0) ||
    !['number', 'string'].includes(typeof value)
  ) return value

  let num = value + ''

  const indexDecimal = num.indexOf('.')
  const valDecimal = indexDecimal !== -1 ? num.slice(indexDecimal + 1) : ''

  if (indexDecimal !== -1) num = num.slice(0, indexDecimal)

  if (num.length > 1) {
    num = num.replace(/^0+/, '')
  }

  const chunks = Math.floor(num.length / 3)
  const firstChunk = num.length % 3

  const parsedChunks = []
  if (firstChunk) parsedChunks.push(num.slice(0, firstChunk))

  for (let i = 0; i < chunks; i++) {
    parsedChunks.push(num.slice(firstChunk + (i * 3), firstChunk + (i * 3) + 3))
  }

  return `$${parsedChunks.join(',')}${valDecimal ? '.' + valDecimal : ''}`
}

export default filterCurrency
