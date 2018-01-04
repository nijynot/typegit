import React from 'react';
import PropTypes from 'prop-types';
import {
  CardElement,
  injectStripe,
} from 'react-stripe-elements';
import cx from 'classnames';
import partial from 'lodash/partial';
import get from 'lodash/get';

const { placeholder } = partial;

class CardForm extends React.Component {
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
  onChange(e, key) {
    if (key === 'card') {
      this.setState({ card: e });
    } else {
      this.setState({ [key]: e.target.value });
    }
  }
  // onClickSubmit() {
  //
  // }
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
        this.setState({ status: 'submitted' });
        fetch('/settings/subscription', {
          method: 'POST',
          body: JSON.stringify({
            stripeToken: token.id,
          }),
          credentials: 'same-origin',
          headers: {
            'Content-Type': 'application/json',
          },
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
                  {/* <div className="row">
                    <label
                      htmlFor="example1-name"
                      data-tid="elements_examples.form.name_label"
                    >
                      Country
                    </label>
                    <input
                      id="cardform-country"
                      data-tid="elements_examples.form.name_placeholder"
                      type="text"
                      placeholder="Sweden"
                      required
                      onChange={partial(this.onChange, placeholder, 'country')}
                      value={this.state.country}
                    />
                  </div> */}
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
                  Update Credit Card
                </button>
              </form>
              <div className="success">
                <div className="icon">
                  <svg width="84px" height="84px" viewBox="0 0 84 84" version="1.1">
                    <circle className="border" cx="42" cy="42" r="40" strokeLinecap="round" strokeWidth="4" stroke="#000" fill="none" />
                    <path className="checkmark" strokeLinecap="round" strokeLinejoin="round" d="M23.375 42.5488281 36.8840688 56.0578969 64.891932 28.0500338" strokeWidth="4" stroke="#000" fill="none" />
                  </svg>
                </div>
                <h3 className="title" data-tid="elements_examples.success.title">Payment credentials saved</h3>
                <p className="message"><span data-tid="elements_examples.success.message">Thanks for trying Stripe Elements. No money was charged, but we generated a token: </span><span className="token">tok_189gMN2eZvKYlo2CwTBv9KKh</span></p>
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
            </div>
          </section>
        </main>
      </div>
    );
  }
}

CardForm.propTypes = {

};

export default injectStripe(CardForm);
