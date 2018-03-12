import {
  commitMutation,
  graphql,
} from 'react-relay';

exports.NewCommitMutation = ({
  environment,
  repositoryId,
  commitHeadline,
  commitBody,
  text,
}) => {
  const mutation = graphql`
  mutation NewCommitMutation($input: NewCommitInput) {
    newCommit(input: $input) {
      id
      oid
    }
  }`;

  const variables = {
    input: {
      repositoryId,
      commitHeadline,
      commitBody,
      text,
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
