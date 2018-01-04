import {
  commitMutation,
  graphql,
} from 'react-relay';

exports.UpdateSubscriptionMutation = ({ environment, action }) => {
  const mutation = graphql`
  mutation UpdateSubscriptionMutation($action: String) {
    updateSubscription(
      action: $action
    ) {
      id
      cancel_at_period_end
      current_period_end
      current_period_start
    }
  }`;

  const variables = { action };

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
