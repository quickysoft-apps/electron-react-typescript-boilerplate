import { Dispatch, Middleware, MiddlewareAPI } from 'redux';
import * as actions from '../actions/chat';
import { State } from '../model/state';
import { IActionWithPayload } from '../actions/helpers';
import { YakapaEvent, YakapaClient, YakapaMessage } from '../api/yakapaClient';

const client: YakapaClient = new YakapaClient();

interface YakapaDispatch extends Dispatch<YakapaMessage> {
  (action: IActionWithPayload<YakapaMessage>): IActionWithPayload<YakapaMessage>;
}

// export function yakapaClientMiddleware(): Middleware {
//   return (api: MiddlewareAPI<State>) => (next: Dispatch<State>) => (dispatch : YakapaDispatch) => (action: IActionWithPayload<YakapaMessage>) => {
//     const result = next(action);
//     if (action.type === actions.send) {
//       client.emit(YakapaEvent.CHAT, action.payload.message, action.payload.from);
//     }
//     return result;
//   }
// }

export function yakapaClientMiddleware(): Middleware {
  return (api: MiddlewareAPI<State>) => (next: Dispatch<State>) => (dispatch : YakapaDispatch) => (action: IActionWithPayload<YakapaMessage>) => {
    const result = next(action);
    if (action.type === actions.send) {
      client.emit(YakapaEvent.CHAT, action.payload.message, action.payload.from);
    }
    return result;
  }
}

export default function (store: any) {
  client.onChatMessageReceived.subscribe((yakapaClient: YakapaClient, yakapaMessage: YakapaMessage) => {
    store.dispatch(actions.receive(yakapaMessage));
  });
}

