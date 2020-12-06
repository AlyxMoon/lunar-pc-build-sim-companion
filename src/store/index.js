import { createStore } from 'vuex'

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
  },
  {
    name: 'cpucoolers',
    displayName: 'CPU Cooling',
    icon: 'fan',
    iconBackColor: '#00BCFF',
  },
  {
    name: 'motherboards',
    displayName: 'Motherboards',
    icon: 'chess-board',
    iconBackColor: '#99359A',
  },
  {
    name: 'memory',
    displayName: 'Memory',
    icon: 'memory',
    iconBackColor: '#00A668',
  },
  {
    name: 'gpus',
    displayName: 'Graphics Cards',
    icon: 'image',
    iconBackColor: '#DC0000',
  },
  {
    name: 'storage',
    displayName: 'Storage',
    icon: 'hdd',
    iconBackColor: '#DC0000',
  },
  {
    name: 'powersupplies',
    displayName: 'Power Supplies',
    icon: 'plug',
    iconBackColor: '#FE0086',
  },
  {
    name: 'casefans',
    displayName: 'Case Fans',
    icon: 'wind',
    iconBackColor: '#007AA6',
  },
  {
    name: 'cases',
    displayName: 'Cases',
    icon: 'box',
    iconBackColor: '#AAAAAA',
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
    motherboards,
    powersupplies,
    storage,
  },
}

export default createStore({
  state,
  mutations: {},
  actions: {},
  modules: {},
})
