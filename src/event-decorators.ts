import { EventMap, Event } from "@ad0nis/openvpn-manager";

type EventKey = (typeof Event)[keyof typeof Event];

export function OpenvpnEvent<K extends EventKey>(
  eventName: K,
  options?: { once: boolean },
) {
  return function <T extends (payload: EventMap[K]) => void>(
    target: Object,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<T>,
  ): TypedPropertyDescriptor<T> {
    const existingListeners: (typeof target.constructor)[] | [] =
      Reflect.getMetadata("openvpn:listeners", target.constructor) ?? [];

    Reflect.defineMetadata(
      "openvpn:listeners",
      [
        ...existingListeners,
        { eventName, methodName: propertyKey, once: options?.once },
      ],
      target.constructor,
    );

    return descriptor;
  };
}
