import { Inject, Injectable, Logger } from "@nestjs/common";
import { OpenvpnEvent } from "openvpn-manager-nestjs/event-decorators";
// import { Logger } from "nestjs-pino";
import { registerOpenvpnListeners } from "openvpn-manager-nestjs/listener-register";
import {
  Cl,
  ConnectionClient,
} from "openvpn-manager-nestjs/event-responses.types";
import { OpenvpnService } from "openvpn-manager-nestjs/openvpn-mngr-ts.service";

@Injectable()
export class OpenvpnControllerDecorators {
  // You can use Nest.js built-in logger or your custom implementation
  private readonly logger = new Logger(OpenvpnControllerDecorators.name);

  constructor(
    // You can also inject a logger using @Inject() if you prefer dependency injection
    // @Inject() private readonly logger: Logger,

    // OpenvpnService is used to access the event emitter.
    // It's optional — you can use your own emitter instead if you need full control.
    @Inject() private readonly OpenvpnService: OpenvpnService,
  ) {
    // Registers all listeners decorated with @OpenvpnEvent
    registerOpenvpnListeners(this, this.OpenvpnService.emitter);
  }

  @OpenvpnEvent("client:list", { once: true })
  handleClientList(client: Cl[]) {
    this.logger.log(`Client connected: ${client[0].clientID}`);
  }

  @OpenvpnEvent("client:connection")
  handleClientConnect(client: ConnectionClient) {
    this.logger.log(`Client connected: ${client.n_clients}`);
  }

  @OpenvpnEvent("client:disconnect")
  handleClientDisconnect(client: string[]) {
    this.logger.warn(`Client disconnected: ${client[0]}`);
  }
}
