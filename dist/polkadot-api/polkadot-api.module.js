"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PolkadotApiModule = void 0;
const common_1 = require("@nestjs/common");
const utils_1 = require("../utils");
const polkadot_api_service_1 = require("./polkadot-api.service");
const opal_api_provider_1 = require("./providers/opal-api.provider");
let PolkadotApiModule = class PolkadotApiModule {
};
PolkadotApiModule = __decorate([
    (0, common_1.Module)({
        providers: [common_1.Logger, opal_api_provider_1.OpalApiProvider, polkadot_api_service_1.PolkadotApiService, utils_1.Utils],
        exports: [polkadot_api_service_1.PolkadotApiService],
    })
], PolkadotApiModule);
exports.PolkadotApiModule = PolkadotApiModule;
//# sourceMappingURL=polkadot-api.module.js.map