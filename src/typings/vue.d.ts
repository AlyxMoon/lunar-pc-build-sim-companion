import type { Store } from 'vuex'
import type { AppState, DisplayFunctionMap } from './index'

declare module 'vue' {
  interface ComponentCustomProperties {
    $store: Store<AppState>,
    displayFilters: DisplayFunctionMap,
  }
}
