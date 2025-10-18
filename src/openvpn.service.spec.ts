import { Test, TestingModule } from "@nestjs/testing";
import { OpenvpnService } from "./openvpn.service";

describe("OpenvpnMngrTsService", () => {
  let service: OpenvpnService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OpenvpnService],
    }).compile();

    service = module.get<OpenvpnService>(OpenvpnService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
