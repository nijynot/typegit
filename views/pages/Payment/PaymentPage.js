import React from 'react';
import PropTypes from 'prop-types';
import {
  createFragmentContainer,
  graphql,
} from 'react-relay';
import {
  StripeProvider,
  Elements,
} from 'react-stripe-elements';
import get from 'lodash/get';
import partial from 'lodash/partial';
import cx from 'classnames';

import PaymentForm from './components/PaymentForm.js';

const { placeholder } = partial;

class PaymentPage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
    this.renderSubscriptionBtn = this.renderSubscriptionBtn.bind(this);
  }
  renderSubscriptionBtn() {
    // if (this.props.viewer.me.subscription.cancel_at_period_end === false) {
    //   return (
    //     <button
    //       className="settingssubscription-cancel-btn"
    //       onClick={() => { this.updateSubscriptionMutation('cancel'); }}
    //     >
    //       Cancel Subscription
    //       <svg
    //         className={cx('svg-spinner', {
    //           active: this.state.loading,
    //         })}
    //         width="18px" height="18px" viewBox="0 0 18 18" version="1.1">
    //         <circle className="border" cx="9" cy="9" r="7" strokeLinecap="round" strokeWidth="2" stroke="#fff" fill="none" />
    //       </svg>
    //     </button>
    //   );
    // }
    return (
      <button
        className="settingssubscription-activate-btn"
        onClick={() => { this.updateSubscriptionMutation('activate'); }}
      >
        Activate Subscription
        <svg
          className={cx('svg-spinner', {
            active: this.state.loading,
          })}
          width="18px" height="18px" viewBox="0 0 18 18" version="1.1">
          <circle className="border" cx="9" cy="9" r="7" strokeLinecap="round" strokeWidth="2" stroke="#fff" fill="none" />
        </svg>
      </button>
    );
  }
  render() {
    return (
      <StripeProvider apiKey="pk_test_aiHj0bwZIsrbUcVqTGUMCDUu">
        <div className="paymentpage">
          <h1>
            Subscribe
          </h1>
          <div className="payment-content">
            <Elements>
              <PaymentForm />
            </Elements>
            <div className="payment-divider"></div>
            <div className="payment-faq">
              <h3>Pricing</h3>
              <span className="payment-answer">
                The pricing is $3 per month.
                You&#39;ll be charged $3 once upgraded,
                and then you&#39;ll be billed at $3 per month.
              </span>
              {/* <h3>What happens if I cancel my subscription?</h3>
              <span className="payment-answer">
                Be at ease. Your entries will s
              </span> */}
            </div>
            <div className="payment-divider"></div>
            <a
              href="/"
              className="payment-skip-link"
            >
              Skip to Home
            </a>
          </div>
        </div>
      </StripeProvider>
    );
  }
}

PaymentPage.propTypes = {
  viewer: PropTypes.object.isRequired,
};

export default createFragmentContainer(PaymentPage, {
  viewer: graphql`
    fragment PaymentPage_viewer on Viewer {
      me {
        id
        username
      }
      ...PaymentForm_viewer
    }
  `,
});
