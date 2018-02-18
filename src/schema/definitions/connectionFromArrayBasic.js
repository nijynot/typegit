import { getOffsetWithDefault, offsetToCursor } from 'graphql-relay';
import _ from 'lodash';

export function connectionFromArrayBasic(arrayInterval, args) {
  const { limit, offset } = args;

  if (typeof limit === 'number') {
    if (limit < 0) {
      throw new Error('Argument "first" must be a non-negative integer');
    }
  }
  if (typeof offset === 'number') {
    if (offset < 0) {
      throw new Error('Argument "last" must be a non-negative integer');
    }
  }

  // If supplied slice is too large, trim it down before mapping over it.
  const slice = arrayInterval.slice(
    0,
    limit
  );

  const edges = slice.map((value, index) => ({
    cursor: offsetToCursor(offset + index),
    node: value,
  }));

  const firstEdge = edges[0];
  const lastEdge = edges[limit - 1];

  return {
    edges,
    pageInfo: {
      startCursor: firstEdge ? firstEdge.cursor : null,
      endCursor: lastEdge ? lastEdge.cursor : null,
      hasPreviousPage: offset > 0,
      hasNextPage: arrayInterval.length > limit,
    },
  };
}
