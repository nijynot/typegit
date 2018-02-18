import {
  commitMutation,
  graphql,
} from 'react-relay';

exports.DeleteMemoryMutation = ({ environment, id }) => {
  const mutation = graphql`
  mutation DeleteMemoryMutation($id: ID!) {
    deleteMemory(
      id: $id
    )
  }`;

  const variables = {
    id,
  };

  return new Promise((resolve, reject) => {
    commitMutation(environment, {
      mutation,
      variables,
      onCompleted: (res, err) => {
        if (err) console.log(err);
        resolve(res);
      },
      onError: err => console.error(err),
    });
  });
};
