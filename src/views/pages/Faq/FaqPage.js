import React from 'react';
import PropTypes from 'prop-types';

import Markdown from 'global-components/Markdown.js';

const str = `A simple diary which you can come back to whenever you want.`;

class FaqPage extends React.Component {
  render() {
    return (
      <div className="faqpage clearfix">
        <h1>
          Frequently Asked Questions
        </h1>
        {/* <span className="landing-body">
          A simple diary which you can come back to whenever you want.
        </span> */}
        <ul className="faq-list">
          <li>
            <div className="faq-el">
              <h3>How much does it cost?</h3>
              <p>
                $3 monthly. Cancel whenever you want.
              </p>
            </div>
          </li>
          <li>
            <div className="faq-el">
              <h3>What happens if I cancel my subscription?</h3>
              <p>
                You&#39;ll only lose your <i>write</i> permissions, but you can still read what you have written in the past.
                Nothing gets deleted when you cancel your subscription.
              </p>
            </div>
          </li>
          <li>
            <div className="faq-el">
              <h3>Can I try before subscribing?</h3>
              <p>
                Yes! Sign up and skip the payment page to try the service.
                Be aware that you won&#39;t be able to save anything without being subscribed.
              </p>
            </div>
          </li>
          <li>
            <div className="faq-el">
              <h3>Do you support Markdown?</h3>
              <p>
                Markdown is supported.
              </p>
            </div>
          </li>
        </ul>
        <div className="landing-pricing">
          {/* <div>
            Pricing is&nbsp;<b>$3</b>&nbsp;monthly.&nbsp;
            <i>
              Cancel anytime.
            </i>
          </div> */}
          <a href="/register">
            <button className="landing-sign-btn">
              Create Account
            </button>
          </a>
        </div>
      </div>
    );
  }
}

FaqPage.propTypes = {

};

module.exports = FaqPage;
