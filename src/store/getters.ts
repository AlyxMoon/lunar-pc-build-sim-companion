import { PlainObject } from '@/typings'

export const modifiedCategoryHeaders = (state: PlainObject): PlainObject[] => {
  if (!state.allowModdedPartsHEM) {
    return state.categories.map((category: PlainObject) => category.headers)
  }

  return state.categories.map((category: PlainObject) => {
    return [
      ...category.headers,
      {
        name: 'moddedPartHEM',
        displayName: 'HEM Part',
      },
    ]
  })
}
