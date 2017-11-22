import * as Redux from 'redux';
import { IActionWithPayload } from '../actions/helpers';
import { Agent, IAgentMessage, AgentEvent } from '../api/agent';
import { Actions } from '../actions';

const AGENT_STATUS_JOB = '__yakapa_agent_status__';
const client: Agent = new Agent();

type DispatchWithPayloadFunction<P> = <A extends IActionWithPayload<P>>(actionWithPayload: A) => A;
type DispatchFunction<P> = (next: Redux.Dispatch<P>) => DispatchWithPayloadFunction<P>;

export function agentMiddleware(): Redux.Middleware {
  return (api: Redux.MiddlewareAPI<any>): DispatchFunction<any> => (next: Redux.Dispatch<any>): DispatchWithPayloadFunction<any> => <A extends IActionWithPayload<any>>(action: A): A => {

    const result = next(action);
    const state = api.getState();

    const agentStats = {
      connectionDate: state.agent.connectionDate,
      ping: state.agent.pongMS,
      trusted: state.agent.trusted
    };

    if (Actions.Configuration.save.test(action)) {
      client.configuration.nickname = action.payload.nickname;
      client.configuration.email = action.payload.email;
      client.emit(AgentEvent.CONFIGURED);
    }

    if (Actions.JobRunner.resultChanged.test(action)) {

      const payload = {
        job: action.payload.jobName,
        value: action.payload.result
      };

      client.emit(AgentEvent.STORE, JSON.stringify(payload));
    }

    if (Actions.Agent.pong.test(action)) {

      const payload = {
        job: AGENT_STATUS_JOB,
        value: {
          ...agentStats,
          ping: action.payload
        }
      };

      client.emit(AgentEvent.STORE, JSON.stringify(payload));
    }

    if (Actions.Agent.notifySuccessfulConnection.test(action)) {

      const payload = {
        job: AGENT_STATUS_JOB,
        value: {
          connectionDate: new Date(Date.now()).toJSON(),
          trusted: false
        }
      };

      client.emit(AgentEvent.STORE, JSON.stringify(payload));
    }

    return result;
  };
}

export function listenAgentServer(store: any): void {

  client.onConnected.subscribe(() => {
    store.dispatch(Actions.Agent.notifySuccessfulConnection());
  });

  client.onConnectionError.subscribe((error: object) => {
    store.dispatch(Actions.Agent.notifyConnectionError(error));
  });

  client.onSocketError.subscribe((error: object) => {
    store.dispatch(Actions.Agent.notifySocketError(error));
  });

  client.onPong.subscribe((ms: number) => {
    store.dispatch(Actions.Agent.pong(ms));
  });

  client.onReady.subscribe((agent: Agent, message: IAgentMessage) => {
    store.dispatch(Actions.Agent.notifyReadiness(message));
    store.dispatch(Actions.Configuration.save({
      ...store.getState().configuration,
      nickname: message.nickname
    }));
  });

}
