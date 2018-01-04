import {
  commitMutation,
  graphql,
} from 'react-relay';

exports.UpdateCustomerMutation = ({ environment, token }) => {
  const mutation = graphql`
  mutation UpdateCustomerMutation($token: String) {
    updateCustomer(
      token: $token
    ) {
      id
      card {
        last4
        brand
      }
    }
  }`;

  const variables = { token };

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
