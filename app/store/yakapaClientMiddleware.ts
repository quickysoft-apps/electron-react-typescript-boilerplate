import * as Redux from 'redux';
import * as actions from '../actions/chat';
import { IActionWithPayload } from '../actions/helpers';
import { YakapaEvent, YakapaClient, YakapaMessage } from '../api/yakapaClient';

const client: YakapaClient = new YakapaClient();

export function yakapaClientMiddleware(): Redux.Middleware {
  return (api: Redux.MiddlewareAPI<any>) => (next: Redux.Dispatch<any>) => <A extends IActionWithPayload<YakapaMessage>>(action: A) => {
    const result = next(action);
    if (action.type === actions.send) {      
      client.emit(YakapaEvent.CHAT, action.payload.message, action.payload.from);
    }
    return result;
  }
}; 

export function listenYakapaServer (store: any) {
  client.onChatMessageReceived.subscribe((yakapaClient: YakapaClient, yakapaMessage: YakapaMessage) => {
    store.dispatch(actions.receive(yakapaMessage));
  });
}