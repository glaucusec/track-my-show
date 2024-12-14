export type ShowTypeEvent = {
  EventCensor: string;
  EventDuration: string;
  EventGenre: string;
  EventGroup: string;
  EventSynopsis: string;
  EventTitle: string;
};

export type ChildEventType = {};

export type TelNotificationType = {
  msg: string;
  type?: "error" | "success";
};
