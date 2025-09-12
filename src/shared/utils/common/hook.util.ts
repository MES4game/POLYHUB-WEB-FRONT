import { useRef } from "react";
import { SmartRef } from "@/shared/models/common/hook.model";

export function useSmartRef<T>(init_value: T): SmartRef<T> {
    const ref = useRef<T>(init_value);
    const listeners = useRef<Set<(old?: T, current?: T) => void>>(new Set());

    function get (): T {
        return ref.current;
    };

    function set (value: T): void {
        if (ref.current !== value) {
            ref.current = value;
            listeners.current.forEach((callback: (old?: T, current?: T) => void) => { callback() });
        }
    };

    function subscribe (callback: (old?: T, current?: T) => void): () => void {
        listeners.current.add(callback);
        return () => { listeners.current.delete(callback) };
    };

    return { get, set, subscribe };
}
