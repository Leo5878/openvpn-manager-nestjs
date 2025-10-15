import { EventEmitter } from "node:events";
import { Injectable, Inject } from "@nestjs/common";
import { OpenvpnManager, CustomEventType, Connect } from "@ad0nis/openvpn-manager";
import { OPENVPN_OPTIONS } from "./openvpn.constants";
import { NestLoggerAdapter } from "./logger.adapter";

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
  public instances: Map<string, OpenvpnManager> = new Map();
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
        new OpenvpnManager(
          { id, host, port },
          { emitter, logger: this.logger },
        ),
      ),
    );
  }

  // метод для доступа к конкретному клиенту, если понадобится
  getClient(id: string): OpenvpnManager | undefined {
    return this.instances.get(id);
  }
}
