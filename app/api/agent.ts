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
  public static readonly EXECUTE_SCRIPT: string = `${AgentEvent.PREFIX}/executescript`;
  public static readonly AUTHENTICATION: string = `${AgentEvent.PREFIX}/authentication`;
  public static readonly AUTHENTICATED: string = `${AgentEvent.PREFIX}/authenticated`;
}

export interface AgentMessage {
  date: Date;
  from: string;
  nickname: string;
  message: string;
}

export class Agent {

  private _socket: SocketIOClient.Socket;
  private _isAuthenticated: boolean = false;
  private _nickname: string;
  private _tag: string;

  private _onChatMessageReceived = new EventDispatcher<Agent, AgentMessage>();
  public get onChatMessageReceived(): IEvent<Agent, AgentMessage> {
    return this._onChatMessageReceived.asEvent();
  }

  private _onAuthenticatedMessageReceived = new EventDispatcher<Agent, AgentMessage>();
  public get onAuthenticatedMessageReceived(): IEvent<Agent, AgentMessage> {
    return this._onAuthenticatedMessageReceived.asEvent();
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
  public get onSocketErrorMessageReceived(): ISimpleEvent<Object> {
    return this._onSocketError.asEvent();
  }

  private _onPong = new SimpleEventDispatcher<number>();
  public get onPong(): ISimpleEvent<number> {
    return this._onPong.asEvent();
  }

  constructor() {

    this.updateUserData();

    this._socket = io(SOCKET_SERVER_URL, {
      rejectUnauthorized: false,
      query: `tag=${this._tag}`
    });

    this._socket.on('ping', () => { Log.debug('ping') })
    this._socket.on('pong', (ms: number) => { this._onPong.dispatch(ms) })
    this._socket.on('connect_timeout', (attempt: number) => { Log.debug('connect_timeout') })
    this._socket.on('reconnect_attempt', (attempt: number) => { Log.debug('reconnect_attempt') })
    this._socket.on('reconnecting', (attempt: number) => { Log.debug('reconnecting n.', attempt) })
    this._socket.on('reconnect_error', (error: Object) => { Log.debug('reconnect_error', error) })
    this._socket.on('reconnect_failed', (attempt: number) => { Log.debug('reconnect_failed') })
    this._socket.on('connect', () => { this.connected() })
    this._socket.on('connect_error', (error: Error) => { this.connectionError(error) })
    this._socket.on('error', (error: Error) => { this.socketError(error) })
    this._socket.on('disconnect', (reason: string) => { Log.debug('disconnect:', reason) })
    this._socket.on('reconnect', (attempt: number) => { Log.debug('reconnect') })

    this._socket.on(AgentEvent.AUTHENTICATED, (socketMessage: AgentMessage) => { this.authenticated(socketMessage) })
    this._socket.on(AgentEvent.CHAT, async (socketMessage: AgentMessage) => { await this.understand(socketMessage) })
    this._socket.on(AgentEvent.EXECUTE_SCRIPT, async (socketMessage: AgentMessage) => { await this.executeScript(socketMessage) })
  }

  public emit(event: string = AgentEvent.RESULT, payload?: string, to?: string): void {

    this.updateUserData();

    const compressed = payload != null ? LZString.compressToUTF16(payload) : null
    const socketMessage = {
      from: this._tag,
      nickname: this._nickname,
      to: to,
      result: event === AgentEvent.RESULT ? compressed : null,
      message: event === AgentEvent.CHAT ? compressed : null
    }

    this._socket.emit(event, socketMessage)
  }

  /*private getJson(json: any): any {
    return typeof json === 'object' ? json : JSON.parse(json)
  }*/

  private updateUserData() {
    this._tag = settings.get('tag', UUID.v4()) as string;
    this._nickname = settings.get('nickname') as string;    
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
    //this.emit(YakapaEvent.AUTHENTICATION)
    this._onConnected.dispatch();
  }

  private socketError(error: Error): void {
    Log.info('error', error)
    //this.emit(YakapaEvent.AUTHENTICATION)
    this._onSocketError.dispatch(error);
  }

  private connectionError(error: Error): void {
    Log.info('Erreur connexion', error)
    //this.emit(YakapaEvent.AUTHENTICATION)
    this._onConnectionError.dispatch(error);
  }

  private authenticated(socketMessage: AgentMessage): void {
    Log.info('Bienvenue', socketMessage.nickname);
    this._isAuthenticated = true;
    this._nickname = socketMessage.nickname;
    settings.set('nickname', this._nickname);
    this._onAuthenticatedMessageReceived.dispatch(this, socketMessage);
  }

  private async understand(socketMessage: AgentMessage): Promise<void> {
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

  private executeScript(socketMessage: AgentMessage): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      resolve();
    });
  }

}
