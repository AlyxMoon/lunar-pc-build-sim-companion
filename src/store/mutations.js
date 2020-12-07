
export const CREATE_BUILD = (state, payload) => {
  state.builds.push(payload)
}

export const UPDATE_BUILD = (state, payload) => {
  state.builds.splice(payload.index, 1, payload.data)
}

export const REMOVE_BUILD = (state, payload) => {
  state.builds.splice(payload.index, 1)
}

export const CLEAR_ALL_BUILDS = (state) => {
  state.builds = []
}
