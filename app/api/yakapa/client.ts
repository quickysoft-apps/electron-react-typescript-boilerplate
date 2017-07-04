import * as Log from 'electron-log';
import * as SocketIo from 'socket.io-client';
import * as LZString from 'lz-string';
import * as Faker from 'faker';
import Events from './events';

const SOCKET_SERVER_URL = 'https://mprj.cloudapp.net'

interface SocketMessage {
  From: string;
  Nickname: string;
  Message: string;
}

export class YakapaClient {
  private _socket: SocketIOClient.Socket;
  private _isAuthenticated: boolean = false;
  private _nickname: string;

  constructor() {
    this._socket = SocketIo.connect(SOCKET_SERVER_URL, { reconnection: true });
    this._socket.on('connect', () => { this.connect() })
    this._socket.on(Events.AUTHENTICATED, (socketMessage: SocketMessage) => { this.authenticate(socketMessage) })
    this._socket.on(Events.CHAT, async (socketMessage: SocketMessage) => { await this.understand(socketMessage) })
    this._socket.on(Events.EXECUTE_SCRIPT, async (socketMessage: SocketMessage) => { await this.executeScript(socketMessage) })
  }

  getJson(json: any): any {
    return typeof json === 'object' ? json : JSON.parse(json)
  }

  private check(socketMessage: SocketMessage): boolean {

    if (this._isAuthenticated === false) {
      Log.warn(`Je ne peux rien faire car je ne suis pas authentifié !`)
      return false
    }

    if (socketMessage == null) {
      Log.warn(`Pas de message à traiter ?!`)
      return false
    }

    if (socketMessage.From == null) {
      Log.warn(`Je ne veux pas recevoir des demandes provenant d'un expéditeur non défini !'`)
      return false
    }

    Log.info(socketMessage);
    return true
  }

  private emit(event: string = Events.RESULT, payload?: string, to?: string): void {
    const compressed = payload != null ? LZString.compressToUTF16(payload) : null

    const socketMessage = {
      From: 'TODO-TAG',
      FromNickname: 'TODO-nickname',
      To: to,
      Result: event === Events.RESULT ? compressed : null,
      Message: event === Events.CHAT ? compressed : null
    }

    this._socket.emit(event, socketMessage)
  }

  private connect(): void {
    Log.info('Connecté à', SOCKET_SERVER_URL)
    this.emit(Events.AUTHENTICATION)
  }

  private authenticate(socketMessage: SocketMessage): void {
    this._isAuthenticated = true;
    this._nickname = socketMessage.Nickname;
    Log.info(socketMessage);
  }

  private async understand(socketMessage: SocketMessage): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (!this.check(socketMessage)) reject();
      const decompressed = LZString.decompressFromUTF16(socketMessage.Message);
      Log.info(`Received chat message ${decompressed}`);
      const emitter = socketMessage.From;
      this.emit(Events.CHAT, Faker.lorem.sentence(15), emitter);
      resolve();
    });
  }

  private executeScript(socketMessage: SocketMessage): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      resolve();
    });
  }

}