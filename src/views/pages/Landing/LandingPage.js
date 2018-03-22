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
          A minimalist journal.
        </h1>
        <span className="landing-body">
          Journal that reads like a book and supports git.
        </span>
        <img
          className="landing-mockup"
          alt="mockup"
          src="/assets/etc/mockup.jpg"
        />
        <ul className="landing-pitch">
          <li>
            <div className="landing-content">
              <h2>Supports Git</h2>
              <span className="markdown-body inline">
                Execute <kbd>git commit</kbd>- or <kbd>git log</kbd> on your post directly in the browser.<br />
                You can also <kbd>git clone</kbd> and <kbd>git push origin master</kbd>, if you want to write in another markdown editor.
              </span>
            </div>
          </li>
          <li>
            <div className="landing-content">
              <h2>Write for yourself</h2>
              <span className="markdown-body inline">
                Think of all the blogposts that were <b>scrapped</b> when you're writing for everyone.
                Try writing for youself instead. Every post on Typegit is private.
              </span>
            </div>
          </li>
          <li>
            <div className="landing-content">
              <h2>Minimalist design</h2>
              <span className="markdown-body inline">
                A simple book-like design. Hashtags work just like in twitter.
              </span>
            </div>
          </li>
          <li>
            <div className="landing-faq-line">
              <p>
                Check out the <a href="/faq">FAQ</a> for more information, or <a href="/example">try Typegit</a>.
              </p>
            </div>
          </li>
        </ul>
        <div className="landing-pricing">
          <div>
            Pricing is&nbsp;<b>$5</b>&nbsp;monthly.
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
