import { writeFile } from "fs"

export interface RecordItem {
  action: string
  x: number
  y: number
}

export const record: RecordItem[] = [
  { action: "test", x: 1, y: 1 },
  // ... other items can be initially added here if needed
]

export const saveOrUpdateRecordItem = (item: RecordItem): void => {
  const index = record.findIndex(
    (recordItem) => recordItem.action === item.action
  )

  if (index !== -1) {
    // Update existing item
    record[index] = item
  } else {
    // Add new item
    record.push(item)
  }

  writeRecordToFile()
}

export const findRecordByAction = (
  actionToMatch: string
): RecordItem | undefined => {
  return record.find((item) => item.action === actionToMatch)
}

const writeRecordToFile = (): void => {
  const path = "" + "/record.json"
  // writeFile(path, JSON.stringify(record, null, 2))
  //   .then(() => {
  //     // console.log("Record saved to", path);
  //   })
  //   .catch((err) => {
  //     console.error("Error writing the record to file:", err)
  //   })
}
