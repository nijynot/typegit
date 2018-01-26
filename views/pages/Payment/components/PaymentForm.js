import React from 'react';
import PropTypes from 'prop-types';
import {
  createFragmentContainer,
  graphql,
} from 'react-relay';
import {
  CardElement,
  injectStripe,
} from 'react-stripe-elements';
import cx from 'classnames';
import partial from 'lodash/partial';
import get from 'lodash/get';
import mixpanel from 'mixpanel-browser';

import { UpdateCustomerMutation } from 'global-mutations/UpdateCustomerMutation.js';
import { UpdateSubscriptionMutation } from 'global-mutations/UpdateSubscriptionMutation.js';

const { placeholder } = partial;

class PaymentForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      address: '',
      city: '',
      state: '',
      country: '',
      status: null,
      card: null,
    };
    this.onChange = this.onChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.reset = this.reset.bind(this);
  }
  componentDidMount() {
    mixpanel.init('ad1901a86703fb84525c156756e15e07');
  }
  onChange(e, key) {
    if (key === 'card') {
      this.setState({ card: e });
    } else {
      this.setState({ [key]: e.target.value });
    }
  }
  handleSubmit(e) {
    e.preventDefault();

    if (get(this.state.card, 'complete')) {
      this.setState({ status: 'submitting' });
      this.props.stripe.createToken({
        type: 'card',
        name: this.state.name,
        address_line1: this.state.address,
        address_city: this.state.city,
        address_state: this.state.state,
        address_zip: this.state.card.value.postalCode,
      })
      .then(({ token }) => {
        console.log('Received Stripe token:', token);
        UpdateCustomerMutation({
          environment: this.props.relay.environment,
          token: token.id,
        })
        .then((res) => {
          if (res.updateCustomer) {
            return UpdateSubscriptionMutation({
              environment: this.props.relay.environment,
              action: 'activate',
            });
          }
          return false;
        })
        .then((res) => {
          if (res.updateSubscription) {
            mixpanel.track('Signup payment');
            this.setState({ status: 'submitted' });
          } else {
            this.setState({ status: 'error' });
          }
        })
        .catch((err) => {
          console.log(err);
          this.setState({ status: 'error' });
        });
      });
    }
  }
  reset(e) {
    e.preventDefault();
    this.setState({ status: null });
    this.form.reset();
    this._element.clear();
  }
  render() {
    return (
      <div>
        <main>
          <section className="container-lg">
            <div
              className={cx('cell example example1', {
                [this.state.status]: (this.state.status),
              })}
            >
              <form
                id="form1"
                ref={(node) => { this.form = node; }}
                // onSubmit={this.handleSubmit}
                // method="post"
                // action="/settings/subscription"
              >
                <fieldset>
                  <div className="row">
                    <label
                      htmlFor="example1-name"
                      data-tid="elements_examples.form.name_label"
                    >
                      Name
                    </label>
                    <input
                      id="example1-name"
                      data-tid="elements_examples.form.name_placeholder"
                      type="text"
                      placeholder="Jane Doe"
                      required
                      onChange={partial(this.onChange, placeholder, 'name')}
                      value={this.state.name}
                    />
                  </div>
                  <div className="row">
                    <label
                      htmlFor="example1-name"
                      data-tid="elements_examples.form.name_label"
                    >
                      Address
                    </label>
                    <input
                      id="cardform-address"
                      data-tid="elements_examples.form.name_placeholder"
                      type="text"
                      placeholder=""
                      required
                      onChange={partial(this.onChange, placeholder, 'address')}
                      value={this.state.address}
                    />
                  </div>
                  <div className="row">
                    <label
                      htmlFor="cardform-city"
                      data-tid="elements_examples.form.name_label"
                    >
                      City
                    </label>
                    <input
                      id="cardform-city"
                      data-tid="elements_examples.form.name_placeholder"
                      type="text"
                      placeholder=""
                      required
                      onChange={partial(this.onChange, placeholder, 'city')}
                      value={this.state.city}
                    />
                  </div>
                  <div className="row">
                    <label
                      htmlFor="example1-name"
                      data-tid="elements_examples.form.name_label"
                    >
                      State
                    </label>
                    <input
                      id="cardform-state"
                      data-tid="elements_examples.form.name_placeholder"
                      type="text"
                      placeholder=""
                      required
                      onChange={partial(this.onChange, placeholder, 'state')}
                      value={this.state.state}
                    />
                  </div>
                </fieldset>
                <fieldset>
                  <div className="row">
                    <CardElement
                      elementRef={(node) => { this._element = node; }}
                      onChange={partial(this.onChange, placeholder, 'card')}
                      iconStyle="solid"
                      style={{
                        base: {
                          iconColor: '#c4f0ff',
                          color: '#fff',
                          fontWeight: 500,
                          fontFamily: 'Roboto, Open Sans, Segoe UI, sans-serif',
                          fontSize: '15px',
                          fontSmoothing: 'antialiased',

                          ':-webkit-autofill': {
                            color: '#fce883',
                          },
                          '::placeholder': {
                            color: '#87BBFD',
                          },
                        },
                        invalid: {
                          iconColor: '#FFC7EE',
                          color: '#FFC7EE',
                        },
                      }}
                    />
                  </div>
                </fieldset>
                <button
                  type="submit"
                  form="form1"
                  onClick={this.handleSubmit}
                >
                  Subscribe and save
                </button>
              </form>
              <div className="success">
                <div className="icon">
                  <svg width="84px" height="84px" viewBox="0 0 84 84" version="1.1">
                    <circle className="border" cx="42" cy="42" r="40" strokeLinecap="round" strokeWidth="4" stroke="#000" fill="none" />
                    <path className="checkmark" strokeLinecap="round" strokeLinejoin="round" d="M23.375 42.5488281 36.8840688 56.0578969 64.891932 28.0500338" strokeWidth="4" stroke="#000" fill="none" />
                  </svg>
                </div>
                <h3 className="title" data-tid="elements_examples.success.title">
                  Payment credentials saved and subscribtion started!
                </h3>
                <p className="message">
                  <span data-tid="elements_examples.success.message">
                    Thanks for subscribing! You&#39;re the best.
                  </span>
                  <a className="link" href="/">
                    Continue to Home →
                  </a>
                </p>
                <a
                  className="reset"
                  href="#"
                  onClick={this.reset}
                >
                  <svg width="32px" height="32px" viewBox="0 0 32 32" version="1.1">
                    <path fill="#000000" d="M15,7.05492878 C10.5000495,7.55237307 7,11.3674463 7,16 C7,20.9705627 11.0294373,25 16,25 C20.9705627,25 25,20.9705627 25,16 C25,15.3627484 24.4834055,14.8461538 23.8461538,14.8461538 C23.2089022,14.8461538 22.6923077,15.3627484 22.6923077,16 C22.6923077,19.6960595 19.6960595,22.6923077 16,22.6923077 C12.3039405,22.6923077 9.30769231,19.6960595 9.30769231,16 C9.30769231,12.3039405 12.3039405,9.30769231 16,9.30769231 L16,12.0841673 C16,12.1800431 16.0275652,12.2738974 16.0794108,12.354546 C16.2287368,12.5868311 16.5380938,12.6540826 16.7703788,12.5047565 L22.3457501,8.92058924 L22.3457501,8.92058924 C22.4060014,8.88185624 22.4572275,8.83063012 22.4959605,8.7703788 C22.6452866,8.53809377 22.5780351,8.22873685 22.3457501,8.07941076 L22.3457501,8.07941076 L16.7703788,4.49524351 C16.6897301,4.44339794 16.5958758,4.41583275 16.5,4.41583275 C16.2238576,4.41583275 16,4.63969037 16,4.91583275 L16,7 L15,7 L15,7.05492878 Z M16,32 C7.163444,32 0,24.836556 0,16 C0,7.163444 7.163444,0 16,0 C24.836556,0 32,7.163444 32,16 C32,24.836556 24.836556,32 16,32 Z"></path>
                  </svg>
                </a>
              </div>
              <div className="success fail">
                <div className="icon">
                  <svg width="84px" height="84px" viewBox="0 0 84 84" version="1.1">
                    <circle className="border" cx="42" cy="42" r="40" strokeLinecap="round" strokeWidth="4" stroke="#000" fill="none" />
                    {/* <path className="checkmark" strokeLinecap="round" strokeLinejoin="round" d="M23.375 42.5488281 36.8840688 56.0578969 64.891932 28.0500338" strokeWidth="4" stroke="#000" fill="none" /> */}
                    <svg width="84" height="84" viewBox="-8 -8 40 40" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-x">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </svg>
                </div>
                <h3 className="title" data-tid="elements_examples.success.title">
                  Something went wrong.
                </h3>
                <p className="message">
                  <span data-tid="elements_examples.success.message">
                    Please make sure you&#39;re logged in and<br />
                    credentials are correct and then retry.
                  </span>
                </p>
                <a
                  className="reset"
                  href="#"
                  onClick={this.reset}
                >
                  <svg width="32px" height="32px" viewBox="0 0 32 32" version="1.1">
                    <path fill="#000000" d="M15,7.05492878 C10.5000495,7.55237307 7,11.3674463 7,16 C7,20.9705627 11.0294373,25 16,25 C20.9705627,25 25,20.9705627 25,16 C25,15.3627484 24.4834055,14.8461538 23.8461538,14.8461538 C23.2089022,14.8461538 22.6923077,15.3627484 22.6923077,16 C22.6923077,19.6960595 19.6960595,22.6923077 16,22.6923077 C12.3039405,22.6923077 9.30769231,19.6960595 9.30769231,16 C9.30769231,12.3039405 12.3039405,9.30769231 16,9.30769231 L16,12.0841673 C16,12.1800431 16.0275652,12.2738974 16.0794108,12.354546 C16.2287368,12.5868311 16.5380938,12.6540826 16.7703788,12.5047565 L22.3457501,8.92058924 L22.3457501,8.92058924 C22.4060014,8.88185624 22.4572275,8.83063012 22.4959605,8.7703788 C22.6452866,8.53809377 22.5780351,8.22873685 22.3457501,8.07941076 L22.3457501,8.07941076 L16.7703788,4.49524351 C16.6897301,4.44339794 16.5958758,4.41583275 16.5,4.41583275 C16.2238576,4.41583275 16,4.63969037 16,4.91583275 L16,7 L15,7 L15,7.05492878 Z M16,32 C7.163444,32 0,24.836556 0,16 C0,7.163444 7.163444,0 16,0 C24.836556,0 32,7.163444 32,16 C32,24.836556 24.836556,32 16,32 Z"></path>
                  </svg>
                </a>
              </div>
              <svg
               xmlns="http://www.w3.org/2000/svg"
               width="119px" height="26px"
               className="stripe-svg"
               >
              <path fill-rule="evenodd"  opacity="0.749" fill="rgb(255, 255, 255)"
               d="M113.000,26.000 L6.000,26.000 C2.686,26.000 -0.000,23.314 -0.000,20.000 L-0.000,6.000 C-0.000,2.686 2.686,-0.000 6.000,-0.000 L113.000,-0.000 C116.314,-0.000 119.000,2.686 119.000,6.000 L119.000,20.000 C119.000,23.314 116.314,26.000 113.000,26.000 ZM118.000,6.000 C118.000,3.239 115.761,1.000 113.000,1.000 L6.000,1.000 C3.239,1.000 1.000,3.239 1.000,6.000 L1.000,20.000 C1.000,22.761 3.239,25.000 6.000,25.000 L113.000,25.000 C115.761,25.000 118.000,22.761 118.000,20.000 L118.000,6.000 Z"/>
              <path fill-rule="evenodd"  fill="rgb(255, 255, 255)"
               d="M60.700,18.437 L59.395,18.437 L60.405,15.943 L58.395,10.871 L59.774,10.871 L61.037,14.323 L62.310,10.871 L63.689,10.871 L60.700,18.437 ZM55.690,16.259 C55.238,16.259 54.774,16.091 54.354,15.764 L54.354,16.133 L53.007,16.133 L53.007,8.566 L54.354,8.566 L54.354,11.229 C54.774,10.913 55.238,10.745 55.690,10.745 C57.100,10.745 58.068,11.881 58.068,13.502 C58.068,15.122 57.100,16.259 55.690,16.259 ZM55.406,11.902 C55.038,11.902 54.669,12.060 54.354,12.376 L54.354,14.628 C54.669,14.943 55.038,15.101 55.406,15.101 C56.164,15.101 56.690,14.449 56.690,13.502 C56.690,12.555 56.164,11.902 55.406,11.902 ZM47.554,15.764 C47.144,16.091 46.681,16.259 46.218,16.259 C44.818,16.259 43.840,15.122 43.840,13.502 C43.840,11.881 44.818,10.745 46.218,10.745 C46.681,10.745 47.144,10.913 47.554,11.229 L47.554,8.566 L48.912,8.566 L48.912,16.133 L47.554,16.133 L47.554,15.764 ZM47.554,12.376 C47.249,12.060 46.881,11.902 46.513,11.902 C45.744,11.902 45.218,12.555 45.218,13.502 C45.218,14.449 45.744,15.101 46.513,15.101 C46.881,15.101 47.249,14.943 47.554,14.628 L47.554,12.376 ZM39.535,13.870 C39.619,14.670 40.251,15.217 41.134,15.217 C41.619,15.217 42.155,15.038 42.702,14.722 L42.702,15.849 C42.103,16.122 41.503,16.259 40.913,16.259 C39.324,16.259 38.209,15.101 38.209,13.460 C38.209,11.871 39.303,10.745 40.808,10.745 C42.187,10.745 43.123,11.829 43.123,13.375 C43.123,13.523 43.123,13.691 43.102,13.870 L39.535,13.870 ZM40.756,11.786 C40.103,11.786 39.598,12.271 39.535,12.997 L41.829,12.997 C41.787,12.281 41.356,11.786 40.756,11.786 ZM35.988,12.618 L35.988,16.133 L34.641,16.133 L34.641,10.871 L35.988,10.871 L35.988,11.397 C36.367,10.976 36.830,10.745 37.282,10.745 C37.430,10.745 37.577,10.755 37.724,10.797 L37.724,11.997 C37.577,11.955 37.409,11.934 37.251,11.934 C36.809,11.934 36.335,12.176 35.988,12.618 ZM29.979,13.870 C30.063,14.670 30.694,15.217 31.578,15.217 C32.062,15.217 32.599,15.038 33.146,14.722 L33.146,15.849 C32.546,16.122 31.946,16.259 31.357,16.259 C29.768,16.259 28.653,15.101 28.653,13.460 C28.653,11.871 29.747,10.745 31.252,10.745 C32.630,10.745 33.567,11.829 33.567,13.375 C33.567,13.523 33.567,13.691 33.546,13.870 L29.979,13.870 ZM31.199,11.786 C30.547,11.786 30.042,12.271 29.979,12.997 L32.273,12.997 C32.231,12.281 31.799,11.786 31.199,11.786 ZM25.274,16.133 L24.200,12.555 L23.137,16.133 L21.927,16.133 L20.117,10.871 L21.464,10.871 L22.527,14.449 L23.590,10.871 L24.810,10.871 L25.873,14.449 L26.936,10.871 L28.283,10.871 L26.484,16.133 L25.274,16.133 ZM17.043,16.259 C15.454,16.259 14.328,15.112 14.328,13.502 C14.328,11.881 15.454,10.745 17.043,10.745 C18.632,10.745 19.748,11.881 19.748,13.502 C19.748,15.112 18.632,16.259 17.043,16.259 ZM17.043,11.871 C16.254,11.871 15.707,12.534 15.707,13.502 C15.707,14.470 16.254,15.133 17.043,15.133 C17.822,15.133 18.369,14.470 18.369,13.502 C18.369,12.534 17.822,11.871 17.043,11.871 ZM11.128,13.533 L9.918,13.533 L9.918,16.133 L8.571,16.133 L8.571,8.892 L11.128,8.892 C12.602,8.892 13.654,9.850 13.654,11.218 C13.654,12.586 12.602,13.533 11.128,13.533 ZM10.939,9.987 L9.918,9.987 L9.918,12.439 L10.939,12.439 C11.718,12.439 12.265,11.944 12.265,11.218 C12.265,10.482 11.718,9.987 10.939,9.987 Z"/>
              <path fill-rule="evenodd"  fill="rgb(255, 255, 255)"
               d="M111.116,14.051 L105.557,14.051 C105.684,15.382 106.659,15.774 107.766,15.774 C108.893,15.774 109.781,15.536 110.555,15.146 L110.555,17.433 C109.784,17.861 108.765,18.169 107.408,18.169 C104.642,18.169 102.704,16.437 102.704,13.013 C102.704,10.121 104.348,7.825 107.049,7.825 C109.746,7.825 111.154,10.120 111.154,13.028 C111.154,13.303 111.129,13.898 111.116,14.051 ZM107.031,10.140 C106.321,10.140 105.532,10.676 105.532,11.955 L108.468,11.955 C108.468,10.677 107.728,10.140 107.031,10.140 ZM98.108,18.169 C97.114,18.169 96.507,17.750 96.099,17.451 L96.093,20.664 L93.254,21.268 L93.253,8.014 L95.753,8.014 L95.901,8.715 C96.293,8.349 97.012,7.825 98.125,7.825 C100.119,7.825 101.997,9.621 101.997,12.927 C101.997,16.535 100.139,18.169 98.108,18.169 ZM97.446,10.340 C96.795,10.340 96.386,10.578 96.090,10.903 L96.107,15.122 C96.383,15.421 96.780,15.661 97.446,15.661 C98.496,15.661 99.200,14.518 99.200,12.989 C99.200,11.504 98.485,10.340 97.446,10.340 ZM89.149,8.014 L91.999,8.014 L91.999,17.966 L89.149,17.966 L89.149,8.014 ZM89.149,4.836 L91.999,4.230 L91.999,6.543 L89.149,7.149 L89.149,4.836 ZM86.110,11.219 L86.110,17.966 L83.272,17.966 L83.272,8.014 L85.727,8.014 L85.905,8.853 C86.570,7.631 87.897,7.879 88.275,8.015 L88.275,10.625 C87.914,10.508 86.781,10.338 86.110,11.219 ZM80.024,14.475 C80.024,16.148 81.816,15.627 82.179,15.482 L82.179,17.793 C81.801,18.001 81.115,18.169 80.187,18.169 C78.502,18.169 77.237,16.928 77.237,15.247 L77.250,6.138 L80.022,5.548 L80.024,8.014 L82.180,8.014 L82.180,10.435 L80.024,10.435 L80.024,14.475 ZM76.485,14.959 C76.485,17.003 74.858,18.169 72.497,18.169 C71.518,18.169 70.448,17.979 69.392,17.525 L69.392,14.814 C70.345,15.332 71.559,15.721 72.500,15.721 C73.133,15.721 73.589,15.551 73.589,15.026 C73.589,13.671 69.273,14.181 69.273,11.038 C69.273,9.028 70.808,7.825 73.111,7.825 C74.052,7.825 74.992,7.969 75.933,8.344 L75.933,11.019 C75.069,10.552 73.972,10.288 73.109,10.288 C72.514,10.288 72.144,10.460 72.144,10.903 C72.144,12.181 76.485,11.573 76.485,14.959 Z"/>
              </svg>
            </div>
          </section>
        </main>
      </div>
    );
  }
}

PaymentForm.propTypes = {

};

export default createFragmentContainer(injectStripe(PaymentForm), {
  viewer: graphql`
    fragment PaymentForm_viewer on Viewer {
      me {
        id
        username
        customer_id
        card {
          last4
          brand
        }
        # charges(limit: 10) {
        #   edges {
        #     id
        #     amount
        #     created
        #     invoice
        #   }
        # }
        # upcomingInvoice {
        #   amount_due
        #   date
        #   currency
        # }
        # subscription {
        #   id
        #   current_period_end
        #   current_period_start
        #   cancel_at_period_end
        # }
      }
    }
  `,
});
