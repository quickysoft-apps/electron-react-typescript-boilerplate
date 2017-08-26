export class Ipc {

    private _listeners: Map<string, Function> = new Map<string, Function>();
    private _ipc: Electron.IpcRenderer;

    constructor(ipc: Electron.IpcRenderer) {
        this._ipc = ipc;
    }

    addListener(event: string, listener: Function): void {
        if (!this._listeners.has(event)) {
            this._listeners.set(event, listener);
            this._ipc.on(event, listener)
        }
    }

    clearListeners(): void {
        this._listeners.forEach((value, key) => {
            this._ipc.removeListener(key, value);
        });
        this._listeners.clear();
    }

    send(channel: string, ...args: any[]): void {
        this._ipc.send(channel, args[0]);
    }

}