

export interface CommandDefinition<T, R> {
    execute: (arg: T) => void | Promise<R>;
    canExecute?: (arg: T) => boolean;
}

export class CommandBroker<TEnum extends number> {
    
    private commands: {};
    
    constructor(private identityToString: (identity: TEnum) => string) {
        this.commands = {};
    }
    
    define(identity: TEnum, commandDefinition: CommandDefinition<any, any>) {
        if (this.commands[<number>identity]) {
            throw new Error(`The command ${this.identityToString(identity)} is already defined`);
        }
        
        this.commands[<number>identity] = commandDefinition;
    }
    
    execute(identity: TEnum, arg: any) {
        const definition = this.commands[<number>identity];
        if (definition) {
            const res = definition.execute(arg);
            return res || Promise.resolve();
        } else {
            throw new Error(`The command ${this.identityToString(identity)} is not defined`);
        }
    }
    
    canExecute(identity: TEnum, arg: any) {
        const definition = this.commands[<number>identity];
        if (definition) {            
            return definition.canExecute ? definition.canExecute(arg) : true;
        } else {
            console.warn(`No command defined for ${this.identityToString(identity)}`);
            return false;
        }
    }
}

export class Command<TEnum extends number, TArg, TRes> {
    constructor(private broker: CommandBroker<TEnum>, private identity: TEnum) {
        
    }
    
    define(commandDefinition: CommandDefinition<TArg, TRes>) {
        this.broker.define(this.identity, commandDefinition);
    }
    
    execute(arg: TArg) : Promise<TRes> {
        return this.broker.execute(this.identity, arg);
    }
    
    canExecute(arg: TArg) {
        return this.broker.canExecute(this.identity, arg);
    }
}