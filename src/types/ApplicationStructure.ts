export type Interactable = {
  action: string
}

export type Screen = {
  actions: Interactable[]
}

export type ApplicationStructure = { screen: string; action: string }[]
