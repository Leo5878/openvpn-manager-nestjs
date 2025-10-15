import { Injectable, Logger } from "@nestjs/common";
import { LoggerAdapter } from "@ad0nis/openvpn-manager";

@Injectable()
export class NestLoggerAdapter implements LoggerAdapter {
  constructor(private readonly logger: Logger) {}

  info(message: string, context?: string) {
    this.logger.log(message, context);
  }

  error(message: string, trace?: string, context?: string) {
    this.logger.error(message, trace, context);
  }

  warn(message: string, context?: string) {
    this.logger.warn(message, context);
  }

  debug(message: string, context?: string) {
    if (this.logger.debug) {
      this.logger.debug(message, context);
    }
  }

  verbose(message: string, context?: string) {
    if (this.logger.verbose) {
      this.logger.verbose(message, context);
    }
  }
}
