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

exports.UpdateAvatarMutation = ({ environment, uploadables }) => {
  const mutation = graphql`
  mutation UpdateAvatarMutation {
    updateAvatar {
      id
    }
  }`;

  const variables = {};

  return new Promise((resolve) => {
    commitMutation(environment, {
      mutation,
      variables,
      uploadables,
      onCompleted: (res, errors) => {
        resolve(res);
      },
      onError: err => console.error(err),
    });
  });
};
