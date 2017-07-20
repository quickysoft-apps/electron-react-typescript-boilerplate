import * as Redux from 'redux';
import { IActionWithPayload } from '../actions/helpers';
import { Agent, AgentMessage, AgentEvent } from '../api/agent';
import { Actions } from '../actions'

const client: Agent = new Agent();

export function agentMiddleware(): Redux.Middleware {
  return (api: Redux.MiddlewareAPI<any>) => (next: Redux.Dispatch<any>) => <A extends IActionWithPayload<AgentMessage>>(action: A) => {
    const result = next(action);
    if (action.type === Actions.Chat.send) {
      client.emit(AgentEvent.CHAT, action.payload.message, action.payload.from);
    }
    return result;
  }
};

export function listenAgentServer(store: any) {
  
  client.onConnectedMessageReceived.subscribe(() => {
    store.dispatch(Actions.Agent.connected());
  });

  client.onConnectionErrorMessageReceived.subscribe((error: Object) => {
    store.dispatch(Actions.Agent.connectionError(error));
  })

  client.onSocketErrorMessageReceived.subscribe((error: Object) => {
    store.dispatch(Actions.Agent.socketError(error));
  })

  client.onAuthenticatedMessageReceived.subscribe((agent: Agent, message: AgentMessage) => {
    store.dispatch(Actions.Agent.authenticated(message));
  });

}