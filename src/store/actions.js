import BuildModel from '@/models/Build'

export const createBuild = (context, data) => {
  const build = new BuildModel(data)
  context.commit('CREATE_BUILD', build)
}

export const updateBuild = (context, { data, index }) => {
  const build = new BuildModel(data)
  context.commit('UPDATE_BUILD', { data: build, index })
}

export const removeBuild = (context, index) => {
  context.commit('REMOVE_BUILD', { index })
}
