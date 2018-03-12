import {
  commitMutation,
  graphql,
} from 'react-relay';

exports.UpdateRepositoryMutation = ({
  environment,
  id,
  title,
  auto_title,
  description,
  created,
  auto_created,
}) => {
  const mutation = graphql`
  mutation UpdateRepositoryMutation($input: UpdateRepositoryInput) {
    updateRepository(input: $input) {
      id
      title
      auto_title
      description
      created
      auto_created
    }
  }`;

  const variables = {
    input: {
      id,
      title,
      auto_title,
      description,
      created,
      auto_created,
    },
  };

  return new Promise((resolve, reject) => {
    commitMutation(environment, {
      mutation,
      variables,
      onCompleted: (res, err) => {
        if (err) {
          console.log(err);
          resolve(err);
        }
        resolve(res);
      },
      onError: err => reject(err),
    });
  });
};
