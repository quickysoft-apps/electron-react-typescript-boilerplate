

export class Ipc {

  private _listeners: Map<string, Function> = new Map<string, Function>();
  private _ipc: Electron.IpcRenderer;

  constructor(ipc: Electron.IpcRenderer) {
    this._ipc = ipc;
  }

  addListener(jobId: string, event: string, listener: Function): void {
    const key = `${jobId}_${event}`;
    if (!this._listeners.has(key)) {
      this._listeners.set(key, listener);
      this._ipc.on(event, listener)
    }
  }

  clearListeners(jobId: string): void {
    this._listeners.forEach((value, key) => {
      if (key.substring(0, jobId.length) === jobId) {
        this._ipc.removeListener(key, value);
      }
    });
  }

  send(channel: string, ...args: any[]): void {
    this._ipc.send(channel, args[0]);
  }

}