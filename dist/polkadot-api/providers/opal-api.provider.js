"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpalApiProvider = void 0;
const common_1 = require("@nestjs/common");
const api_1 = require("@polkadot/api");
const rpc_provider_1 = require("@polkadot/rpc-provider");
const definitions_1 = require("@unique-nft/unique-mainnet-types/definitions");
let OpalApiProvider = class OpalApiProvider {
    constructor() {
        this.initialized = false;
    }
    async init(url) {
        if (!this.initialized) {
            this.provider = new rpc_provider_1.WsProvider(url);
            this.api = await api_1.ApiPromise.create({
                provider: this.provider,
                rpc: {
                    unique: definitions_1.unique.rpc,
                },
            });
            this.initialized = true;
        }
    }
    getApi() {
        return this.api;
    }
};
OpalApiProvider = __decorate([
    (0, common_1.Injectable)()
], OpalApiProvider);
exports.OpalApiProvider = OpalApiProvider;
//# sourceMappingURL=opal-api.provider.js.map