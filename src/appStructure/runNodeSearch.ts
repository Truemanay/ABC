// @ts-nocheck
import * as path from "path"
import * as parser from "@babel/parser"
import traverse from "@babel/traverse"
import fs from "fs"
import { Config } from "../types/Config.types"
import { NODE_TYPES } from "../constants/nodeTypes.constants"
import { ACTION_DESCRIPTION_PROP_NAME } from "../constants/propNames.constants"
import { ApplicationStructure } from "../types/ApplicationStructure.types"
import { outputToFile } from "../utils/outputToFile"

export const searchReactNodes = (config?: Config) => {
  console.log("Searching for React nodes...")
  // Config
  const projectPath = config?.projectPath ?? "app/" // Also check src/app

  const files = getAllFiles(projectPath)

  const interactables: ApplicationStructure = []

  files.forEach((file) => {
    console.log("Searching in file:", file)
    const content = fs.readFileSync(file, "utf-8")
    const ast = parser.parse(content, {
      plugins: ["jsx", "typescript"],
      sourceType: "module",
    })

    traverse(ast, {
      JSXOpeningElement(pathNode) {
        if (NODE_TYPES.includes(pathNode.node.name.name)) {
          const { attributes } = pathNode.node
          const hasTargetProp = attributes.some(
            (attribute) =>
              attribute.type === "JSXAttribute" &&
              attribute.name.name === ACTION_DESCRIPTION_PROP_NAME
          )

          const relativeFilePath = path.relative(projectPath, file)
          if (hasTargetProp) {
            const targetAttribute = attributes.find(
              (attribute) =>
                attribute.type === "JSXAttribute" &&
                attribute.name.name === ACTION_DESCRIPTION_PROP_NAME
            )
            let propValue = ""
            if (targetAttribute && targetAttribute.value) {
              if (targetAttribute.value.type === "StringLiteral") {
                propValue = targetAttribute.value.value
              } else if (
                targetAttribute.value.type === "JSXExpressionContainer"
              ) {
                propValue = "JSX Expression" // This can be more specific based on your needs
              }
            }
            interactables.push({ action: propValue, screen: relativeFilePath })
          } else {
            console.log(
              `Found ${pathNode.node.name.name} on ${relativeFilePath}. This is missing ${ACTION_DESCRIPTION_PROP_NAME} prop or is not an ABPressable component`
            )
          }
        }
      },
    })
  })

  console.log(`Found ${interactables.length} React nodes:`)
  console.log(interactables)

  outputToFile({ interactables }, "interactables.json")
}

const getAllFiles = (dirPath: string, arrayOfFiles: string[] = []) => {
  const files = fs.readdirSync(dirPath)

  files.forEach((file) => {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles)
    } else {
      arrayOfFiles.push(path.join(dirPath, "/", file))
    }
  })

  return arrayOfFiles.filter(
    (file) => file.endsWith(".tsx") || file.endsWith(".ts")
  )
}
