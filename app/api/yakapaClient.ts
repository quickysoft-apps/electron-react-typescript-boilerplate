import * as Log from 'electron-log';
import * as SocketIo from 'socket.io-client';
import * as LZString from 'lz-string';
//import * as Faker from 'faker';
import { IEvent, EventDispatcher } from 'strongly-typed-events';

const SOCKET_SERVER_URL = 'https://mprj.cloudapp.net'

export interface YakapaMessage {
  date: Date;
  from: string;
  nickname: string;
  message: string;
}

export class YakapaEvent {
  private static readonly PREFIX: string = 'yakapa';
  public static readonly CHAT: string = `${YakapaEvent.PREFIX}/chat`;
  public static readonly RESULT: string = `${YakapaEvent.PREFIX}/result`;
  public static readonly EXECUTE_SCRIPT: string = `${YakapaEvent.PREFIX}/executescript`;
  public static readonly AUTHENTICATION: string = `${YakapaEvent.PREFIX}/authentication`;
  public static readonly AUTHENTICATED: string = `${YakapaEvent.PREFIX}/authenticated`;
}

export class YakapaClient {

  private _socket: SocketIOClient.Socket;
  private _isAuthenticated: boolean = false;
  private _nickname: string;
  private _onChatMessageReceived = new EventDispatcher<YakapaClient, YakapaMessage>();

  constructor() {
    this._socket = SocketIo.connect(SOCKET_SERVER_URL, { reconnection: true });
    this._socket.on('connect', () => { this.connect() })
    this._socket.on(YakapaEvent.AUTHENTICATED, (socketMessage: YakapaMessage) => { this.authenticate(socketMessage) })
    this._socket.on(YakapaEvent.CHAT, async (socketMessage: YakapaMessage) => { await this.understand(socketMessage) })
    this._socket.on(YakapaEvent.EXECUTE_SCRIPT, async (socketMessage: YakapaMessage) => { await this.executeScript(socketMessage) })
  }

  getJson(json: any): any {
    return typeof json === 'object' ? json : JSON.parse(json)
  }

  private check(socketMessage: YakapaMessage): boolean {

    if (this._isAuthenticated === false) {
      Log.warn(`Je ne peux rien faire car je ne suis pas authentifié !`)
      return false
    }

    if (socketMessage == null) {
      Log.warn(`Pas de message à traiter ?!`)
      return false
    }

    if (socketMessage.from == null) {
      Log.warn(`Je ne veux pas recevoir des demandes provenant d'un expéditeur non défini !'`)
      return false
    }

    Log.info(socketMessage);
    return true
  }

  public emit(event: string = YakapaEvent.RESULT, payload?: string, to?: string): void {
    const compressed = payload != null ? LZString.compressToUTF16(payload) : null

    const socketMessage = {
      From: 'TODO-TAG',
      FromNickname: 'TODO-nickname',
      To: to,
      Result: event === YakapaEvent.RESULT ? compressed : null,
      Message: event === YakapaEvent.CHAT ? compressed : null
    }

    this._socket.emit(event, socketMessage)
  }

  private connect(): void {
    Log.info('Connecté à', SOCKET_SERVER_URL)
    this.emit(YakapaEvent.AUTHENTICATION)
  }

  private authenticate(socketMessage: YakapaMessage): void {
    this._isAuthenticated = true;
    this._nickname = socketMessage.nickname;
    Log.info(socketMessage);
  }

  private async understand(socketMessage: YakapaMessage): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (!this.check(socketMessage)) reject();
      const decompressed = LZString.decompressFromUTF16(socketMessage.message);
      Log.info(`Received chat message ${decompressed}`);
      //const emitter = socketMessage.From;
      //this.emit(SocketEvent.CHAT_MESSAGE, Faker.lorem.sentence(15), emitter);
      this._onChatMessageReceived.dispatch(this, socketMessage);
      resolve();
    });
  }

  private executeScript(socketMessage: YakapaMessage): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      resolve();
    });
  }

  public get onChatMessageReceived(): IEvent<YakapaClient, YakapaMessage> {
    return this._onChatMessageReceived.asEvent();
  }

}
