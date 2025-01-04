import { isEqual } from "lodash";
import { ShowEventType, ShowTitleTypes } from "../types";

export const checkForSameEvents = (
  cachedVersion: ShowEventType[],
  latestVersion: ShowEventType[]
) => {
  return isEqual(cachedVersion, latestVersion);
};

export const processedShowTitles = (
  ShowDetails: ShowEventType[]
): ShowTitleTypes => {
  return ShowDetails.map((show) => show.EventTitle);
};
