import { getOffsetWithDefault, offsetToCursor, cursorToOffset } from 'graphql-relay';

export function transformToForward(args) {
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
