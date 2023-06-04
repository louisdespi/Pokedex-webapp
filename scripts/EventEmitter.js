const handlers = Symbol.for("handlers");

class EventEmitter {
    constructor() {
        this[handlers] = new Map;
    }
    on(name, handler) {
        if(!this[handlers].has(name)) {
            this[handlers].set(name, [handler]);
        } else {
            this[handlers].get(name).push(handler);
        }
    }
    trigger(name, ...args) {
        for(const handler of this[handlers].get(name) || [])
        handler(...args);
    }
}
