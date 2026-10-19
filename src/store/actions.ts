import { AppState, BuildModelInterface, ImportExportData, PlainObject } from '@/typings'
import { ActionContext } from 'vuex'

import BuildModel from '@/models/Build.model'

export const createBuild = (
  context: ActionContext<AppState, AppState>,
  data: PlainObject | BuildModelInterface,
): void => {
  const build = data instanceof BuildModel
    ? data
    : new BuildModel(data)

  context.commit('CREATE_BUILD', build)
}

export const updateBuild = (
  context: ActionContext<AppState, AppState>,
  { data, index }: { data: BuildModelInterface, index: number },
): void => {
  const build = new BuildModel(data)
  context.commit('UPDATE_BUILD', { data: build, index })
}

export const removeBuild = (
  context: ActionContext<AppState, AppState>,
  index: number,
): void => {
  context.commit('REMOVE_BUILD', index)
}

export const exportPlayerData = (
  context: ActionContext<AppState, AppState>,
): void => {
  const fieldsToSave = ['builds', 'playerLevel', 'allowModdedPartsHEM', 'colorMode', 'analyticsEnabled']

  const data: ImportExportData = {}
  for (const field of fieldsToSave) {
    data[field] = context.state[field]
  }

  const dataForExport = encodeURIComponent(JSON.stringify(data, null, 0))

  const pseudoEl = document.createElement('a')
  pseudoEl.setAttribute('href', `data:text/json;charset=utf-8,${dataForExport}`)
  pseudoEl.setAttribute('download', 'export.json')
  document.body.appendChild(pseudoEl)
  pseudoEl.click()
  pseudoEl.remove()
}

export const importPlayerData = (
  context: ActionContext<AppState, AppState>,
  data: ImportExportData,
): void => {
  if ('builds' in data) {
    const builds = data.builds?.map(build => new BuildModel(build._attributes))
    context.commit('SET_ALL_BUILDS', builds)
  }

  if ('playerLevel' in data) {
    context.commit('UPDATE_PLAYER_LEVEL', data.playerLevel)
  }

  if ('allowModdedPartsHEM' in data) {
    context.commit('UPDATE_ALLOW_MODDED_PARTS_HEM', data.allowModdedPartsHEM)
  }

  if ('colorMode' in data) {
    context.commit('UPDATE_COLOR_MODE', data.colorMode)
  }

  if ('analyticsEnabled' in data) {
    context.commit('UPDATE_ANALYTICS_ENABLED', data.analyticsEnabled)
  }
}
