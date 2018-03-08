import { getOffsetWithDefault, offsetToCursor, cursorToOffset } from 'graphql-relay';
import _ from 'lodash';

// export function fromCommitCursorWith(cursor, defaultValue) {
//   if (typeof cursor !== 'string') {
//     return defaultValue;
//   }
//   const offset =
// };

// export function base64(i) {
//   return Buffer.from(i, 'utf8').toString('base64');
// }
//
// export function unbase64(i) {
//   return Buffer.from(i, 'base64').toString('utf8');
// }

export function historyCursorToOffset(cursor) {
  return parseInt(_.get(cursor.split(':'), '[1]'), 10);
}

export function historyCursorToOid(cursor) {
  if (typeof cursor !== 'string') {
    return '';
  }
  return _.get(cursor.split(':'), '[0]', '');
}

// export function getOidOffsetWithDefault(cursor, defaultOffset) {
//   if (typeof cursor !== 'string') {
//     return {
//       oid: '',
//       offset: defaultOffset,
//     };
//   }
//   const offset = cursorToOffset(cursor);
//   return isNaN(offset) ? defaultOffset : offset;
// }

export function getHistoryOffsetWithDefault(cursor, defaultOffset) {
  if (typeof cursor !== 'string') {
    return defaultOffset;
  }
  const offset = historyCursorToOffset(cursor);
  return Number.isNaN(offset) ? defaultOffset : offset;
}

export function connectionFromHistory(arraySlice, args, meta) {
  const { first, after } = args;
  // const afterOffset = getOffsetWithDefault(after, -1) + 1;
  // const { oid } = cursorToOidOffset(after);
  const offset = getHistoryOffsetWithDefault(after, -1) + 1;
  let startSlice = 0;
  let endSlice = first;
  if (after) {
    startSlice = 1;
    endSlice = Math.min(first + 1, arraySlice.length);
  }

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
    startSlice,
    endSlice
  );

  const edges = slice.map((value, index) => ({
    // cursor: offsetToCursor(afterOffset + index),
    cursor: `${value.oid}:${index + offset}`,
    node: value,
  }));

  const firstEdge = edges[0];
  const lastEdge = _.last(edges);

  return {
    edges,
    pageInfo: {
      startCursor: firstEdge ? firstEdge.cursor : null,
      endCursor: lastEdge ? lastEdge.cursor : null,
      hasPreviousPage: (offset > 0),
      hasNextPage: first < arraySlice.length,
    },
    ...meta,
  };
}

export function transformToHistoryForward(args) {
  const { first, after, last, before } = args;

  if (typeof first === 'number' && first >= 0) {
    if (first < 0) {
      throw new Error('Argument "first" must be a non-negative integer');
    }
    return { first, after };
  }
  if (typeof last === 'number' && typeof before === 'string') {
    if (last < 0) {
      throw new Error('Argument "last" must be a non-negative integer');
    }
    const afterOffset = Math.max(cursorToOffset(before) - last - 1, -1);
    return {
      first: Math.min(last, getOffsetWithDefault(before, 0)),
      after: offsetToCursor(afterOffset),
    };
  }

  return args;
}
