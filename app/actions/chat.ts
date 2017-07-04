import { actionCreator } from "./helpers";

export interface ChatPayload {
  from: string;
  message: string;
}

export const receive = actionCreator<ChatPayload>("chat/RECEIVE");