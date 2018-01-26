import {
  commitMutation,
  graphql,
} from 'react-relay';

exports.UpdateUserMutation = ({ environment, heading, email }) => {
  const mutation = graphql`
  mutation UpdateUserMutation($heading: String, $email: String!) {
    updateUser(
      heading: $heading, email: $email
    ) {
      id
      heading
      email
    }
  }`;

  const variables = { heading, email };

  return new Promise((resolve, reject) => {
    commitMutation(environment, {
      mutation,
      variables,
      onCompleted: (res, err) => {
        if (err) console.log(err);
        resolve(res);
      },
      onError: err => reject(err),
    });
  });
};
