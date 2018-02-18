import React from 'react';
import PropTypes from 'prop-types';
import mixpanel from 'mixpanel-browser';

import Markdown from 'global-components/Markdown.js';

mixpanel.init('ad1901a86703fb84525c156756e15e07');

class LandingPage extends React.Component {
  render() {
    return (
      <div className="landingpage clearfix">
        <h1 className="landing-heading">
          Keeping a diary should be easy.
        </h1>
        <span className="landing-body">
          A simple diary which you can come back to whenever you want.
        </span>
        <ul className="landing-pitch">
          <li>
            <div className="landing-content">
              <h2>Minimalist</h2>
              <p>
                Simple and easy diary keeping. Aims to be as simple and useable as possible.
              </p>
            </div>
          </li>
          <li>
            <div className="landing-content">
              <h2>Made to last</h2>
              <p>
                {/* If you quit along the way and then decide to come back, know that your diary will be just like you left it. */}
                Even if you quit along the way, your diary will be safe.
                And when you do return, your diary will be just like you left it.
              </p>
            </div>
          </li>
          <li>
            <div className="landing-content">
              <h2>No &#8220;productivity hacks&#8221;</h2>
              <p>
                {/* If you quit along the way and then decide to come back, know that your diary will be just like you left it. */}
                No gamification or productivity hacks to make you keep a diary. Just you and your diary and nothing inbetween.
                {/* Just write when you feel like it, no need to force it. */}
              </p>
            </div>
          </li>
          <li>
            <div className="landing-content">
              <p>
                Check out the <a href="/faq">FAQ</a> for more information.
              </p>
            </div>
          </li>
        </ul>
        <div className="landing-pricing">
          <div>
            Pricing is&nbsp;<b>$3</b>&nbsp;monthly.
            Cancel&nbsp;
            <i>
              anytime.
            </i>
          </div>
          <a href="/register">
            <button
              className="landing-sign-btn"
              onClick={() => {
                mixpanel.track('Signup start');
              }}
            >
              Create Account
            </button>
          </a>
        </div>
        {/* <div className="landing-divider" />
        <div className="">
        </div>
        <div className="landing-paper-shadow">
          <div className="landing-paper">
            <h1 className="landing-paper-heading">
              Lorem Ipsum
            </h1>
            <small className="landing-timestamp">Sunday, December 24th, 2017</small>
            <Markdown
              source={`Markdown is *supported* and you can use #hashtags in your text.
No *gamification* or \`hacks\` of keeping a diary, just **you** and your **words**.

> Quote anything you want

    console.log('Insert code snipptes');

Write your thoughts to remember yourself.
`}
            />
          </div>
        </div>
        <div className="landing-divider" /> */}
      </div>
    );
  }
}

LandingPage.propTypes = {

};

module.exports = LandingPage;
