export const throttleButton = (el: HTMLButtonElement) => {
  el.addEventListener("click", () => {
    el.disabled = true
    setTimeout(() => {
      el.disabled = false
    }, 3000)
  })
}
