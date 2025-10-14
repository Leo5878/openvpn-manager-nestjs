# OpenVPN Manager NestJS

Модуль интеграции для [openvpn-manager](https://github.com/Leo5878/openvpn-manager), предназначенный для работы с OpenVPN в приложениях NestJS.

Этот пакет предоставляет механизм **Dependency Injection** и **конфигурацию модуля** для взаимодействия с OpenVPN через `openvpn-manager-ts`.


# Возможности

* Простая интеграция с `openvpn-manager`
* Типобезопасная работа с событиями
* Поддержка асинхронной конфигурации (`forRootAsync`)
* Возможность использовать собственный логгер и EventEmitter

# Быстрый старт

Чтобы начать, зарегистрируйте модуль в вашем NestJS-приложении.

> [!NOTE]
> Подробные инструкции по настройке смотрите в оригинальном репозитории.
> Единственное отличие — способ передачи **логгера** (пример ниже).

```ts
@Module({
  imports: [
    OpenvpnModuleImpl.forRootAsync({
      useFactory: () => {
        return {
          connections: [
            {
              id: "srv1",         // Идентификатор сервера (любая строка)
              host: "127.0.0.1",  // Адрес OpenVPN Manager
              port: 7505,         // Порт OpenVPN Manager
              timeout: 5000,      // Таймаут подключения в мс (по умолчанию 5000)
            },
          ],
          event: emitter,         // Кастомный EventEmitter (необязательно)
        };
      },
    }),
  ],
})
export class AppModule {}
```

## Контроллер

Есть два способа получать события OpenVPN в NestJS:

1. Через **декораторы**
2. Через **EventEmitter** (классический подход)

Оба варианта рабочие.
Декораторы делают код декларативным, а использование эмиттера даёт больше гибкости и автоподсказок от IDE.


### 1. Через декораторы

Полный пример: [examples/decorator](examples/decorator)

```ts
@Injectable()
export class OpenvpnController {
  private readonly logger = new Logger(OpenvpnController.name); // <- Можно использовать встроенный логгер Nest.js

  constructor(
    @Inject() private readonly openvpnService: OpenvpnService,
  ) {
    registerOpenvpnListeners(this, this.openvpnService.emitter); // Регистрация слушателей
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

### 2. Событийный подход

Полный пример: [examples/emitter](examples/emitter)

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
      // обработка подключения клиента
    });

    emitter.on("client:disconnect", async (client) => {
      // обработка отключения клиента
    });

    emitter.once("client:list", async (clients) => {
      for (const { commonName, virtualAddress } of clients) {
        // обработка списка клиентов
      }
    });
  }
}
```

Функция `registerOpenvpnListeners()` автоматически регистрирует все методы класса, помеченные декоратором `@OpenvpnEvent`.
Вы можете использовать встроенный Logger из NestJS или внедрить свой собственный логгер.\
Передача `OpenvpnService` не является обязательной — если вы используете собственный эмиттер, просто передайте его вручную.

## Дополнительно

Типы и полный список методов можно найти в
[основном репозитории openvpn-manager](https://github.com/Leo5878/openvpn-manager).
