import React, { type FC, ReactNode } from "react";
import { Config } from "./types/Config.types";
import { ABPressable } from "./ABPressable";

type ABContextProps = {
    children: ReactNode;
    config?: Config;
    getState?: <T>() => T;
};

export type InteractableItem = {
    press: () => void;
    pageX: number;
    pageY: number;
}

export type appStructureItem = {
    screenName: string;
    actions: string[];
}
export type InteractableLinks = Record<string, InteractableItem>;
export const interactableLinks: InteractableLinks = {};
export const appStructure: appStructureItem[] = [];

export const ABContext: FC<ABContextProps> = ({ children }) => {

    return (<>{children}</>)
};

setTimeout(() => {
    interactableLinks["testme"].press();
}, 5000)