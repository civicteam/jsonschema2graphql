"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var ajv_1 = __importDefault(require("ajv"));
var graphql_1 = require("graphql");
var lodash_1 = __importDefault(require("lodash"));
var uppercamelcase_1 = __importDefault(require("uppercamelcase"));
var graphqlSafeEnumKey_1 = require("./graphqlSafeEnumKey");
var helpers_1 = require("./helpers");
/** Maps basic JSON schema types to basic GraphQL types */
var BASIC_TYPE_MAPPING = {
    string: graphql_1.GraphQLString,
    integer: graphql_1.GraphQLInt,
    number: graphql_1.GraphQLFloat,
    boolean: graphql_1.GraphQLBoolean,
};
function schemaReducer(knownTypes, schema) {
    // validate against the json schema schema
    new ajv_1.default().validateSchema(schema);
    var typeName = schema.$id;
    if (typeof typeName === 'undefined')
        throw helpers_1.err('Schema does not have an `$id` property.');
    knownTypes[typeName] = buildType(typeName, schema, knownTypes);
    return knownTypes;
}
exports.schemaReducer = schemaReducer;
function buildType(propName, schema, knownTypes) {
    var name = uppercamelcase_1.default(propName);
    // oneOf?
    if (!lodash_1.default.isUndefined(schema.oneOf)) {
        var cases_1 = schema.oneOf;
        var caseKeys = Object.keys(cases_1);
        var types = caseKeys.map(function (caseName) {
            var caseSchema = cases_1[caseName];
            var qualifiedName = name + ".oneOf[" + caseName + "]";
            var typeSchema = (caseSchema.then || caseSchema);
            return buildType(qualifiedName, typeSchema, knownTypes);
        });
        var description = buildDescription(schema);
        return new graphql_1.GraphQLUnionType({ name: name, description: description, types: types });
    }
    // object?
    else if (schema.type === 'object') {
        var description = buildDescription(schema);
        var fields = function () {
            return !lodash_1.default.isEmpty(schema.properties)
                ? lodash_1.default.mapValues(schema.properties, function (prop, fieldName) {
                    var qualifiedFieldName = name + "." + fieldName;
                    var type = buildType(qualifiedFieldName, prop, knownTypes);
                    var isRequired = lodash_1.default.includes(schema.required, fieldName);
                    return {
                        type: isRequired ? new graphql_1.GraphQLNonNull(type) : type,
                        description: buildDescription(prop),
                    };
                })
                : // GraphQL doesn't allow types with no fields, so put a placeholder
                    { _empty: { type: graphql_1.GraphQLString } };
        };
        return new graphql_1.GraphQLObjectType({ name: name, description: description, fields: fields });
    }
    // array?
    else if (schema.type === 'array') {
        var elementType = buildType(name, schema.items, knownTypes);
        return new graphql_1.GraphQLList(new graphql_1.GraphQLNonNull(elementType));
    }
    // enum?
    else if (!lodash_1.default.isUndefined(schema.enum)) {
        if (schema.type !== 'string')
            throw helpers_1.err("Only string enums are supported.", name);
        var description = buildDescription(schema);
        var graphqlToJsonMap = lodash_1.default.keyBy(schema.enum, graphqlSafeEnumKey_1.graphqlSafeEnumKey);
        var values = lodash_1.default.mapValues(graphqlToJsonMap, function (value) { return ({ value: value }); });
        var enumType = new graphql_1.GraphQLEnumType({ name: name, description: description, values: values });
        return enumType;
    }
    // $ref?
    else if (!lodash_1.default.isUndefined(schema.$ref)) {
        var type = knownTypes[schema.$ref];
        if (!type)
            throw helpers_1.err("The referenced type " + schema.$ref + " is unknown.", name);
        return type;
    }
    // basic?
    else if (BASIC_TYPE_MAPPING[schema.type]) {
        return BASIC_TYPE_MAPPING[schema.type];
    }
    // ¯\_(ツ)_/¯
    else
        throw helpers_1.err("The type " + schema.type + " on property " + name + " is unknown.");
}
function buildDescription(d) {
    if (d.title && d.description)
        return d.title + ": " + d.description;
    return d.title || d.description || undefined;
}
//# sourceMappingURL=schemaReducer.js.map