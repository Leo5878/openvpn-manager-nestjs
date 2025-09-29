import { Module, DynamicModule, FactoryProvider } from "@nestjs/common";
import {
  OpenvpnService,
  OpenvpnServiceOptions,
} from "./openvpn-mngr-ts.service";
import { InjectionToken } from "@nestjs/common/interfaces/modules/injection-token.interface";
import { OptionalFactoryDependency } from "@nestjs/common/interfaces/modules/optional-factory-dependency.interface";
import { OpenvpnManager } from "@app/openvpn-mngr-ts/openvpn-manager-nestjs/openvpn.manager";
import { OPENVPN_OPTIONS } from "@app/openvpn-mngr-ts/openvpn-manager-nestjs/openvpn.constants";

@Module({})
export class OpenvpnModuleImpl {
  static forRootAsync(options: {
    imports?: any[];
    inject?: Array<InjectionToken | OptionalFactoryDependency>;
    useFactory: (...args: unknown[]) => OpenvpnServiceOptions;
  }): DynamicModule {
    // Эти опции используются в сервисе openvpn, чтобы конфигурацию пробросить внутрь
    const configProvider: FactoryProvider<OpenvpnServiceOptions> = {
      provide: OPENVPN_OPTIONS, // Это нужно, чтобы определить конфигурацию внутри сервиса
      useFactory: options.useFactory,
      inject: options.inject || [],
    };

    return <DynamicModule>{
      module: OpenvpnModuleImpl,
      imports: options.imports || [],
      providers: [configProvider, OpenvpnService, OpenvpnManager],
      exports: [configProvider, OpenvpnService, OpenvpnManager],
    };
  }
}
