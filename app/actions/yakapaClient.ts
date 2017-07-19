import { actionCreator, actionCreatorVoid } from './helpers';
import { YakapaMessage } from '../api/yakapaClient';

export interface YakapaClientError extends Partial<Error> {
  type?: string
 }

export class YakapaClient {
  public static readonly connected = actionCreatorVoid('yakapaClient/CONNECTED');
  public static readonly connectionError = actionCreator<YakapaClientError>('yakapaClient/CONNECTION_ERROR');
  public static readonly socketError = actionCreator<YakapaClientError>('yakapaClient/SOCKET_ERROR');
  public static readonly authenticated = actionCreator<YakapaMessage>('yakapaClient/AUTHENTICATED');  
}