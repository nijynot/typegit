import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import screenfull from 'screenfull';
import Mousetrap from 'mousetrap';
import get from 'lodash/get';
import { fromGlobalId } from 'graphql-base64';

import DropdownProp from 'global-components/DropdownProp.js';

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      headerActive: true,
    };
    this.renderActions = this.renderActions.bind(this);
  }
  componentDidMount() {
    document.addEventListener(screenfull.raw.fullscreenchange, () => {
      console.log('test');
    });
    // Mousetrap.bind(['command+alt+h', 'ctrl+alt+h'], () => {
    //   this.setState({ headerActive: !this.state.headerActive });
    //   return false;
    // });
    // screenfull.on('change', () => {
    //   console.log('Am I fullscreen?', screenfull.isFullscreen ? 'Yes' : 'No');
    // });
    // if (screenfull.enabled) {
    //   console.log('test');
    // }
  }
  renderActions() {
    if (this.props.user) {
      return (
        <div className="header-profile right">
          <DropdownProp
            className="ddmenu pull-left"
            toggle={open => (
              <span
                onClick={open}
                className="dd-btn header-username"
              >
                <img
                  className="profile24"
                  src={`/assets/u/${fromGlobalId(this.props.user.id).id}`}
                />
                {/* {this.props.user.username} */}
              </span>
            )}
          >
            <li className="ddrow">
              <a href="#">
                <button className="ddrow-btn">
                  Signed in as&nbsp;
                  <b>{this.props.user.username}</b>
                </button>
              </a>
            </li>
            <div className="dddivider" />
            <li className="ddrow">
              <a href="/">
                <button className="ddrow-btn">
                  Home
                </button>
              </a>
            </li>
            {/* <li className="ddrow">
              <button className="ddrow-btn">
                Profile
              </button>
            </li> */}
            {/* <li className="ddrow">
              <a href="/insights">
                <button className="ddrow-btn">
                  Insights
                </button>
              </a>
            </li> */}
            <li className="ddrow">
              <a href="/settings/account">
                <button className="ddrow-btn">
                  Settings
                </button>
              </a>
            </li>
            <div className="dddivider" />
            <li className="ddrow">
              <a href="/logout">
                <button className="ddrow-btn">
                  Logout
                </button>
              </a>
            </li>
          </DropdownProp>
          {/* {this.props.user.username} */}
        </div>
      );
    }
    return (
      <div className="header-not-logged clearfix">
        <a
          href="/faq"
          className="dd-btn header-action left"
        >
          FAQ
        </a>
        <a
          href="/login"
          className="dd-btn header-action left"
        >
          Login
        </a>
        <a
          href="/register"
          className="dd-btn header-action left"
        >
          Register
        </a>
      </div>
    );
  }
  render() {
    return (
      <div
        className={cx('header', {
          hide: !this.state.headerActive,
        })}
      >
        <div className="header-container clearfix">
          <div id="header-metabar" className="header-metabar right">
            {/* <div id="header-portal" className="right">
            </div> */}
            {this.renderActions()}
          </div>
          <span className="header-heading">
            <a
              href="/"
              className="header-logo"
            >
              {get(this.props.user, 'heading') || 'Typegit'}
            </a>
          </span>
        </div>
      </div>
    );
  }
}

Header.propTypes = {
  user: PropTypes.object,
};

module.exports = Header;
