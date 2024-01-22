import { tAppState } from "../../src/redux/appState/types";

export type tAppStateWhiteList = Pick<tAppState, "rCurrentScreen" | "rFocusName" | "rFocusPassword" | "rLoggedIn">;

export type tUserPath = {
  actionName: string;
  oldState: tAppStateWhiteList;
  newState: tAppStateWhiteList;
};
