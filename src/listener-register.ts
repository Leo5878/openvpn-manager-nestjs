import { EventEmitter } from "node:events";
import { CustomEventType } from "@openvpn-manager/event-responses.types";

export function registerOpenVpnListeners(
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
