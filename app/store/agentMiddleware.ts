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