
import {
  existsSync,
  mkdir,
  readFile,
  writeFile,
} from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { promisify } from 'util'

import mutate from './mutate'
import ModelProgramRequirements from '../../src/models/ProgramRequirements'

const __dirname = dirname(fileURLToPath(import.meta.url))

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
  ['program-requirements', ModelProgramRequirements],
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
      if (category) {
        formatted[headers[col]] = mutate(row[col], headers[col], category)
      } else {
        formatted[headers[col]] = row[col]
      }
    }

    return formatted
  })
}

const main = async () => {
  const dataDirectory = join(__dirname, '../../src/assets/data')
  const finalDirectory = join(dataDirectory, 'parts')

  if (!existsSync(dataDirectory)) {
    await promisify(mkdir)(dataDirectory)
  }
  if (!existsSync(finalDirectory)) {
    await promisify(mkdir)(finalDirectory)
  }

  for (const category of partCategories) {
    const rawFilePath = join(__dirname, 'data', category + '.csv')
    const formattedFilePath = join(finalDirectory, category + '.json')

    const rawData = await promisify(readFile)(rawFilePath, 'utf-8')
    const formattedData = JSON.stringify(convertRawData(rawData, category), null, 2)

    await promisify(writeFile)(formattedFilePath, formattedData, 'utf-8')
  }

  for (const [file, Model] of otherFiles) {
    const rawFilePath = join(__dirname, 'data', file + '.csv')
    const formattedFilePath = join(finalDirectory, '..', file + '.json')

    const rawData = await promisify(readFile)(rawFilePath, 'utf-8')
    const rows = convertRawData(rawData)

    const data = rows.map(row => {
      const model = new Model(row)
      return model.attributes
    })

    await promisify(writeFile)(formattedFilePath, JSON.stringify(data), 'utf-8')
  }
}

main()
