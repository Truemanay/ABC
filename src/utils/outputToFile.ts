import fs from "fs"

export const outputToFile = (data: Record<string, unknown>, path: string) => {
  return new Promise<void>((resolve, reject) => {
    const jsonString = JSON.stringify(data)
    fs.writeFile(path, jsonString, (err) => {
      if (err) reject(err)
      else resolve()
    })
  })
}
