import * as Redux from 'redux';
import { IActionWithPayload } from '../actions/helpers';
import settings = require('electron-settings');
import { Agent, AgentMessage, AgentEvent } from '../api/agent';
import { Actions } from '../actions'

const client: Agent = new Agent();

export function agentMiddleware(): Redux.Middleware {
  return (api: Redux.MiddlewareAPI<any>) => (next: Redux.Dispatch<any>) => <A extends IActionWithPayload<any>>(action: A) => {

    const result = next(action);

    if (Actions.Agent.setProfile.test(action)) {
      client.nickname = action.payload.nickname;
      settings.set('email', action.payload.email);
      const message = JSON.stringify({ email: action.payload.email });
      client.emit(AgentEvent.ASSOCIATING, message);
    }

    if (Actions.Chat.send.test(action)) {
      client.emit(AgentEvent.CHAT, action.payload.message, action.payload.from);
    }

    return result;
  }
};

export function listenAgentServer(store: any) {

  client.onConnected.subscribe(() => {
    store.dispatch(Actions.Agent.notifySuccessfulConnection());
  });

  client.onConnectionError.subscribe((error: Object) => {
    store.dispatch(Actions.Agent.notifyConnectionError(error));
  })

  client.onSocketError.subscribe((error: Object) => {
    store.dispatch(Actions.Agent.notifySocketError(error));
  })

  client.onPong.subscribe((ms: number) => {
    store.dispatch(Actions.Agent.pong(ms));
  })

  client.onAuthenticated.subscribe((agent: Agent, message: AgentMessage) => {
    store.dispatch(Actions.Agent.notifySuccessfulAuthentication(message));
  });

}