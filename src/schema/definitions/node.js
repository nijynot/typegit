import { fromGlobalId, nodeDefinitions } from 'graphql-relay';
import Models from '../models/Models.js';

const types = {};

export function registerType(type) {
  if (type.connectionType) {
    types[type.connectionType.name] = type.connectionType;
  } else {
    types[type.name] = type;
  }
  return type;
}

export function typeResolver(obj) {
  return types[obj.graphql_type];
}

export const { nodeField, nodeInterface } = nodeDefinitions(
  async (globalId, context) => {
    const { type, id } = fromGlobalId(globalId);
    const loader = context.loaders[type];
    return (loader && loader.load(id)) || null;
  },
  async (object) => {
    return types[object.constructor.name] || null;
  },
);
