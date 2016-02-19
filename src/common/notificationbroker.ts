

export class NotificationBroker<TEnum extends number> {
    
    private subscriptions: {};
    
    constructor() {
        this.subscriptions = {};
    }
    
    publish(identity: TEnum, data: any) {
        const list = this.subscriptions[<number>identity];
        if (list) {
            list.forEach(callback => callback(data));
        }
    }
    
    subscribe(identity: TEnum, callback: (arg: any) => void) {
        const list = this.subscriptions[<number>identity] || [];
        list.push(callback);
        this.subscriptions[<number>identity] = list;
    }
}



export class Notification<TEnum extends number, TArg> {
    constructor(private broker: NotificationBroker<TEnum>, private identity: TEnum) {
        
    }
    publish(data?: TArg) {
        this.broker.publish(this.identity, data);
    }
    
    subscribe(callback: (arg?:TArg) => void) {
        return this.broker.subscribe(this.identity, callback);
    }
}