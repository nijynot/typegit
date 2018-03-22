import {
  commitMutation,
  graphql,
} from 'react-relay';

exports.DeleteRepositoryMutation = ({ environment, id }) => {
  const mutation = graphql`
  mutation DeleteRepositoryMutation($id: ID!) {
    deleteRepository(id: $id)
  }`;

  const variables = {
    id,
  };

  return new Promise((resolve, reject) => {
    commitMutation(environment, {
      mutation,
      variables,
      onCompleted: (res, err) => {
        if (err) reject(err);
        resolve(res);
      },
      onError: err => reject(err),
    });
  });
};
