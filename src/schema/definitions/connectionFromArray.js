import { getOffsetWithDefault, offsetToCursor } from 'graphql-relay';
// import _ from 'lodash';

export function connectionFromArray(arraySlice, args) {
  const { first, after } = args;
  const afterOffset = getOffsetWithDefault(after, -1) + 1;

  if (typeof first === 'number') {
    if (first < 0) {
      throw new Error('Argument "first" must be a non-negative integer');
    }
  }
  // if (typeof afterOffset === 'number') {
  //   if (afterOffset < 0) {
  //     throw new Error('Argument "after" must be a non-negative integer');
  //   }
  // }

  // If supplied slice is too large, trim it down before mapping over it.
  const slice = arraySlice.slice(
    0,
    first
  );

  const edges = slice.map((value, index) => ({
    cursor: offsetToCursor(afterOffset + index),
    node: value,
  }));

  const endOffset = Math.min(first - 1, arraySlice.length - 1);

  const firstEdge = edges[0];
  const lastEdge = edges[endOffset];

  return {
    edges,
    pageInfo: {
      startCursor: firstEdge ? firstEdge.cursor : null,
      endCursor: lastEdge ? lastEdge.cursor : null,
      hasPreviousPage: afterOffset > 0,
      hasNextPage: first < arraySlice.length,
    },
  };
}
