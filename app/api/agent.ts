import * as Log from 'electron-log';
import * as io from 'socket.io-client';
import * as LZString from 'lz-string';
import * as UUID from 'uuid';
import settings = require('electron-settings');
import { IEvent, ISignal, ISimpleEvent, SignalDispatcher, EventDispatcher, SimpleEventDispatcher } from 'strongly-typed-events';

const SOCKET_SERVER_URL = 'https://mprj.cloudapp.net';

export class AgentEvent {
  private static readonly PREFIX: string = 'yakapa';
  public static readonly CHAT: string = `${AgentEvent.PREFIX}/chat`;
  public static readonly RESULT: string = `${AgentEvent.PREFIX}/result`;
  public static readonly EXECUTE: string = `${AgentEvent.PREFIX}/execute`;
  public static readonly AUTHENTICATED: string = `${AgentEvent.PREFIX}/authenticated`;
  public static readonly ASSOCIATING: string = `${AgentEvent.PREFIX}/associating`;
  public static readonly ASSOCIATED: string = `${AgentEvent.PREFIX}/associated`;
}

export interface AgentMessage {
  date: Date;
  from: string;
  nickname: string;
  to: string;
  message: string;
}

export class AgentConfiguration {

  public get tag(): string {
    const value = settings.get('tag', UUID.v4());
    return value as string;
  }

  public get nickname(): string | null {
    const value = settings.get('nickname');
    return value ? value as string : null;
  }

  public set nickname(value: string | null) {
    settings.set('nickname', value);
  }

  public get email(): string | null {
    const value = settings.get('email');
    return value ? value as string : null;
  }

  public set email(value: string | null) {
    settings.set('email', value);
  }

}

export class Agent {

  private _socket: SocketIOClient.Socket;
  private _isAuthenticated: boolean = false;
  
  private _configuration: AgentConfiguration = new AgentConfiguration();
  public get configuration() : AgentConfiguration {
    return this._configuration;
  }

  private _onChat = new EventDispatcher<Agent, AgentMessage>();
  public get onChat(): IEvent<Agent, AgentMessage> {
    return this._onChat.asEvent();
  }

  private _onAuthenticated = new EventDispatcher<Agent, AgentMessage>();
  public get onAuthenticated(): IEvent<Agent, AgentMessage> {
    return this._onAuthenticated.asEvent();
  }

  private _onConnected = new SignalDispatcher();
  public get onConnected(): ISignal {
    return this._onConnected.asEvent();
  }

  private _onConnectionError = new SimpleEventDispatcher<Error>();
  public get onConnectionError(): ISimpleEvent<Object> {
    return this._onConnectionError.asEvent();
  }

  private _onSocketError = new SimpleEventDispatcher<Error>();
  public get onSocketError(): ISimpleEvent<Object> {
    return this._onSocketError.asEvent();
  }

  private _onPong = new SimpleEventDispatcher<number>();
  public get onPong(): ISimpleEvent<number> {
    return this._onPong.asEvent();
  }

  constructor() {

    this._socket = io(SOCKET_SERVER_URL, {
      rejectUnauthorized: false,
      query: `tag=${this._configuration.tag}`
    });

    this._socket.on('pong', (ms: number) => { this._onPong.dispatch(ms) })
    this._socket.on('connect', () => { this.connected() })
    this._socket.on('connect_error', (error: Error) => { this.connectionError(error) })
    this._socket.on('error', (error: Error) => { this.socketError(error) })

    this._socket.on(AgentEvent.AUTHENTICATED, (socketMessage: AgentMessage) => { this.authenticated(socketMessage) })
    this._socket.on(AgentEvent.CHAT, async (socketMessage: AgentMessage) => { await this.chat(socketMessage) })
    this._socket.on(AgentEvent.EXECUTE, async (socketMessage: AgentMessage) => { await this.execute(socketMessage) })
  }

  public emit(event: string = AgentEvent.RESULT, payload?: string, to?: string): void {

    const compressed = payload != null ? LZString.compressToUTF16(payload) : null
    const socketMessage = {
      date: new Date(Date.now()),
      from: this._configuration.tag,
      nickname: this._configuration.nickname,
      email: this._configuration.email,
      to: to,
      message: compressed
    }

    this._socket.emit(event, socketMessage)
  }

  private check(socketMessage: AgentMessage): boolean {

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

  private connected(): void {
    Log.info('Connecté à', SOCKET_SERVER_URL)
    this._onConnected.dispatch();
  }

  private socketError(error: Error): void {
    Log.error('Erreur socket :', error)
    this._onSocketError.dispatch(error);
  }

  private connectionError(error: Error): void {
    Log.error('Erreur connexion :', error.message)
    this._onConnectionError.dispatch(error);
  }

  private authenticated(socketMessage: AgentMessage): void {
    this._isAuthenticated = true;
    if (this._configuration.nickname) {
      socketMessage.nickname = this._configuration.nickname;
    } else {
      this._configuration.nickname = socketMessage.nickname;
    }
    Log.info('Bienvenue', this._configuration.nickname);
    this._onAuthenticated.dispatch(this, socketMessage);
  }

  private async chat(socketMessage: AgentMessage): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (!this.check(socketMessage)) reject();
      const decompressed = LZString.decompressFromUTF16(socketMessage.message);
      Log.info(`Received chat message ${decompressed}`);
      //const emitter = socketMessage.From;
      //this.emit(SocketEvent.CHAT_MESSAGE, Faker.lorem.sentence(15), emitter);
      this._onChat.dispatch(this, socketMessage);
      resolve();
    });
  }

  private execute(socketMessage: AgentMessage): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      resolve();
    });
  }

}
