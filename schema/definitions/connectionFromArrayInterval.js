import { getOffsetWithDefault, offsetToCursor } from 'graphql-relay';
import _ from 'lodash';

// export function connectionFromArrayInterval(interval, args, meta) {
//   const { after, before, first, last } = args;
//   // const { sliceStart, arrayLength } = meta;
//   // const sliceEnd = sliceStart + interval.length;
//   // const beforeOffset = getOffsetWithDefault(before, arrayLength);
//   const afterOffset = getOffsetWithDefault(after, -1);
//
//   let endOffset = Math.min(
//     interval.length,
//     first,
//   );
//
//   if (typeof first === 'number') {
//     if (first < 0) {
//       throw new Error('Argument "first" must be a non-negative integer');
//     }
//   }
//
//   const edges = interval.map((value, index) => ({
//     cursor: offsetToCursor(afterOffset + index),
//     node: value,
//   }));
//
//   const firstEdge = edges[0];
//   const lastEdge = edges[first - 1];
//   const lowerBound = after ? (afterOffset + 1) : 0;
//
//   return {
//     edges,
//     pageInfo: {
//       startCursor: firstEdge ? firstEdge.cursor : null,
//       endCursor: lastEdge ? lastEdge.cursor : null,
//       hasPreviousPage:
//         typeof last === 'number' ? lowerBound > 1 : false,
//       hasNextPage:
//         typeof first === 'number' ? first < interval.length : false,
//     },
//   };
// }

export function connectionFromArrayInterval(arrayInterval, args, meta) {
  const { after, first } = args;
  // const hasNextPage = _.get(meta, 'hasNextPage', null);
  // const hasPreviousPage = _.get(meta, 'hasPreviousPage', null);

  const afterOffset = getOffsetWithDefault(after, -1);

  const startOffset = Math.max(
    afterOffset,
    -1
  ) + 1;
  const endOffset = Math.min(
    first,
    arrayInterval.length
  );

  if (typeof first === 'number') {
    if (first < 0) {
      throw new Error('Argument "first" must be a non-negative integer');
    }
  }

  // If supplied slice is too large, trim it down before mapping over it.
  const slice = arrayInterval.slice(
    0,
    endOffset
  );

  const edges = slice.map((value, index) => ({
    cursor: offsetToCursor(startOffset + index),
    node: value,
  }));

  const firstEdge = edges[0];
  const lastEdge = edges[endOffset - 1];
  const lowerBound = after ? (startOffset) : 0;
  const upperBound = arrayInterval.length;
  return {
    edges,
    pageInfo: {
      startCursor: firstEdge ? firstEdge.cursor : null,
      endCursor: lastEdge ? lastEdge.cursor : null,
      hasPreviousPage:
        lowerBound > 0,
      hasNextPage:
        typeof first === 'number' ? first < upperBound : false,
    },
  };
}
