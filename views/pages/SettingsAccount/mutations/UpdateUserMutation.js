import {
  commitMutation,
  graphql,
} from 'react-relay';

exports.UpdateUserMutation = ({ environment, heading }) => {
  const mutation = graphql`
  mutation UpdateUserMutation($heading: String) {
    updateUser(
      heading: $heading
    ) {
      id
      heading
    }
  }`;

  const variables = { heading };

  commitMutation(environment, {
    mutation,
    variables,
    // uploadables: 'test',
    onCompleted: (response, errors) => {
      console.log(response);
      // window.onbeforeunload = null;
      // window.location.href = '/';
    },
    onError: err => console.error(err),
  });
};
