import {
  Environment,
  Network,
  RecordSource,
  Store,
} from 'relay-runtime';

export function fetchQuery(operation, variables, cacheConfig, uploadables) {
  let init;
  // const files = uploadables;
  if (uploadables) {
    if (!window.FormData) {
      throw new Error('Uploading files without `FormData` not supported.');
    }
    const formData = new FormData();
    formData.append('query', operation.text);
    formData.append('variables', JSON.stringify(variables));
    // for (const filename in files) {
    //   if (files.hasOwnProperty(filename)) {
    //     formData.append(filename, files[filename]);
    //   }
    // }
    Object.keys(uploadables).forEach((key) => {
      if (Object.prototype.hasOwnProperty.call(uploadables, key)) {
        formData.append(key, uploadables[key]);
      }
    });
    init = {
      method: 'POST',
      credentials: 'same-origin',
      // headers: {
      //   'Content-Type': 'application/json',
      // },
      body: formData,
    };
  } else {
    init = {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        Accept: '*/*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: operation.text,
        variables,
      }),
    };
  }

  return fetch('/graphql', init)
  .then((response) => {
    return response.json();
  });
  // return fetch('/graphql', {
  //   method: 'POST',
  //   credentials: 'same-origin',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({
  //     query: operation.text,
  //     variables,
  //   }),
  // }).then((response) => {
  //   return response.json();
  // });
}

export const modernEnvironment = new Environment({
  network: Network.create(fetchQuery),
  store: new Store(new RecordSource()),
});
