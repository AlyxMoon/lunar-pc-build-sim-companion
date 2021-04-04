import { CategoryInterface } from '@/typings'

import ProgramRequirementsModel from '@/models/ProgramRequirements.model'

import programRequirements from '@/assets/data/programrequirements.json'
import casefans from '@/assets/data/parts/casefans.json'
import cases from '@/assets/data/parts/cases.json'
import cpucoolers from '@/assets/data/parts/cpucoolers.json'
import cpus from '@/assets/data/parts/cpus.json'
import gpus from '@/assets/data/parts/gpus.json'
import memory from '@/assets/data/parts/memory.json'
import motherboards from '@/assets/data/parts/motherboards.json'
import powersupplies from '@/assets/data/parts/powersupplies.json'
import storage from '@/assets/data/parts/storage.json'

const categories: CategoryInterface[] = [
  {
    name: 'cpus',
    displayName: 'CPU / Processors',
    partType: 'CPU',
    icon: 'microchip',
    iconBackColor: '#FFC800',
    headers: [
      { name: 'manufacturer', displayName: 'Manufacturer' },
      { name: 'name', displayName: 'Part Name' },
      { name: 'price', displayName: 'Price', filter: 'currency' },
      { name: 'level', displayName: 'Level' },
      { name: 'rank', displayName: 'Part Ranking Score' },
      { name: 'socket', displayName: 'Socket' },
      { name: 'frequency', displayName: 'Frequency' },
      { name: 'wattage', displayName: 'Wattage' },
    ],
  },
  {
    name: 'cpucoolers',
    displayName: 'CPU Cooling',
    partType: 'CPU Cooler',
    icon: 'fan',
    iconBackColor: '#00BCFF',
    headers: [
      { name: 'manufacturer', displayName: 'Manufacturer' },
      { name: 'name', displayName: 'Part Name' },
      { name: 'price', displayName: 'Price', filter: 'currency' },
      { name: 'level', displayName: 'Level' },
      { name: 'typeSecondary', displayName: 'Type' },
      { name: 'airFlow', displayName: 'Air Flow' },
    ],
  },
  {
    name: 'motherboards',
    displayName: 'Motherboards',
    partType: 'Motherboard',
    icon: 'chess-board',
    iconBackColor: '#99359A',
    headers: [
      { name: 'manufacturer', displayName: 'Manufacturer' },
      { name: 'name', displayName: 'Part Name' },
      { name: 'price', displayName: 'Price', filter: 'currency' },
      { name: 'level', displayName: 'Level' },
      { name: 'socket', displayName: 'CPU Socket' },
      { name: 'chipset', displayName: 'Chipset' },
      { name: 'sizeType', displayName: 'Size' },
      { name: 'ramSpeedMax', displayName: 'Max RAM speed' },
      { name: 'gpuSLI', displayName: 'Support SLI' },
      { name: 'gpuCrossFire', displayName: 'Support CrossFire' },
    ],
  },
  {
    name: 'memory',
    displayName: 'Memory',
    partType: 'Memory',
    icon: 'memory',
    iconBackColor: '#00A668',
    headers: [
      { name: 'name', displayName: 'Part Name' },
      { name: 'manufacturer', displayName: 'Manufacturer' },
      { name: 'price', displayName: 'Price', filter: 'currency' },
      { name: 'level', displayName: 'Level' },
      { name: 'sizeGb', displayName: 'Size (GB)' },
      { name: 'frequency', displayName: 'Frequency' },
    ],
  },
  {
    name: 'gpus',
    displayName: 'Graphics Cards',
    partType: 'GPU',
    icon: 'image',
    iconBackColor: '#DC0000',
    headers: [
      { name: 'manufacturer', displayName: 'Manufacturer' },
      { name: 'name', displayName: 'Part Name' },
      { name: 'price', displayName: 'Price', filter: 'currency' },
      { name: 'level', displayName: 'Level' },
      { name: 'rank', displayName: 'Part Ranking Score' },
      { name: 'vramGb', displayName: 'VRAM (GB)' },
      { name: 'multi', displayName: 'Multi-GPU' },
      { name: 'wattage', displayName: 'Wattage' },
    ],
  },
  {
    name: 'storage',
    displayName: 'Storage',
    partType: 'Storage',
    icon: 'hdd',
    iconBackColor: '#FF8100',
    headers: [
      { name: 'name', displayName: 'Part Name' },
      { name: 'typeSecondary', displayName: 'Type' },
      { name: 'manufacturer', displayName: 'Manufacturer' },
      { name: 'price', displayName: 'Price', filter: 'currency' },
      { name: 'level', displayName: 'Level' },
      { name: 'sizeGb', displayName: 'Size (GB)' },
    ],
  },
  {
    name: 'powersupplies',
    displayName: 'Power Supplies',
    partType: 'Power Supply',
    icon: 'plug',
    iconBackColor: '#FE0086',
    headers: [
      { name: 'manufacturer', displayName: 'Manufacturer' },
      { name: 'name', displayName: 'Part Name' },
      { name: 'price', displayName: 'Price', filter: 'currency' },
      { name: 'level', displayName: 'Level' },
      { name: 'wattage', displayName: 'Wattage' },
      { name: 'modularType', displayName: 'Modular Type' },
      { name: 'sizeType', displayName: 'Size' },
    ],
  },
  {
    name: 'casefans',
    displayName: 'Case Fans',
    partType: 'Case Fan',
    icon: 'wind',
    iconBackColor: '#007AA6',
    headers: [
      { name: 'name', displayName: 'Part Name' },
      { name: 'manufacturer', displayName: 'Manufacturer' },
      { name: 'price', displayName: 'Price', filter: 'currency' },
      { name: 'level', displayName: 'Level' },
      { name: 'airFlow', displayName: 'Air Flow' },
      { name: 'size', displayName: 'Size' },
    ],
  },
  {
    name: 'cases',
    displayName: 'Cases',
    partType: 'Case',
    icon: 'box',
    iconBackColor: '#AAAAAA',
    headers: [
      { name: 'manufacturer', displayName: 'Manufacturer' },
      { name: 'name', displayName: 'Part Name' },
      { name: 'price', displayName: 'Price', filter: 'currency' },
      { name: 'level', displayName: 'Level' },
      { name: 'sizeType', displayName: 'Size' },
    ],
  },
]

const state = {
  programRequirements: programRequirements.map(item => new ProgramRequirementsModel(item)),
  categories,
  parts: {
    casefans,
    cases,
    cpucoolers,
    cpus,
    gpus,
    memory,
    motherboards,
    powersupplies,
    storage,
  },
  builds: [],
  playerLevel: 1,
  allowModdedPartsHEM: false,

  colorMode: 'light',
}

export default state
