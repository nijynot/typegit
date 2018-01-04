import {
  commitMutation,
  graphql,
} from 'react-relay';

exports.UpdatePasswordMutation = ({ environment, oldPassword, newPassword }) => {
  const mutation = graphql`
  mutation UpdatePasswordMutation($oldPassword: String, $newPassword: String) {
    updatePassword(
      oldPassword: $oldPassword,
      newPassword: $newPassword
    )
  }`;

  const variables = { oldPassword, newPassword };

  return new Promise((resolve, reject) => {
    commitMutation(environment, {
      mutation,
      variables,
      // uploadables: 'test',
      onCompleted: (res, errors) => {
        console.log(res);
        resolve(res);
        // window.onbeforeunload = null;
        // window.location.href = '/';
      },
      onError: err => console.error(err),
    });
  });
};
