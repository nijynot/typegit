import {
  commitMutation,
  graphql,
} from 'react-relay';

exports.UpdateMemoryMutation = ({ environment, id, title, body, created }, cb) => {
  const mutation = graphql`
  mutation UpdateMemoryMutation($id: ID, $title: String, $body: String, $created: String) {
    updateMemory(
      id: $id,
      title: $title,
      body: $body,
      created: $created,
    ) {
      id
      title
      body
      created
    }
  }`;

  const variables = {
    id,
    title,
    body,
    created,
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
