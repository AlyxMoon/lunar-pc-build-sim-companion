import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'

import BuildModel from '@/models/Build.model'

import * as actions from './actions'
import * as getters from './getters'
import * as mutations from './mutations'
import state from './state'

export default createStore({
  state,
  actions,
  getters,
  mutations,

  plugins: [
    createPersistedState({
      fetchBeforeUse: true,
      paths: [
        'allowModdedPartsHEM',
        'builds',
        'colorMode',
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
