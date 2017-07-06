import * as actions from '../actions/chat';
import { YakapaClient } from '../api/yakapa/client';
 
let client: YakapaClient

export function yakapaClientMiddleware(store: Store<any>) {
  return next => action => {
    const result = next(action);
 
    if (socket && action.type === actions.ADD_MESSAGE) {
      let messages = store.getState().messages;
      socket.emit('message', messages[messages.length -1]);
    }
 
    return result;
  };
}
 
export default function (store) {
  socket = io.connect(`${location.protocol}//${location.host}`);
 
  socket.on('message', data => {
    store.dispatch(actions.addResponse(data));
  });
}