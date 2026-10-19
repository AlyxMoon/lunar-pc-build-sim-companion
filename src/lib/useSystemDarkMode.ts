import { onMounted, onUnmounted, ref } from 'vue'

export function useSystemDarkMode () {
  const query = typeof window !== 'undefined' && typeof window.matchMedia === 'function'
    ? window.matchMedia('(prefers-color-scheme: dark)')
    : undefined
  const isDark = ref(query?.matches ?? false)
  const update = () => { isDark.value = query?.matches ?? false }

  onMounted(() => {
    update()
    query?.addEventListener('change', update)
  })
  onUnmounted(() => query?.removeEventListener('change', update))

  return isDark
}
