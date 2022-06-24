"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var CrawlerModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrawlerModule = void 0;
const common_1 = require("@nestjs/common");
const crawler_api_service_1 = require("./crawler-api/crawler-api.service");
const config_module_1 = require("./config/config.module");
const listeners_module_1 = require("./listeners/listeners.module");
const utils_1 = require("./utils");
let CrawlerModule = CrawlerModule_1 = class CrawlerModule {
    static forRoot(options) {
        return {
            imports: [config_module_1.ConfigModule.forRoot(options)],
            module: CrawlerModule_1,
        };
    }
};
CrawlerModule = CrawlerModule_1 = __decorate([
    (0, common_1.Module)({
        imports: [listeners_module_1.ListenersModule],
        providers: [common_1.Logger, crawler_api_service_1.CrawlerApiService, utils_1.Utils],
        exports: [crawler_api_service_1.CrawlerApiService],
    })
], CrawlerModule);
exports.CrawlerModule = CrawlerModule;
//# sourceMappingURL=crawler.module.js.map