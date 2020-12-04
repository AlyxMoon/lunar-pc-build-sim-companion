const fs = require('fs')
const path = require('path')
const { promisify } = require('util')

const partCategories = [
  'casefans',
  'cases',
  'cpu-coolers',
  'cpus',
  'gpus',
  'memory',
  'motherboards',
  'power-supplies',
  'storage',
]

const convertRawData = raw => {
  const [headers, ...rows] = raw.trim()
    .split('\n')
    .map(line => line.trim().split(','))

  return rows.map(row => {
    const formatted = {}

    for (const col in row) {
      formatted[headers[col]] = row[col]
    }

    return formatted
  })
}

const main = async () => {
  const dataDirectory = path.join(__dirname, '../../src/assets/data')
  const finalDirectory = path.join(dataDirectory, 'parts')

  if (!fs.existsSync(dataDirectory)) {
    await promisify(fs.mkdir)(dataDirectory)
  }
  if (!fs.existsSync(finalDirectory)) {
    await promisify(fs.mkdir)(finalDirectory)
  }

  for (const category of partCategories) {
    const rawFilePath = path.join(__dirname, 'data', category + '.csv')
    const formattedFilePath = path.join(finalDirectory, category + '.json')

    const rawData = await promisify(fs.readFile)(rawFilePath, 'utf-8')
    const formattedData = JSON.stringify(convertRawData(rawData), null, 2)

    await promisify(fs.writeFile)(formattedFilePath, formattedData, 'utf-8')
  }
}

main()
