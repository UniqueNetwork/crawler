"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventMethod = exports.EventSection = exports.EventPhase = void 0;
var EventPhase;
(function (EventPhase) {
    EventPhase["INITIALIZATION"] = "Initialization";
})(EventPhase = exports.EventPhase || (exports.EventPhase = {}));
var EventSection;
(function (EventSection) {
    EventSection["SYSTEM"] = "system";
    EventSection["BALANCES"] = "balances";
    EventSection["TREASURY"] = "treasury";
    EventSection["COMMON"] = "common";
})(EventSection = exports.EventSection || (exports.EventSection = {}));
var EventMethod;
(function (EventMethod) {
    EventMethod["TRANSFER"] = "Transfer";
    EventMethod["DEPOSIT"] = "Deposit";
    EventMethod["WITHDRAW"] = "Withdraw";
    EventMethod["ENDOWED"] = "Endowed";
    EventMethod["EXTRINSIC_SUCCESS"] = "ExtrinsicSuccess";
    EventMethod["COLLECTION_CREATED"] = "CollectionCreated";
})(EventMethod = exports.EventMethod || (exports.EventMethod = {}));
//# sourceMappingURL=event.types.js.map