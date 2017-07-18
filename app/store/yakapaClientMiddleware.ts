import * as Redux from 'redux';
import { IActionWithPayload } from '../actions/helpers';
import { YakapaClient, YakapaMessage, YakapaEvent } from '../api/yakapaClient';
import { Actions } from '../actions'

const client: YakapaClient = new YakapaClient();

export function yakapaClientMiddleware(): Redux.Middleware {
  return (api: Redux.MiddlewareAPI<any>) => (next: Redux.Dispatch<any>) => <A extends IActionWithPayload<YakapaMessage>>(action: A) => {
    const result = next(action);
    if (action.type === Actions.Chat.send) {
      client.emit(YakapaEvent.CHAT, action.payload.message, action.payload.from);
    }
    return result;
  }
};

export function listenYakapaServer(store: any) {

  client.onChatMessageReceived.subscribe((yakapaClient: YakapaClient, yakapaMessage: YakapaMessage) => {
    store.dispatch(Actions.Chat.receive(yakapaMessage));
  });

  client.onAuthenticatedMessageReceived.subscribe((yakapaClient: YakapaClient, yakapaMessage: YakapaMessage) => {
    store.dispatch(Actions.YakapaClient.authenticated(yakapaMessage));
  });

}