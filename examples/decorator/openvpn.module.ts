import { Module } from "@nestjs/common";
import { OpenvpnControllerDecorators } from "./decorators";
import { OpenvpnModuleImpl } from "@ad0nis/openvpn-manager-nestjs";
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
  providers: [OpenvpnControllerDecorators],
  exports: [OpenvpnControllerDecorators], // чтобы другие модули могли использовать
})
export class OpenvpnModule {}
