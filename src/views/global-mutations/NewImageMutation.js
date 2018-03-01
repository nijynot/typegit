import {
  commitMutation,
  graphql,
} from 'react-relay';

exports.NewImageMutation = ({ environment, uploadables, me }) => {
  const mutation = graphql`
  mutation NewImageMutation {
    newImage {
      imageEdge {
        node {
          id
          url
        }
        cursor
      }
    }
  }`;

  const variables = {};

  const configs = [{
    type: 'RANGE_ADD',
    parentID: me.id,
    connectionInfo: [{
      key: 'DraftingPage_images',
      rangeBehavior: 'prepend',
    }],
    edgeName: 'imageEdge',
  }];

  return new Promise((resolve) => {
    commitMutation(environment, {
      mutation,
      variables,
      uploadables,
      configs,
      onCompleted: (res, err) => {
        if (err) console.error(err);
        resolve(res);
      },
      onError: err => console.error(err),
    });
  });
};
