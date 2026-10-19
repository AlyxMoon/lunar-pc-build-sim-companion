import { Parts } from '@/typings'

const partCost = (part: Pick<Parts.BaseInterface, 'price' | 'isNewPart' | 'isNewUsedPart' | 'isPartOfCase'>): number => {
  if (!part.isNewPart || part.isPartOfCase) return 0

  return part.isNewUsedPart
    ? Math.floor(part.price * 1.25 / 3)
    : part.price
}

export default partCost
