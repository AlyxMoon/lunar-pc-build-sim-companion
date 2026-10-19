import { readFileSync } from 'node:fs'
import type { Parts } from '@/typings'

const readParts = <T>(category: string): T[] =>
  JSON.parse(readFileSync(`src/assets/data/parts/${category}.json`, 'utf8'))

export const cpus = readParts<Parts.CpuInterface>('cpus')
export const gpus = readParts<Parts.GpuInterface>('gpus')
export const memory = readParts<Parts.MemoryInterface>('memory')

export function namedPart<T extends Parts.BaseInterface>(parts: T[], name: string): T {
  const part = parts.find(part => part.nameFull === name)
  if (!part) throw new Error(`Missing part: ${name}`)
  return { ...part }
}

export const cpu = () => namedPart(cpus, 'AMD Ryzen 3 Quad Core 1200')
export const gpu = () => namedPart(gpus, 'MSI GeForce GTX 950 GAMING 2G')
export const ram = () => namedPart(memory, 'ADATA ECC U-DIMM 8 GB 2133 MHz')
