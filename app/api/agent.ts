import * as Log from 'electron-log';
import * as io from 'socket.io-client';
import * as LZString from 'lz-string';
import * as uuid from 'uuid';
import settings = require('electron-settings');
import { JsonValue } from '../utils/jsonTypes';
import { IEvent, ISignal, ISimpleEvent, SignalDispatcher, EventDispatcher, SimpleEventDispatcher } from 'strongly-typed-events';

const SOCKET_SERVER_URL: string = 'https://mprj.cloudapp.net';

export class AgentEvent {
  public static readonly PREFIX: string = 'yakapa';
  public static readonly CHAT: string = `${AgentEvent.PREFIX}/chat`;
  public static readonly STORE: string = `${AgentEvent.PREFIX}/store`;
  public static readonly EXECUTE: string = `${AgentEvent.PREFIX}/execute`;
  public static readonly READY: string = `${AgentEvent.PREFIX}/ready`;
  public static readonly CONFIGURED: string = `${AgentEvent.PREFIX}/configured`;
  public static readonly REMOTE_CHANGE_CONFIGURATION: string = `${AgentEvent.PREFIX}/remoteChangeConfiguration`;
}

export interface IAgentMessage {
  date: Date;
  from?: string;
  nickname?: string;
  to?: string;
  email?: string;
  message?: string;
}

export interface IAgentConfiguration {
  tag?: string;
  email?: string;
  nickname?: string;
}

export class AgentConfiguration implements IAgentConfiguration {

  public get tag(): string | undefined {
    const value: JsonValue = settings.get('tag', uuid.v4());
    return value ? value as string : undefined;
  }

  public get nickname(): string | undefined {
    const value: JsonValue = settings.get('nickname');
    return value ? value as string : undefined;
  }

  public set nickname(value: string | undefined) {
    if (value) {
      settings.set('nickname', value);
    }
  }

  public get email(): string | undefined {
    const value: JsonValue = settings.get('email');
    return value ? value as string : undefined;
  }

  public set email(value: string | undefined) {
    if (value) {
      settings.set('email', value);
    }
  }

}

export class Agent {

  private _socket: SocketIOClient.Socket;
  private _isReady: boolean = false;

  private _configuration: AgentConfiguration = new AgentConfiguration();
  public get configuration(): AgentConfiguration {
    return this._configuration;
  }

  private _onChat: EventDispatcher<Agent, IAgentMessage> = new EventDispatcher<Agent, IAgentMessage>();
  public get onChat(): IEvent<Agent, IAgentMessage> {
    return this._onChat.asEvent();
  }

  private _onReady: EventDispatcher<Agent, IAgentMessage> = new EventDispatcher<Agent, IAgentMessage>();
  public get onReady(): IEvent<Agent, IAgentMessage> {
    return this._onReady.asEvent();
  }

  private _onConnected: SignalDispatcher = new SignalDispatcher();
  public get onConnected(): ISignal {
    return this._onConnected.asEvent();
  }

  private _onConnectionError: SimpleEventDispatcher<Error> = new SimpleEventDispatcher<Error>();
  public get onConnectionError(): ISimpleEvent<object> {
    return this._onConnectionError.asEvent();
  }

  private _onSocketError: SimpleEventDispatcher<Error> = new SimpleEventDispatcher<Error>();
  public get onSocketError(): ISimpleEvent<object> {
    return this._onSocketError.asEvent();
  }

  private _onPong: SimpleEventDispatcher<number> = new SimpleEventDispatcher<number>();
  public get onPong(): ISimpleEvent<number> {
    return this._onPong.asEvent();
  }

  private _onRemoteChangeConfiguration: SimpleEventDispatcher<IAgentConfiguration> = new SimpleEventDispatcher<IAgentConfiguration>();
  public get onRemoteChangeConfiguration(): ISimpleEvent<IAgentConfiguration> {
    return this._onRemoteChangeConfiguration.asEvent();
  }

