const fs = require('fs')
const path = require('path')
const { promisify } = require('util')

const mutate = require('./mutate')

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

const otherFiles = [
  'program-requirements',
]

const splitStringByCommas = (string = '') => {
  // capture all items between commas
  // and account for commas that contain commas in their value
  // these are wrapped with "" so that's what to check for
  const regex = /(".*?"|[^",]+)(?=\s*,|\s*$)/g

  return string.trim()
    .replace(/,/g, ', ')
    .match(regex)
    .map(item => item.trim().replace(/"/g, '').replace(/, +/g, ','))
}

const convertRawData = (raw, category) => {
  const [headers, ...rows] = raw.trim()
    .split('\n')
    .map(splitStringByCommas)

  return rows.map(row => {
    const formatted = {}

    for (const col in row) {
      formatted[headers[col]] = mutate(row[col], headers[col], category)
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
    const formattedData = JSON.stringify(convertRawData(rawData, category), null, 2)

    await promisify(fs.writeFile)(formattedFilePath, formattedData, 'utf-8')
  }

  for (const file of otherFiles) {
    const rawFilePath = path.join(__dirname, 'data', file + '.csv')
    const formattedFilePath = path.join(finalDirectory, '..', file + '.json')

    const rawData = await promisify(fs.readFile)(rawFilePath, 'utf-8')
    const formattedData = JSON.stringify(convertRawData(rawData, file), null, 2)

    await promisify(fs.writeFile)(formattedFilePath, formattedData, 'utf-8')
  }
}

main()
