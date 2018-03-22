import React from 'react';
import PropTypes from 'prop-types';

import Markdown from 'global-components/Markdown.js';

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
          {/* <li>
            <div className="faq-el">
              <h3>Rough Future Roadmap</h3>
              <span className="markdown-body inline">
                <ul>
                  <li>Public, private key entryption on posts.</li>
                </ul>
                <ul>
                  <li>Alternative to make posts public.</li>
                </ul>
              </span>
            </div>
          </li> */}
          <li>
            <div className="faq-el">
              <h3>Pricing?</h3>
              <span className="markdown-body inline">
                $5 monthly. Cancel <em>whenever</em> you want.
              </span>
            </div>
          </li>
          <li>
            <div className="faq-el">
              <h3>What happens if I cancel my subscription?</h3>
              <span className="markdown-body inline">
                You&#39;ll only lose your <b>write</b> permissions, but you can still <b>read</b> what you have written in the past.
                Nothing gets deleted when you cancel your subscription.
              </span>
            </div>
          </li>
          <li>
            <div className="faq-el">
              <h3>Can I try before subscribing?</h3>
              <span className="markdown-body inline">
                Yes, check out this <a href="/example">try it page</a>.
                {/* Yes, sign-up and skip the payment page to try the service.
                Be aware that you won&#39;t be able to save anything when you're not subscribed. */}
              </span>
            </div>
          </li>
          {/* <li>
            <div className="faq-el">
              <h3>Do you support Markdown?</h3>
              <span className="markdown-body inline">
                Markdown is supported.
              </span>
            </div>
          </li> */}
          <li>
            <div className="faq-el">
              <h3>Git support?</h3>
              <span className="markdown-body inline">
                We follow git's http smart protocol, and thus supports the <code>git-receive-pack</code> and <code>git-upload-pack</code> services.
              </span>
            </div>
          </li>
          <li>
            <div className="faq-el">
              <h3>Help, other questions, or comments?</h3>
              <span className="markdown-body inline">
                Then contact us at{' '}
                <a href="https://twitter.com/typegit">@typegit</a>{' '}
                on twitter or{' '}
                <a href="mailto:typegit@gmail.com">typegit@gmail.com</a> for mail.
              </span>
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
