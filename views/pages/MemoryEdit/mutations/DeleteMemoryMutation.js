import {
  commitMutation,
  graphql,
} from 'react-relay';

exports.DeleteMemoryMutation = ({ environment, id }, cb) => {
  const mutation = graphql`
  mutation DeleteMemoryMutation($id: ID!) {
    deleteMemory(
      id: $id
    )
  }`;

  const variables = {
    id,
  };

  commitMutation(environment, {
    mutation,
    variables,
    onCompleted: (response, errors) => {
      console.log(response);
      cb();
    },
    onError: err => console.error(err),
  });
};