  constructor() {

    this._socket = io(SOCKET_SERVER_URL, {
      rejectUnauthorized: false,
      query: `tag=${this._configuration.tag}`
    });

    this._socket.on('pong', (ms: number) => { this._onPong.dispatch(ms); });
    this._socket.on('connect', () => { this.connected(); });
    this._socket.on('connect_error', (error: Error) => { this.connectionError(error); });
    this._socket.on('error', (error: Error) => { this.socketError(error); });

    this._socket.on(AgentEvent.READY, (socketMessage: IAgentMessage) => { this.ready(socketMessage); });
    this._socket.on(AgentEvent.CHAT, async (socketMessage: IAgentMessage) => { await this.chat(socketMessage); });
    this._socket.on(AgentEvent.EXECUTE, async (socketMessage: IAgentMessage) => { await this.execute(socketMessage); });
    this._socket.on(AgentEvent.REMOTE_CHANGE_CONFIGURATION, async (socketMessage: IAgentMessage) => { await this.changeConfiguration(socketMessage); });
  }

  public emit(event: string = AgentEvent.STORE, payload?: string, to?: string): void {

    const compressed: string | undefined = payload != null ? LZString.compressToUTF16(payload) : undefined;
    const socketMessage: IAgentMessage = {
      date: new Date(Date.now()),
      from: this._configuration.tag,
      nickname: this._configuration.nickname,
      email: this._configuration.email,
      to,
      message: compressed
    };

    this._socket.emit(event, socketMessage);
  }

  private check(socketMessage: IAgentMessage): boolean {

    if (this._isReady === false) {
      Log.warn(`Je ne peux rien faire car je ne suis pas prêt !`);
      return false;
    }

    if (socketMessage == null) {
      Log.warn(`Pas de message à traiter ?!`);
      return false;
    }

    if (socketMessage.from == null) {
      Log.warn(`Je ne veux pas recevoir des demandes provenant d'un expéditeur non défini !'`);
      return false;
    }

    Log.info(socketMessage);
    return true;
  }

  private connected(): void {
    Log.info('Connecté à', SOCKET_SERVER_URL);
    this._onConnected.dispatch();
  }

  private socketError(error: Error): void {
    Log.error('Erreur socket :', error);
    this._onSocketError.dispatch(error);
  }

  private connectionError(error: Error): void {
    Log.error('Erreur connexion :', error.message);
    this._onConnectionError.dispatch(error);
  }

  private ready(socketMessage: IAgentMessage): void {
    this._isReady = true;
    if (this._configuration.nickname) {
      socketMessage.nickname = this._configuration.nickname;
    } else {
      this._configuration.nickname = socketMessage.nickname;
    }
    Log.info('Bienvenue', this._configuration.nickname);
    this._onReady.dispatch(this, socketMessage);
  }

  private async chat(socketMessage: IAgentMessage): Promise<void> {
    return new Promise<void>((resolve: VoidFunction, reject: VoidFunction): void => {
      if (!this.check(socketMessage)) {
        reject();
      }

      if (socketMessage.message) {
        const decompressed: string = LZString.decompressFromUTF16(socketMessage.message);
        Log.info(`Received chat message ${decompressed}`);
        // const emitter = socketMessage.From;
        // this.emit(SocketEvent.CHAT_MESSAGE, Faker.lorem.sentence(15), emitter);
        this._onChat.dispatch(this, socketMessage);
        resolve();
      }
    });
  }

  private execute(socketMessage: IAgentMessage): Promise<void> {
    return new Promise<void>((resolve: VoidFunction, reject: VoidFunction): void => {
      resolve();
    });
  }

  private changeConfiguration(socketMessage: IAgentMessage): Promise<void> {
    return new Promise<void>((resolve: VoidFunction, reject: VoidFunction): void => {
      if (!this.check(socketMessage)) {
        reject();
      }
      if (socketMessage.message) {
        const decompressed = LZString.decompressFromUTF16(socketMessage.message);
        const configuration = JSON.parse(decompressed) as IAgentConfiguration;
        Log.info(`Received configuration message ${decompressed}`);
        if (configuration) {
          this._onRemoteChangeConfiguration.dispatch(configuration);
        } else {
          Log.warn(`Received wrong configuration message (unexpected property): ${decompressed}`);
        }
        resolve();
      }
    });
  }
}
