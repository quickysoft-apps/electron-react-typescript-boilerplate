import { actionCreator, actionCreatorVoid } from './helpers';
import { YakapaMessage } from '../api/yakapaClient';

export class YakapaClient {
  public static readonly connected = actionCreatorVoid('yakapaClient/CONNECTED');
  public static readonly connectionError = actionCreator<Error>('yakapaClient/CONNECTION_ERROR');
  public static readonly socketError = actionCreator<Error>('yakapaClient/SOCKET_ERROR');
  public static readonly authenticated = actionCreator<YakapaMessage>('yakapaClient/AUTHENTICATED');  
}