import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'

import * as actions from './actions'
import * as mutations from './mutations'

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
    ],
  },
  {
    name: 'memory',
    displayName: 'Memory',
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
      { name: 'Wattage' },
    ],
  },
  {
    name: 'storage',
    displayName: 'Storage',
    icon: 'hdd',
    iconBackColor: '#FF8100',
    headers: [
      { name: 'Manufacturer' },
      { name: 'Part Name' },
      { name: 'Price', filter: 'currency' },
      { name: 'Level' },
      { name: 'Type' },
      { name: 'Size (GB)' },
    ],
  },
  {
    name: 'powersupplies',
    displayName: 'Power Supplies',
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
    icon: 'wind',
    iconBackColor: '#007AA6',
    headers: [
      { name: 'Manufacturer' },
      { name: 'Part Name' },
      { name: 'Price', filter: 'currency' },
      { name: 'Level' },
      { name: 'Air Flow' },
      { name: 'Size' },
    ],
  },
  {
    name: 'cases',
    displayName: 'Cases',
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
  categories,
  parts: {
    casefans,
    cases,
    cpucoolers,
    cpus,
    gpus,
    memory,
    // todo: correct the motherboard Full Part Name getting parsed incorrectly
    motherboards: motherboards.map(part => ({
      ...part,
      'Full Part Name': part.undefined,
    })),
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
        const builds = store.state.builds || []

        builds.forEach((build, i) => {
          store.dispatch('updateBuild', { data: build._attributes, index: i })
        })
      },
    }),
  ],
})