export function sleep(time: number): Promise<{}> {
  return new Promise((resolve: () => void) => {
    setTimeout(resolve, time);
  })
}