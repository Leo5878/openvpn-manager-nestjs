import { EventEmitter } from "node:events";
import type { CustomEventType } from "@ad0nis/openvpn-manager";

export function registerOpenvpnListeners(
  instance: any,
  emitter: EventEmitter<CustomEventType>,
) {
  const listeners =
    Reflect.getMetadata("openvpn:listeners", instance.constructor) || [];
  for (const { eventName, methodName, once } of listeners) {
    const handler = (...args: unknown[]) => instance[methodName](...args);
    once ? emitter.once(eventName, handler) : emitter.on(eventName, handler);
  }
}
