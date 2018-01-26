import {
  commitMutation,
  graphql,
} from 'react-relay';

// class Mutation {
//   commit() {
//
//   }
//
// }

// import { applyOptimisticMutation } from 'relay-runtime';

exports.NewMemoryMutation = ({ environment, title, body, created }) => {
  const mutation = graphql`
  mutation NewMemoryMutation($title: String, $body: String, $created: String) {
    newMemory(
      title: $title,
      body: $body,
      created: $created,
      tags: []
    ) {
      id
      title
      body
      created
    }
  }`;

  const variables = {
    title,
    body,
    created,
  };

  // const config = {
  //   mutation,
  //   variables,
  //   optimisticResponse: {
  //     newMemory: {
  //       id: 'temp',
  //       body,
  //       title,
  //       created,
  //       tags: [
  //         { id: 'sfsfmskfm', label: 'test', color: '000000' },
  //       ],
  //     },
  //   },
  //   onCompleted: (res, err) => {
  //     console.log(res);
  //   },
  //   optimisticUpdater: (store) => {
  //     console.log(store.getRoot().getValue('NewMemoryMutation'));
  //   },
  // };

  // const disposable = applyOptimisticMutation(
  //   environment,
  //   config
  // );
  //
  // return {
  //   dispose: () => disposable.dispose(),
  //   commit: () => {
  //     disposable.dispose();
  //     commitMutation(environment, config);
  //   },
  // };
  return new Promise((resolve, reject) => {
    commitMutation(environment, {
      mutation,
      variables,
      onCompleted: (res, err) => {
        if (err) {
          console.log(err);
          resolve(err);
        }
        resolve(res);
      },
      onError: err => reject(err),
    });
  });
};
