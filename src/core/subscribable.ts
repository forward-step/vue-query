type Listener = () => void;

/**
 * 事件的订阅处理中心
 */
export class Subscribable<TListener extends Function = Listener> {
    protected listeners: TListener[];

    constructor() {
        this.listeners = [];
    }

    subscribe(listener?: TListener): () => void {
        const callback = listener || (() => undefined);

        this.listeners.push(callback as TListener);

        this.onSubscribe();

        return () => {
            this.listeners = this.listeners.filter((x) => x !== callback);
            this.onUnsubscribe();
        };
    }

    hasListeners(): boolean {
        return this.listeners.length > 0;
    }

    //#region 生命周期函数
    protected onSubscribe(): void {
        // Do nothing
    }

    protected onUnsubscribe(): void {
        // Do nothing
    }
    //#endregion
}
