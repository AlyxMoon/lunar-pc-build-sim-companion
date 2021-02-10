/* eslint-disable @typescript-eslint/no-var-requires */

import { PlainObject } from '@/typings/interface'
import { mutateField, mutatePart } from './mutate'

const {
  existsSync,
  mkdir,
  readFile,
  writeFile,
} = require('fs')
const { join } = require('path')
const { promisify } = require('util')

declare const __dirname: string

const partCategories = [
  'casefans',
  'cases',
  'cpucoolers',
  'cpus',
  'gpus',
  'memory',
  'motherboards',
  'powersupplies',
  'storage',
]

const otherCategories = [
  'programrequirements',
]

const splitStringByCommas = (string = ''): string[] => {
  // capture all items between commas
  // and account for commas that contain commas in their value
  // these are wrapped with "" so that's what to check for
  const regex = /(".*?"|[^",]+)(?=\s*,|\s*$)/g

  return (string.trim().replace(/,/g, ', ').match(regex) || [])
    .map(item => item.trim().replace(/"/g, '').replace(/, +/g, ','))
}

const convertRawData = (raw: string, category: string): PlainObject => {
  const [headers, ...rows] = raw.trim()
    .split('\n')
    .map(splitStringByCommas)

  return rows.map(row => {
    const formatted: any = {}

    for (const col in row) {
      if (category) {
        const newFieldAndVal = mutateField(row[col], headers[col], category)
        if (!newFieldAndVal) continue

        formatted[newFieldAndVal[0]] = newFieldAndVal[1]
      } else {
        formatted[headers[col]] = row[col]
      }
    }

    return category in mutatePart ? mutatePart[category](formatted) : formatted
  })
}

const main = async (): Promise<void> => {
  const dataDirectory = join(__dirname, '../../src/assets/data')
  const finalDirectory = join(dataDirectory, 'parts')

  if (!existsSync(dataDirectory)) {
    await promisify(mkdir)(dataDirectory)
  }
  if (!existsSync(finalDirectory)) {
    await promisify(mkdir)(finalDirectory)
  }

  for (const category of partCategories) {
    const rawFilePath = join(__dirname, `data/${category}.csv`)
    const formattedFilePath = join(finalDirectory, category + '.json')

    const rawData = await promisify(readFile)(rawFilePath, 'utf-8')
    const formattedData = JSON.stringify(convertRawData(rawData, category))

    await promisify(writeFile)(formattedFilePath, formattedData, 'utf-8')
  }

  for (const category of otherCategories) {
    const rawFilePath = join(__dirname, `data/${category}.csv`)
    const formattedFilePath = join(finalDirectory, '..', category + '.json')

    const rawData = await promisify(readFile)(rawFilePath, 'utf-8')
    const formattedData = JSON.stringify(convertRawData(rawData, category))

    await promisify(writeFile)(formattedFilePath, formattedData, 'utf-8')
  }
}

main()
