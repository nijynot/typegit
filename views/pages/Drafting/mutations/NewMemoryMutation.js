import {
  commitMutation,
  graphql,
} from 'react-relay';

exports.NewMemoryMutation = ({ environment, title, body, created }) => {
  const mutation = graphql`
  mutation NewMemoryMutation($title: String, $body: String, $created: String) {
    newMemory(
      title: $title,
      body: $body,
      created: $created,
      tags: []
    ) {
      id
      title
      body
      created
      tags {id}
    }
  }`;

  const variables = {
    title,
    body,
    created,
  };

  commitMutation(environment, {
    mutation,
    variables,
    onCompleted: (response, errors) => {
      console.log(response);
    },
    onError: err => console.error(err),
  });
};
