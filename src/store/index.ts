import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'

import BuildModel from '@/models/Build.model'
import ProgramRequirementsModel from '@/models/ProgramRequirements.model'

import * as actions from './actions'
import * as mutations from './mutations'

import programRequirements from '@/assets/data/program-requirements.json'

import casefans from '@/assets/data/parts/casefans.json'
import cases from '@/assets/data/parts/cases.json'
import cpucoolers from '@/assets/data/parts/cpu-coolers.json'
import cpus from '@/assets/data/parts/cpus.json'
import gpus from '@/assets/data/parts/gpus.json'
import memory from '@/assets/data/parts/memory.json'
import motherboards from '@/assets/data/parts/motherboards.json'
import powersupplies from '@/assets/data/parts/power-supplies.json'
import storage from '@/assets/data/parts/storage.json'

const categories = [
  {
    name: 'cpus',
    displayName: 'CPU / Processors',
    partTypeNames: ['CPU'],
    icon: 'microchip',
    iconBackColor: '#FFC800',
    headers: [
      { name: 'Manufacturer' },
      { name: 'Part Name' },
      { name: 'Price', filter: 'currency' },
      { name: 'Level' },
      { name: 'Part Ranking Score' },
      { name: 'Series' },
      { name: 'Socket' },
      { name: 'Frequency' },
      { name: 'Wattage' },
    ],
  },
  {
    name: 'cpucoolers',
    displayName: 'CPU Cooling',
    partTypeNames: ['CPU Cooler - Air', 'CPU Cooler - Liquid'],
    icon: 'fan',
    iconBackColor: '#00BCFF',
    headers: [
      { name: 'Manufacturer' },
      { name: 'Part Name' },
      { name: 'Price', filter: 'currency' },
      { name: 'Level' },
      { name: 'Type' },
      { name: 'Air Flow' },
    ],
  },
  {
    name: 'motherboards',
    displayName: 'Motherboards',
    partTypeNames: ['Motherboard'],
    icon: 'chess-board',
    iconBackColor: '#99359A',
    headers: [
      { name: 'Manufacturer' },
      { name: 'Part Name' },
      { name: 'Price', filter: 'currency' },
      { name: 'Level' },
      { name: 'CPU Socket' },
      { name: 'Chipset' },
      { name: 'Size' },
      { name: 'Max RAM Speed Step' },
      { name: 'Support SLI' },
      { name: 'Support CrossFire' },
    ],
  },
  {
    name: 'memory',
    displayName: 'Memory',
    partTypeNames: ['Memory'],
    icon: 'memory',
    iconBackColor: '#00A668',
    headers: [
      { name: 'Manufacturer' },
      { name: 'Part Name' },
      { name: 'Price', filter: 'currency' },
      { name: 'Level' },
      { name: 'Size (GB)' },
      { name: 'Frequency' },
    ],
  },
  {
    name: 'gpus',
    displayName: 'Graphics Cards',
    partTypeNames: ['GPU', 'GPU - Water'],
    icon: 'image',
    iconBackColor: '#DC0000',
    headers: [
      { name: 'Manufacturer' },
      { name: 'Part Name' },
      { name: 'Price', filter: 'currency' },
      { name: 'Level' },
      { name: 'Part Ranking Score' },
      { name: 'Chipset' },
      { name: 'VRAM (GB)' },
      { name: 'Multi-GPU' },
      { name: 'Wattage' },
    ],
  },
  {
    name: 'storage',
    displayName: 'Storage',
    partTypeNames: ['Storage - HDD', 'Storage - SSD', 'Storage - M.2'],
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
    partTypeNames: ['Power Supply'],
    icon: 'plug',
    iconBackColor: '#FE0086',
    headers: [
      { name: 'Manufacturer' },
      { name: 'Part Name' },
      { name: 'Price', filter: 'currency' },
      { name: 'Level' },
      { name: 'Wattage' },
      { name: 'Type' },
      { name: 'Size' },
    ],
  },
  {
    name: 'casefans',
    displayName: 'Case Fans',
    partTypeNames: ['Case Fan'],
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
    partTypeNames: ['Case'],
    icon: 'box',
    iconBackColor: '#AAAAAA',
    headers: [
      { name: 'Manufacturer' },
      { name: 'Part Name' },
      { name: 'Price', filter: 'currency' },
      { name: 'Level' },
      { name: 'Size' },
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
}

export default createStore({
  state,
  actions,
  mutations,

  plugins: [
    createPersistedState({
      fetchBeforeUse: true,
      paths: [
        'builds',
        'playerLevel',
      ],
      rehydrated: store => {
        const builds: BuildModel[] = store.state.builds || []

        builds.forEach((build, i) => {
          store.dispatch('updateBuild', { data: build._attributes, index: i })
        })
      },
    }),
  ],
})
