import { onMounted, onUnmounted, ref } from 'vue'

export function useMediaQuery (query: string) {
  const media = typeof window !== 'undefined' && typeof window.matchMedia === 'function'
    ? window.matchMedia(query)
    : undefined
  const matches = ref(media?.matches ?? false)
  const update = () => { matches.value = media?.matches ?? false }

  onMounted(() => {
    update()
    media?.addEventListener('change', update)
  })
  onUnmounted(() => media?.removeEventListener('change', update))

  return matches
}
