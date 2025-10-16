# OpenVPN Manager NestJS

A NestJS integration module for [openvpn-manager](https://github.com/Leo5878/openvpn-manager).

This package provides dependency injection and module configuration for working with OpenVPN through `openvpn-manager-ts` in NestJS applications.

## Features

* Seamless integration with `openvpn-manager`
* Type-safe event handling
* Flexible configuration (supports async factories)
* Optional custom event emitter and logger injection


## Quick Start

To get started, register the module in your NestJS application:

> [!NOTE]
> For detailed setup instructions, refer to the original repository.
> The only difference here is how the **logger** is configured — see examples below.

## install
### npm
```bash
npm install @ad0nis/openvpn-manager-nestjs
```

### yarn
```bash
yarn add @ad0nis/openvpn-manager-nestjs
```

```ts
@Module({
  imports: [
    OpenvpnModuleImpl.forRootAsync({
      useFactory: () => {
        return {
          connections: [
            {
              id: "srv1",         // Server identifier (any string)
              host: "127.0.0.1",  // OpenVPN Manager host
              port: 7505,         // OpenVPN Manager port
              timeout: 5000,      // Connection timeout in ms (default: 5000)
            },
          ],
          event: emitter,         // Optional custom EventEmitter
        };
      },
    }),
  ],
})
export class AppModule {}
```

### Controller Integration

There are two main ways to handle OpenVPN events in NestJS:

1. Using **decorators**
2. Using **EventEmitter callbacks**

Both are valid; decorators provide a clean declarative style, while direct emitter usage offers more flexibility and type inference.


#### 1. Decorator approach

Full example: [examples/decorator](examples/decorator)

```ts
@Injectable()
export class OpenvpnController {
  private readonly logger = new Logger(OpenvpnController.name);

  constructor(
    @Inject() private readonly openvpnService: OpenvpnService,
  ) {
    registerOpenvpnListeners(this, this.openvpnService.emitter);
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
```

The `registerOpenvpnListeners()` function automatically registers all class methods marked with `@OpenvpnEvent`.\
You can use the built-in NestJS Logger or inject your own custom logger if needed.
Passing `OpenvpnService` is optional — if you have your own event emitter, just pass it manually.

#### 2. Event-driven approach

Full example: [examples/emitter](examples/emitter)

```ts
@Injectable()
export class ExternalService implements OnApplicationBootstrap {
  constructor(
    @Inject() private readonly openvpnService: OpenvpnService,
    @Inject() private readonly logger: Logger,
  ) {}

  onApplicationBootstrap() {
    const emitter = this.openvpnService.emitter;

    emitter.on("client:connection", async (clientList) => {
      // handle client connection
    });

    emitter.on("client:disconnect", async (client) => {
      // handle client disconnect
    });

    emitter.once("client:list", async (clients) => {
      for (const { commonName, virtualAddress } of clients) {
        // handle client info
      }
    });
  }
}
```

## Additional Information

You can find all available types and methods in the
[main openvpn-manager repository](https://github.com/Leo5878/openvpn-manager).
