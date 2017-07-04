import { IActionWithPayload } from "../actions/helpers";
import { receive, ChatPayload } from "../actions/chat";

export type ChatState = Map<string, string>;

export default function chat(state: Map<string, string> = new Map<string, string>(), action: IActionWithPayload<ChatPayload>) {
  if (receive.test(action)) {
    return new Map(state).set(action.payload.from, action.payload.message);
  }

  return state;
}
