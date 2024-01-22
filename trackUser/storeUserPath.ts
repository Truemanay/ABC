import RNFS from "react-native-fs";
import { tUserPath } from "./whitelist";

export const userPath: tUserPath[] = [];

export const updateUserPath = (item: tUserPath): void => {
  //   const index = record.findIndex((recordItem) => recordItem.action === item.action);

  //   if (index !== -1) {
  // Update existing item
  // userPath[index] = item;
  //   } else {
  // Add new item
  userPath.push(item);
  //   }

  writeRecordToFile();
};

// export const findRecordByAction = (actionToMatch: string): RecordItem | undefined => {
//   return record.find((item) => item.action === actionToMatch);
// };

const writeRecordToFile = (): void => {
  const path = RNFS.DocumentDirectoryPath + "/userPath.json";
  RNFS.writeFile(path, JSON.stringify(userPath, null, 2))
    .then(() => {
      console.log("Record saved to", path);
    })
    .catch((err) => {
      console.error("Error writing the record to file:", err);
    });
};
