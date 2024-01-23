import { type FC, ReactNode } from "react";
import { Config } from "./types/Config.types";

type ABContextProps = {
    children: ReactNode;
    config?: Config;
    getState?: <T>() => T;
};

export const ABContext: FC<ABContextProps> = ({ children }) => {
    return (<>{children}</>)
};