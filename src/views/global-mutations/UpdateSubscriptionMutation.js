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
      username
      heading
      customer_id
      card {
        last4
        brand
      }
      charges(first: 10) {
        edges {
          node {
            id
            amount
            created
            invoice
          }
        }
      }
      upcomingInvoice {
        amount_due
        date
        currency
      }
      subscription {
        id
        current_period_end
        current_period_start
        cancel_at_period_end
      }
    }
  }`;

  const variables = { action };

  return new Promise((resolve, reject) => {
    commitMutation(environment, {
      mutation,
      variables,
      // uploadables: 'test',
      onCompleted: (res, err) => {
        if (err) console.log(err);
        console.log(res);
        resolve(res);
        // window.onbeforeunload = null;
        // window.location.href = '/';
      },
      onError: err => console.error(err),
    });
  });
};
