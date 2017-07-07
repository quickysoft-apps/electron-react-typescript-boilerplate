import { actionCreator } from './helpers';
import { YakapaMessage } from '../api/yakapa/yakapaClient';

export const receive = actionCreator<YakapaMessage>('chat/RECEIVE');
export const send = actionCreator<YakapaMessage>('chat/SEND');