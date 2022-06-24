"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PolkadotApiService = void 0;
const common_1 = require("@nestjs/common");
const utils_1 = require("../utils");
const config_service_1 = require("../config/config.service");
const opal_api_provider_1 = require("./providers/opal-api.provider");
let PolkadotApiService = class PolkadotApiService {
    constructor(configService, logger, apiProvider) {
        this.configService = configService;
        this.logger = logger;
        this.apiProvider = apiProvider;
        const wsUrl = this.configService.getOption('wsProviderUrl');
        this.isReady = new Promise((resolve) => {
            this.getPolkadotAPI(wsUrl).then((result) => {
                this._api = result;
                resolve(true);
            });
        });
    }
    get api() {
        return this._api;
    }
    async getPolkadotAPI(wsUrl) {
        const log = this.logger;
        log.verbose(`Connecting to ${wsUrl}`);
        await this.apiProvider.init(wsUrl);
        const api = this.apiProvider.getApi();
        api.on('error', async (value) => {
            log.error(value);
        });
        api.on('disconnected', async (value) => {
            log.error(value);
        });
        await api.isReady;
        log.verbose('API is ready!');
        let node;
        try {
            node = await api.rpc.system.health();
        }
        catch (e) {
            log.error({
                message: "Can't connect to node! Waiting 10s...",
                name: 'disconnect',
                stack: e.stack,
            });
            api.disconnect();
            await utils_1.Utils.wait(10000);
            throw e;
        }
        log.verbose(`Node: ${JSON.stringify(node)}`);
        if (node && node.isSyncing.eq(false)) {
            log.verbose('Node is synced!');
            return api;
        }
        log.verbose('Node is not synced! Waiting 10s...');
        api.disconnect();
        await utils_1.Utils.wait(10000);
        return api;
    }
};
PolkadotApiService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_service_1.ConfigService,
        common_1.Logger,
        opal_api_provider_1.OpalApiProvider])
], PolkadotApiService);
exports.PolkadotApiService = PolkadotApiService;
//# sourceMappingURL=polkadot-api.service.js.map