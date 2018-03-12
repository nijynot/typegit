import {
  commitMutation,
  graphql,
} from 'react-relay';

exports.NewRepositoryMutation = ({
  environment,
  commitHeadline,
  commitBody,
  title,
  text,
  created,
  auto_title,
  auto_created,
}) => {
  const mutation = graphql`
  mutation NewRepositoryMutation($input: NewRepositoryInput) {
    newRepository(input: $input) {
      id
      name
      title
      created
    }
  }`;

  const variables = {
    input: {
      commitHeadline,
      commitBody,
      title,
      text,
      created,
      auto_title,
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
