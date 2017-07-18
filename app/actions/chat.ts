import { actionCreator } from './helpers';
import { YakapaMessage } from '../api/yakapaClient';

export class Chat {
  public static readonly receive = actionCreator<YakapaMessage>('chat/RECEIVE');
  public static readonly send = actionCreator<YakapaMessage>('chat/SEND');
}