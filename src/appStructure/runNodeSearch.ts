import * as path from "path";
import * as parser from "@babel/parser";
import traverse from "@babel/traverse";
import fs from "fs";
import yaml from "js-yaml";

interface SearchParameters {
  projectPath: string;
  nodeTypes: string[];
  targetProp: string;
  includeSubtypes: boolean;
  outputFormat: string;
  outputFile: string;
}

// Function to load search parameters from the YAML file
const loadSearchParameters = (): SearchParameters => {
  const configFile = fs.readFileSync("searchNodes.yaml", "utf8");
  const config = yaml.load(configFile);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/consistent-type-assertions, @typescript-eslint/no-explicit-any
  return (config as any).searchParameters;
};

const searchParameters = loadSearchParameters();

const searchReactNodes = () => {
  const files = getAllFiles(searchParameters.projectPath);

  files.forEach((file) => {
    const content = fs.readFileSync(file, "utf-8");
    const ast = parser.parse(content, {
      plugins: ["jsx", "typescript"],
      sourceType: "module",
    });

    traverse(ast, {
      JSXOpeningElement(pathNode) {
        if (searchParameters.nodeTypes.includes(pathNode.node.name.name)) {
          const { attributes } = pathNode.node;
          const hasTargetProp = attributes.some(
            (attribute) => attribute.type === "JSXAttribute" && attribute.name.name === searchParameters.targetProp,
          );

          const relativeFilePath = path.relative(searchParameters.projectPath, file);
          if (hasTargetProp) {
            const targetAttribute = attributes.find(
              (attribute) => attribute.type === "JSXAttribute" && attribute.name.name === searchParameters.targetProp,
            );
            let propValue = "";
            if (targetAttribute && targetAttribute.value) {
              if (targetAttribute.value.type === "StringLiteral") {
                propValue = targetAttribute.value.value;
              } else if (targetAttribute.value.type === "JSXExpressionContainer") {
                propValue = "JSX Expression"; // This can be more specific based on your needs
              }
            }
            console.log(
              `Found ${pathNode.node.name.name} with ${searchParameters.targetProp}="${propValue}" in ${relativeFilePath}`,
            );
          } else {
            console.log(
              `Found ${pathNode.node.name.name} without ${searchParameters.targetProp} in ${relativeFilePath}`,
            );
          }
        }
      },
    });
  });
};

const getAllFiles = (dirPath: string, arrayOfFiles: string[] = []) => {
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      arrayOfFiles.push(path.join(dirPath, "/", file));
    }
  });

  return arrayOfFiles.filter((file) => file.endsWith(".tsx") || file.endsWith(".ts"));
};

searchReactNodes();
