import { YakapaMessage } from '../api/yakapa/yakapaClient'

export class ChatHistory {

  readonly history: Set<YakapaMessage> = new Set<YakapaMessage>();

  constructor(chatHistory?: ChatHistory, chatMessage?: YakapaMessage) {
    if (chatHistory !== undefined) {
      this.history = new Set<YakapaMessage>(chatHistory.history);
    }
    if (chatMessage !== undefined) {
      this.history.add(chatMessage);
    }
  }

}