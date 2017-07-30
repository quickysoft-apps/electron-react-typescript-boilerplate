import * as Redux from 'redux';
import { IActionWithPayload } from '../actions/helpers';
import { Agent, AgentMessage, AgentEvent } from '../api/agent';
import { Actions } from '../actions'

const client: Agent = new Agent();

export function agentMiddleware(): Redux.Middleware {
  return (api: Redux.MiddlewareAPI<any>) => (next: Redux.Dispatch<any>) => <A extends IActionWithPayload<AgentMessage>>(action: A) => {
    const result = next(action);
    if (action.type === Actions.Agent.chatSend) {
      client.emit(AgentEvent.CHAT, action.payload.message, action.payload.from);
    }
    return result;
  }
};

export function listenAgentServer(store: any) {
  
  client.onConnected.subscribe(() => {
    store.dispatch(Actions.Agent.connected());
  });

  client.onConnectionError.subscribe((error: Object) => {
    store.dispatch(Actions.Agent.connectionError(error));
  })

  client.onSocketErrorMessageReceived.subscribe((error: Object) => {
    store.dispatch(Actions.Agent.socketError(error));
  })

  client.onPong.subscribe((ms: number) => {
    store.dispatch(Actions.Agent.pong(ms));
  })

  client.onAuthenticatedMessageReceived.subscribe((agent: Agent, message: AgentMessage) => {
    store.dispatch(Actions.Agent.authenticated(message));
  });

}