export type Action<O extends any = any, N extends any = O> = {
  actionName: string
  oldState: O
  newState: N
}
