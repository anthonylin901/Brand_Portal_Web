export const wait = (second: number) => {
  return new Promise(resolve => {
    setTimeout(resolve, second * 1000)
  })
}
