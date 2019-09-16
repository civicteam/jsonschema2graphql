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
Object.defineProperty(exports, "__esModule", { value: true });
var graphql_1 = require("graphql");
var helpers_1 = require("./helpers");
var schemaReducer_1 = require("./schemaReducer");
/**
 * @param jsonSchema - An individual schema or an array of schemas, provided
 * either as Javascript objects or as JSON text.
 *
 * @param entryPoints - By default, each type gets a query field that returns
 * an array of that type. So for example, if you have an `Person` type and a
 * `Post` type, you'll get a query that looks like this:
 *
 * ```graphql
 *    type Query {
 *      people: [Person]
 *      posts: [Posts]
 *    }
 * ```
 *
 * (Note that the name of the query field is [pluralized](https://github.com/blakeembrey/pluralize).)
 *
 * To override this behavior, provide a `queryBlockBuilder` callback that takes
 * a Map of types and returns Query, Mutation (optional), and Subscription (optional)
 * blocks. Each block consists of a hash of `GraphQLFieldConfig`s.
 */
function convert(_a) {
    var jsonSchema = _a.jsonSchema, _b = _a.entryPoints, entryPoints = _b === void 0 ? helpers_1.DEFAULT_ENTRY_POINTS : _b;
    // coerce input to array of schema objects
    var schemaArray = toArray(jsonSchema).map(toSchema);
    var types = schemaArray.reduce(schemaReducer_1.schemaReducer, {});
    return new graphql_1.GraphQLSchema(__assign(__assign({}, types), entryPoints(types)));
}
exports.default = convert;
function toArray(x) {
    return x instanceof Array
        ? x // already array
        : [x]; // single item -> array
}
function toSchema(x) {
    return x instanceof Object
        ? x // already object
        : JSON.parse(x); // string -> object
}
//# sourceMappingURL=index.js.map