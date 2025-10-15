import {
  Inject,
  Injectable,
  OnApplicationBootstrap,
  Logger,
} from "@nestjs/common";
import { OpenvpnService } from "@app/openvpn-mngr-ts/openvpn-manager-nestjs/openvpn-mngr-ts.service";
import {
  Cl,
  ClientDisconnect,
  ConnectionClient,
} from "@ad0nis/openvpn-manager";

@Injectable()
export class OpenvpnControllerEmitter implements OnApplicationBootstrap {
  constructor(
    @Inject() private readonly OpenvpnService: OpenvpnService,
    @Inject() private readonly logger: Logger,
  ) {}

  onApplicationBootstrap() {
    const emitter = this.OpenvpnService.emitter;

    // Specifying types is optional — your IDE can infer them automatically.
    // Types are included here only for clarity and demonstration purposes.
    // You don't need to explicitly declare them in production.
    emitter.on("client:connection", async (clientList: ConnectionClient) => {
      // to code
    });

    emitter.on("client:disconnect", async (client: ClientDisconnect) => {
      // to code
    });

    emitter.once("client:list", async (clients: Cl[]) => {
      for (const client of clients) {
        // to code
      }
    });
  }
}
