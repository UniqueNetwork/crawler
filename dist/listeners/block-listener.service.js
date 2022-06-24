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
exports.BlockListenerService = void 0;
const rxjs_1 = require("rxjs");
const lodash_1 = require("lodash");
const common_1 = require("@nestjs/common");
const polkadot_api_service_1 = require("../polkadot-api/polkadot-api.service");
const utils_1 = require("../utils");
const event_types_1 = require("../types/event.types");
const extrinsic_types_1 = require("../types/extrinsic.types");
let BlockListenerService = class BlockListenerService {
    constructor(logger, apiService, utils) {
        this.logger = logger;
        this.apiService = apiService;
        this.utils = utils;
    }
    get api() {
        return this.apiService.api;
    }
    getTimestampFromExtrinsics(extrinsics) {
        let timestamp = 0;
        for (const extrinsic of extrinsics) {
            const { method: methodStruct } = extrinsic;
            const { section, method } = methodStruct;
            if (section === extrinsic_types_1.ExtrinsicSection.TIMESTAMP &&
                method === extrinsic_types_1.ExtrinsicMethod.SET) {
                timestamp = methodStruct.toJSON().args.now;
                break;
            }
        }
        return timestamp;
    }
    parseEventAmount({ method, data, section }) {
        let result = null;
        let amountIndex = null;
        if ([
            event_types_1.EventMethod.TRANSFER,
            event_types_1.EventMethod.DEPOSIT,
            event_types_1.EventMethod.WITHDRAW,
        ].includes(method)) {
            if (section === event_types_1.EventSection.BALANCES) {
                amountIndex =
                    method === event_types_1.EventMethod.DEPOSIT || method === event_types_1.EventMethod.WITHDRAW
                        ? 1
                        : 2;
            }
            else if (section === event_types_1.EventSection.TREASURY) {
                amountIndex = 0;
            }
            if (amountIndex !== null) {
                result = utils_1.Utils.getAmountValue(data[amountIndex].toString());
            }
        }
        return result;
    }
    parseEventRecord(rawRecord) {
        const { event: { index, method, section, data: rawData }, phase, } = rawRecord;
        const initialization = phase.toString() === event_types_1.EventPhase.INITIALIZATION;
        return {
            method,
            section,
            initialization,
            extrinsicIndex: initialization ? null : phase.toJSON().applyExtrinsic,
            amount: initialization
                ? null
                : this.parseEventAmount({ method, section, data: rawData }),
            index: index.toHuman(),
            data: rawData.toHuman(),
            phase: phase.toHuman(),
        };
    }
    parseExtrinsicRecord(rawRecord, index) {
        const { method: { section, method }, isSigned, } = rawRecord.toHuman();
        return {
            index,
            section,
            method,
            isSigned,
            signer: isSigned ? rawRecord.signer.toString() : null,
            hash: rawRecord.hash.toHex(),
        };
    }
    async getBlockDataByNumber(blockNumber) {
        const blockHash = await this.api.rpc.chain.getBlockHash(blockNumber);
        return this.getBlockDataByHash(blockHash);
    }
    async getBlockDataByHash(blockHash) {
        const [rawRuntimeVersion, rawBlock, apiAt] = await Promise.all([
            this.api.runtimeVersion,
            this.api.rpc.chain.getBlock(blockHash),
            this.api.at(blockHash),
        ]);
        const [rawEvents, rawTotalIssuance] = await Promise.all([
            apiAt.query.system.events(),
            apiAt.query.balances.totalIssuance(),
        ]);
        const { header: rawHeader, extrinsics: rawExtrinsics } = rawBlock.block;
        const timestamp = this.getTimestampFromExtrinsics(rawExtrinsics);
        const parsedEvents = rawEvents.map(this.parseEventRecord.bind(this));
        const parsedExtrinsics = rawExtrinsics.map(this.parseExtrinsicRecord.bind(this));
        return Object.assign(Object.assign({ blockNumber: rawHeader.number.toNumber(), timestamp, blockHash: blockHash.toHuman(), extrinsics: parsedExtrinsics, events: parsedEvents, totalIssuance: rawTotalIssuance.toString() }, (0, lodash_1.pick)(rawHeader.toHuman(), [
            'stateRoot',
            'extrinsicsRoot',
            'parentHash',
        ])), (0, lodash_1.pick)(rawRuntimeVersion.toJSON(), ['specName', 'specVersion']));
    }
    startListening() {
        const blocksStream = new rxjs_1.Observable((subscriber) => {
            this.api.rpc.chain.subscribeNewHeads(async (lastHeader) => {
                try {
                    const blockNumber = lastHeader.number.toNumber();
                    this.logger.verbose(`Got new block ${blockNumber}`, 'BlockListenerService');
                    const result = await this.getBlockDataByHash(lastHeader.hash);
                    subscriber.next(result);
                }
                catch (err) {
                    subscriber.error(err === null || err === void 0 ? void 0 : err.message);
                }
            });
        });
        return (0, rxjs_1.from)(this.apiService.isReady).pipe((0, rxjs_1.filter)((isReady) => isReady), (0, rxjs_1.switchMap)(() => blocksStream), (0, rxjs_1.share)());
    }
    async getBlockByNumber(blockNumber) {
        await this.apiService.isReady;
        return this.getBlockDataByNumber(blockNumber);
    }
};
BlockListenerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [common_1.Logger,
        polkadot_api_service_1.PolkadotApiService,
        utils_1.Utils])
], BlockListenerService);
exports.BlockListenerService = BlockListenerService;
//# sourceMappingURL=block-listener.service.js.map