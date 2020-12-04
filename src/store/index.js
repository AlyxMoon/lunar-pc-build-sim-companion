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
  'casefans',
  'cases',
  'cpucoolers',
  'cpus',
  'gpus',
  'memory',
  'motherboards',
  'power-supplies',
  'storage',
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
