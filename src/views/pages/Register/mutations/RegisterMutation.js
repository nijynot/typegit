import {
  commitMutation,
  graphql,
} from 'react-relay';

exports.RegisterMutation = ({ environment, username, email, password }) => {
  const mutation = graphql`
  mutation RegisterMutation (
    $username: String!,
    $email: String!,
    $password: String!
  ) {
    register(username: $username, email: $email, password: $password) {
      id
    }
  }`;

  const variables = { username, email, password };

  return new Promise((resolve) => {
    commitMutation(environment, {
      mutation,
      variables,
      // uploadables,
      onCompleted: (res, err) => {
        console.log(err);
        resolve(res);
      },
      onError: err => console.error(err),
    });
  });
};
