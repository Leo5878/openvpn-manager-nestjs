import { Module } from "@nestjs/common";
import { OpenvpnControllerEmitter } from "./emmiters";
import { OpenvpnModuleImpl } from "@app/openvpn-mngr-ts/openvpn-manager-nestjs/openvpn-mngr-ts.module";
// import { emitter } from "./emitter";

@Module({
  imports: [
    OpenvpnModuleImpl.forRootAsync({
      useFactory: () => {
        return {
          connections: [
            {
              id: "srv1", // Server identifier (any string)
              host: "127.0.0.1", // Address of the OpenVPN Manager
              port: 7505, // Port of the OpenVPN Manager
              timeout: 5000, // Connection timeout in ms (default 5000)
            },
          ],
          // event: emitter,    // Custom event emitter
        };
      },
    }),
  ],
  providers: [OpenvpnControllerEmitter],
  exports: [OpenvpnControllerEmitter],
})
export class OpenvpnModule {}
