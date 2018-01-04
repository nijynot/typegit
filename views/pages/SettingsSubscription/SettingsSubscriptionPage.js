import React from 'react';
import PropTypes from 'prop-types';
import {
  createFragmentContainer,
  graphql,
} from 'react-relay';
import {
  StripeProvider,
  Elements,
  CardElement,
  PaymentRequestButtonElement,
} from 'react-stripe-elements';
import moment from 'moment';
import partial from 'lodash/partial';
import get from 'lodash/get';
import cx from 'classnames';

// import { fromGlobalId } from 'graphql-base64';
// import stringLength from 'string-length';

import { UpdateSubscriptionMutation } from './mutations/UpdateSubscriptionMutation.js';
import { UpdateCustomerMutation } from './mutations/UpdateCustomerMutation.js';

// import MetaPortal from 'global-components/MetaPortal.js';

import CardForm from './components/CardForm.js';

const { placeholder } = partial;

class SettingsSubscriptionPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      update: false,
      loading: false,
    };
    this.onChange = this.onChange.bind(this);
    this.updateSubscriptionMutation = this.updateSubscriptionMutation.bind(this);
  }
  componentDidMount() {
    // setTimeout(
    //   () => { this.setState({ loading: true }); },
    //   2000
    // );
  }
  onChange(e, key) {
    this.setState({ [key]: e.target.value });
  }
  updateSubscriptionMutation(action) {
    this.setState({ loading: true });
    UpdateSubscriptionMutation({
      environment: this.props.relay.environment,
      action,
    })
    .then((value) => {
      this.setState({ loading: false });
      console.log(value);
    });
  }
  renderCardPeek() {
    return (
      <div className="clearfix" style={{ verticalAlign: 'center' }}>
        <div className="settingssubscription-card-peek">
          <span className="settingssubscription-card-type">Card Type</span>
          <span className="settingssubscription-hl">
            {/* {this.renderBrand()} */}
            {this.props.viewer.me.card.brand}
          </span>
          <span className="settingssubscription-last4">Last 4</span>
          <span className="settingssubscription-hl">
            •••• •••• •••• {this.props.viewer.me.card.last4}
          </span>
        </div>
        <button
          className="settingssubscription-edit-card-btn"
          onClick={() => { this.setState({ update: true }); }}
        >
          Change Credit Card
        </button>
      </div>
    );
  }
  renderSubscriptionBtn() {
    if (this.props.viewer.me.subscription.cancel_at_period_end === false) {
      return (
        <button
          className="settingssubscription-cancel-btn"
          onClick={() => { this.updateSubscriptionMutation('cancel'); }}
        >
          Cancel Subscription
          <svg
            className={cx('svg-spinner', {
              active: this.state.loading,
            })}
            width="18px" height="18px" viewBox="0 0 18 18" version="1.1">
            <circle className="border" cx="9" cy="9" r="7" strokeLinecap="round" strokeWidth="2" stroke="#fff" fill="none" />
          </svg>
        </button>
      );
      // {(this.state.loading) ?
      //   <svg width="18px" height="18px" viewBox="0 0 84 84" version="1.1">
      //     <circle className="border" cx="42" cy="42" r="40" strokeLinecap="round" strokeWidth="8" stroke="#fff" fill="none" />
      //   </svg> : null}
    }
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
  renderCurrentPeriod() {
    if (!this.props.viewer.me.subscription.current_period_start &&
        !this.props.viewer.me.subscription.current_period_end) {
      return 'Not Active';
    }
    return `${moment.unix(this.props.viewer.me.subscription.current_period_start).format('MMMM Do, YYYY')}–${moment.unix(this.props.viewer.me.subscription.current_period_end).format('MMMM Do, YYYY')}`;
  }
  render() {
    return (
      <StripeProvider apiKey="pk_test_aiHj0bwZIsrbUcVqTGUMCDUu">
        <div className="settingspasswordpage">
          <h1>
            Subscription
          </h1>
          <div className="settingssubscription-payments">
            <h2 className="settingssubscription-sub-heading">
              Payments
            </h2>
            <div className="settingssubscription-charge clearfix">
              <span>
                <div>
                  {moment.unix(get(this.props.viewer.me.upcomingInvoice, 'date')).format('MMMM Do, YYYY')}
                </div>
                <small>Next Payment</small>
              </span>
              <span className="right">
                ${get(this.props.viewer.me.upcomingInvoice, 'amount_due') / 100}
              </span>
            </div>
            {this.props.viewer.me.charges.edges.map(charge => (
              <div
                key={charge.id}
                className="settingssubscription-charge clearfix"
              >
                <span>
                  {moment.unix(charge.created).format('MMMM Do, YYYY')}
                </span>
                <span className="right">
                  ${charge.amount / 100}
                </span>
              </div>
            ))}
          </div>
          {/* <div className="settingsroot-divider" /> */}
          {(this.state.update) ?
            <React.Fragment>
              <Elements>
                <CardForm />
              </Elements>
              <button
                className="settingssubscription-cancel-update-btn"
                onClick={() => { this.setState({ update: false }); }}
              >
                Cancel
              </button>
            </React.Fragment> :
            this.renderCardPeek()}
          <div className="settingsroot-divider" />
          <h2 className="settingssubscription-sub-heading">
            Subscription Status
          </h2>
          <div className="settingssubscription-period">
            <i>Cancel Subscription when current period ends:</i> {(this.props.viewer.me.subscription.cancel_at_period_end) ? <b>Yes</b> : <b>No</b>}
            <br />
            <i>
              Current Period:
            </i>&nbsp;
            {this.renderCurrentPeriod()}
          </div>
          <div className="settingsroot-divider" />
          {this.renderSubscriptionBtn()}
        </div>
      </StripeProvider>
    );
  }
}

SettingsSubscriptionPage.propTypes = {
  viewer: PropTypes.object.isRequired,
};

export default createFragmentContainer(SettingsSubscriptionPage, {
  viewer: graphql`
    fragment SettingsSubscriptionPage_viewer on Viewer {
      me {
        id
        username
        heading
        customer_id
        card {
          last4
          brand
        }
        charges(limit: 10) {
          edges {
            id
            amount
            created
            invoice
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
    }
  `,
});
