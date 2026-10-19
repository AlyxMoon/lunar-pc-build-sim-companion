import { onMounted, onUnmounted, type Ref } from 'vue'

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ')

function focusableWithin (root: HTMLElement): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR))
}

function focusFirst (root: HTMLElement): void {
  const target: HTMLElement = focusableWithin(root)[0] ?? root
  target.focus()
}

/**
 * Moves focus into a dialog, keeps Tab and Shift+Tab inside it, and returns
 * focus to the element that held it before the dialog opened. The returned
 * function ends the hold; call it once the dialog has left the page.
 */
export function holdFocus (dialog: HTMLElement): () => void {
  const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null

  const onKeydown = (event: KeyboardEvent): void => {
    if (event.key !== 'Tab') return

    const items = focusableWithin(dialog)
    if (!items.length) {
      event.preventDefault()
      dialog.focus()
      return
    }

    const first = items[0]
    const last = items[items.length - 1]
    const active = document.activeElement
    const inside = dialog.contains(active)

    if (event.shiftKey && (!inside || active === first || active === dialog)) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && (!inside || active === last)) {
      event.preventDefault()
      first.focus()
    }
  }

  const onFocusin = (event: FocusEvent): void => {
    if (event.target instanceof Node && !dialog.contains(event.target)) focusFirst(dialog)
  }

  document.addEventListener('keydown', onKeydown)
  document.addEventListener('focusin', onFocusin)
  focusFirst(dialog)

  return () => {
    document.removeEventListener('keydown', onKeydown)
    document.removeEventListener('focusin', onFocusin)
    if (opener?.isConnected && opener.matches(':not(:disabled)')) opener.focus()
  }
}

/**
 * Holds focus inside the dialog element for as long as the calling component is mounted.
 */
export function useModalFocus (dialog: Ref<HTMLElement | null>): void {
  let release: (() => void) | undefined

  onMounted(() => {
    if (dialog.value) release = holdFocus(dialog.value)
  })

  onUnmounted(() => release?.())
}
