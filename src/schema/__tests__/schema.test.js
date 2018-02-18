import { graphql } from 'graphql';
import schema from '../schema.js';
import getLoaders from '../loaders/getLoaders.js';
// import { Memory } from '../models/Memory.js';

test('others\' memories are hidden', async () => {
  const query = `
    query {
      memory(id: "Alice0000001") {
        id
        title
        body
        created
        user {
          id
          username
        }
      }
    }
  `;

  const rootValue = {};
  const context = {
    loaders: getLoaders(),
    user: { user_id: 3 },
  };
  const result = await graphql(schema, query, rootValue, context);
  expect(result).toEqual({
    data: {
      memory: {
        id: 'TWVtb3J5Og==',
        title: null,
        body: null,
        created: null,
        user: null,
      },
    },
  });
});

test('get all memories', async () => {
  const query = `
    query {
      memories(first: 10) {
        edges {
          node {
            id
            user {
              id
            }
          }
        }
      }
    }
  `;

  const rootValue = {};
  const context = {
    loaders: getLoaders(),
    user: { user_id: 1 },
  };
  const result = await graphql(schema, query, rootValue, context);
  expect(result).toEqual({
    data: {
      memories: {
        edges: [
          {
            node: {
              id: 'TWVtb3J5OkFsaWNlMDAwMDAwMg==', user: { id: 'VXNlcjox' },
            },
          },
          {
            node: {
              id: 'TWVtb3J5OkFsaWNlMDAwMDAwMQ==', user: { id: 'VXNlcjox' },
            },
          },
        ],
      },
    },
  });
});
