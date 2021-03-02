import BuildModel from '@/models/Build.model'
import { PlainObject } from '@/typings'

export const UPDATE_PLAYER_LEVEL = (state: PlainObject, level: number): void => {
  state.playerLevel = level
}

export const CREATE_BUILD = (state: PlainObject, build: BuildModel): void => {
  state.builds.push(build)
}

export const UPDATE_BUILD = (
  state: PlainObject,
  payload: { index: number, data: BuildModel },
): void => {
  state.builds.splice(payload.index, 1, payload.data)
}

export const REMOVE_BUILD = (state: PlainObject, index: number): void => {
  state.builds.splice(index, 1)
}

export const SET_ALL_BUILDS = (state: PlainObject, builds: BuildModel[]): void => {
  state.builds = builds
}

export const CLEAR_ALL_BUILDS = (state: PlainObject): void => {
  state.builds = []
}
