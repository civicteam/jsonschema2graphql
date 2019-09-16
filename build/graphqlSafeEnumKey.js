"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var ramda_1 = __importDefault(require("ramda"));
/** Turns an enum key from JSON schema into one that is safe for GraphQL. */
function graphqlSafeEnumKey(value) {
    var trim = function (s) { return s.trim(); };
    var isNum = function (s) { return /^[0-9]/.test(s); };
    var safeNum = function (s) { return (isNum(s) ? "VALUE_" + s : s); };
    var convertComparators = function (s) {
        return ({
            '<': 'LT',
            '<=': 'LTE',
            '>=': 'GTE',
            '>': 'GT',
        }[s] || s);
    };
    var sanitize = function (s) { return s.replace(/[^_a-zA-Z0-9]/g, '_'); };
    return ramda_1.default.compose(sanitize, convertComparators, safeNum, trim)(value);
}
exports.graphqlSafeEnumKey = graphqlSafeEnumKey;
//# sourceMappingURL=graphqlSafeEnumKey.js.map