// import { getOffsetWithDefault, offsetToCursor, cursorToOffset } from 'graphql-relay';
import _ from 'lodash';
import * as git from '../git.js';

export function offsetFromCursor(cursor) {
  if (typeof cursor !== 'string') {
    return '';
  }
  return parseInt(_.get(String(cursor).split(':'), '[1]'), 10);
}

export function oidFromCursor(cursor) {
  if (typeof cursor !== 'string') {
    return '';
  }
  return _.get(String(cursor).split(':'), '[0]', '');
}

export function toCursor(oid, offset) {
  return `${oid}:${offset}`;
}

export function offsetWithDefaultFromCursor(cursor, defaultOffset) {
  if (typeof cursor !== 'string') {
    return defaultOffset;
  }
  const offset = offsetFromCursor(cursor);
  return Number.isNaN(offset) ? defaultOffset : offset;
}

export async function toForwardCommitArgs(repo, args) {
  const { first, after, last, before } = args;
  if (typeof first === 'number' && first >= 0) {
    return { first, after };
  }

  if (typeof last === 'number' && typeof before === 'string') {
    if (last < 0) {
      throw new Error('Argument "last" must be a non-negative integer');
    }
    const beforeIndex = offsetFromCursor(before);
    const afterIndex = Math.max(beforeIndex - last - 1, -1);
    if (afterIndex >= 0) {
      const headCommit = await git.parseExp(repo, `master~${afterIndex}`);
      return {
        first: Math.min(last, beforeIndex),
        after: toCursor(headCommit.id(), afterIndex),
      };
    }
    return {
      first: Math.min(last, beforeIndex),
      after: '',
    };
  }
  return args;
}

export function isBackward(args) {
  const { first, after, last, before } = args;
  if (typeof first === 'number' && first >= 0) {
    return false;
  } else if (typeof last === 'number' && typeof before === 'string') {
    return true;
  }
  return false;
}

export function connectionFromCommits(arraySlice, args, meta) {
  const { first, after } = args;
  const { backward } = meta;
  const afterIndex = offsetWithDefaultFromCursor(after, -1) + 1;
  let trim = arraySlice;
  if (backward && first < trim.length) {
    trim = arraySlice.slice(0, -1);
  } else if (after) {
    trim = arraySlice.slice(-arraySlice.length + 1);
  }

  const slice = trim.slice(
    0,
    Math.min(first, trim.length)
  );

  const edges = slice.map((node, index) => {
    return {
      cursor: toCursor(node.oid, afterIndex + index),
      node,
    };
  });

  const firstEdge = edges[0];
  const lastEdge = _.last(edges);

  return {
    edges,
    pageInfo: {
      startCursor: firstEdge ? firstEdge.cursor : null,
      endCursor: lastEdge ? lastEdge.cursor : null,
      hasPreviousPage: afterIndex > 0,
      hasNextPage: (backward && first < arraySlice.length) || first < trim.length,
    },
    ...meta,
  };
}
