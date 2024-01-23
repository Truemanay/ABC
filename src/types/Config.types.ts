/** The overall configuration for AutoBot */
export type Config = {
  /** The path to your screens folder. Will check both `app/` and `src/app/` if omitted. */
  projectPath?: string
  /** Add extra interactable JSX elements to discover for application structure. */
  extraNodeTypes?: string[]
}
