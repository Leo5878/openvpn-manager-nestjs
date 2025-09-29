import { Inject, Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { OpenvpnService } from "@app/openvpn-mngr-ts/openvpn-manager-nestjs/openvpn-mngr-ts.service"

@Injectable()
export class OpenvpnManager implements OnApplicationBootstrap {
  constructor(@Inject() private clients: OpenvpnService) {}
  async onApplicationBootstrap() {
    for (const c of this.clients.instances.values()) {
      await c.connect();
    }
  }
  async onModuleDestroy() {
    for (const c of this.clients.instances.values()) await c.shutdown();
  }
  getClient(id: string) {
    return this.clients.instances.get(id);
  }
}
