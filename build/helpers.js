"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var camelcase_1 = __importDefault(require("camelcase"));
var graphql_1 = require("graphql");
var pluralize_1 = __importDefault(require("pluralize"));
/** This generates the default `Query` block of the schema. */
exports.DEFAULT_ENTRY_POINTS = function (types) { return ({
    query: new graphql_1.GraphQLObjectType({
        name: 'Query',
        fields: Object.entries(types).reduce(function (prevResult, _a) {
            var _b;
            var typeName = _a[0], type = _a[1];
            return (__assign(__assign({}, prevResult), (_b = {}, _b[camelcase_1.default(pluralize_1.default(typeName))] = { type: new graphql_1.GraphQLList(type) }, _b)));
        }, new Map()),
    }),
}); };
exports.err = function (msg, propName) {
    return new Error("jsonschema2graphql: " + (propName ? "Couldn't convert property " + propName + ". " : '') + msg);
};
//# sourceMappingURL=helpers.js.map