import {
  Environment,
  Network,
  RecordSource,
  Store,
} from 'relay-runtime';

export function fetchQuery(
  operation,
  variables
) {
  return fetch('/graphql', {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: operation.text,
      variables,
    }),
  }).then((response) => {
    return response.json();
  });
}

export const modernEnvironment = new Environment({
  network: Network.create(fetchQuery),
  store: new Store(new RecordSource()),
});
