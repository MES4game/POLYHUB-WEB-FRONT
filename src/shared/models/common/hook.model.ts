export interface SmartRef<T> {
    get: () => T;
    set: (value: T) => void;
    subscribe: (callback: () => void) => () => void;
}
