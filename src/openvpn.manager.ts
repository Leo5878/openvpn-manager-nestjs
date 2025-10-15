import {
  Inject,
  Injectable,
  OnApplicationBootstrap,
  Logger,
} from "@nestjs/common";
import { OpenvpnService } from "./openvpn-mngr-ts.service";

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
