import { Injectable, Inject } from "@nestjs/common";
import { EventEmitter } from "node:events";
import { OpenvpnApi } from "@app/openvpn-mngr-ts/openvpn-manager/openvpn-api";
import { Connect } from "@app/openvpn-mngr-ts/openvpn-manager/core";
import { OPENVPN_OPTIONS } from "./openvpn.constants";
import { CustomEventType } from "@openvpn-manager/event-responses.types";
import { NestLoggerAdapter } from "@app/openvpn-mngr-ts/openvpn-manager-nestjs/logger.adapter";

export interface OpenvpnServiceOptions {
  connections: Array<Connect>;
  emitter?: EventEmitter<CustomEventType>;
  statusInterval?: number;
  debug?: boolean;
  reconnect?: "always" | "never" | "manual";
}

// TODO rename to manager
@Injectable()
export class OpenvpnService {
  public instances: Map<string, OpenvpnApi> = new Map();
  public emitter: EventEmitter<CustomEventType>;

  constructor(
    @Inject(OPENVPN_OPTIONS) private options: OpenvpnServiceOptions,
    @Inject() private readonly logger: NestLoggerAdapter,
  ) {
    const emitter = this.options.emitter ?? new EventEmitter<CustomEventType>();

    this.emitter = emitter;
    this.options.connections.forEach(({ id, host, port }) =>
      this.instances.set(
        id,
        new OpenvpnApi({ id, host, port }, { emitter, logger: this.logger }),
      ),
    );
  }

  // метод для доступа к конкретному клиенту, если понадобится
  getClient(id: string): OpenvpnApi | undefined {
    return this.instances.get(id);
  }
}
