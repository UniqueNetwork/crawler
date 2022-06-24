"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListenersModule = void 0;
const common_1 = require("@nestjs/common");
const utils_1 = require("../utils");
const config_module_1 = require("../config/config.module");
const polkadot_api_module_1 = require("../polkadot-api/polkadot-api.module");
const block_listener_service_1 = require("./block-listener.service");
let ListenersModule = class ListenersModule {
};
ListenersModule = __decorate([
    (0, common_1.Module)({
        imports: [config_module_1.ConfigModule, polkadot_api_module_1.PolkadotApiModule],
        providers: [common_1.Logger, block_listener_service_1.BlockListenerService, utils_1.Utils],
        exports: [block_listener_service_1.BlockListenerService],
    })
], ListenersModule);
exports.ListenersModule = ListenersModule;
//# sourceMappingURL=listeners.module.js.map