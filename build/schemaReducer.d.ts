import { JSONSchema7 } from 'json-schema';
import { GraphQLTypeMap } from './types';
export declare function schemaReducer(knownTypes: GraphQLTypeMap, schema: JSONSchema7): GraphQLTypeMap;
