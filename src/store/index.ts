import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'

import BuildModel from '@/models/Build.model'

import * as actions from './actions'
import * as mutations from './mutations'
import state from './state'

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
