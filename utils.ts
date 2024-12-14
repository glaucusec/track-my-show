import { isEqual } from "lodash";
import { ShowTypeEvent } from "./types";

export const checkForSameEvents = (
  cachedVersion: ShowTypeEvent[],
  latestVersion: ShowTypeEvent[]
) => {
  return isEqual(cachedVersion, latestVersion);
};
