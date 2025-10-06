import { Inject, Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { OpenvpnService } from "@app/openvpn-mngr-ts/openvpn-manager-nestjs/openvpn-mngr-ts.service";
import { Logger } from "nestjs-pino";

@Injectable()
export class OpenvpnManager implements OnApplicationBootstrap {
  constructor(
    @Inject() private clients: OpenvpnService,
    @Inject() private readonly logger: Logger,
  ) {}
  async onApplicationBootstrap() {
    for (const c of this.clients.instances.values()) {
      try {
        await c.connect();
      } catch (e) {
        this.logger.error(e);
      }
    }
  }
  async onModuleDestroy() {
    for (const c of this.clients.instances.values()) await c.shutdown();
  }
  getClient(id: string) {
    return this.clients.instances.get(id);
  }
}
