import { actionCreator } from './helpers';
import { YakapaMessage } from '../api/yakapaClient';

export class YakapaClient {
  public static readonly connected = actionCreator<YakapaMessage>('yakapaClient/CONNECTED');
  public static readonly connectionError = actionCreator<YakapaMessage>('yakapaClient/CONNECTION_ERROR');
  public static readonly authenticated = actionCreator<YakapaMessage>('yakapaClient/AUTHENTICATED');  
}