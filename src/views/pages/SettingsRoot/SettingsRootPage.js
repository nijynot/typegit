import React from 'react';
import PropTypes from 'prop-types';
import {
  createFragmentContainer,
  graphql,
} from 'react-relay';
import { fromGlobalId } from 'graphql-base64';
import stringLength from 'string-length';
import moment from 'moment';
import cx from 'classnames';

import MetaPortal from 'global-components/MetaPortal.js';

class SettingsRootPage extends React.Component {
  render() {
    return (
      <div className="settingsrootpage clearfix">
        <div className="settingsroot-sidebar left">
          <a href="/settings/account">
            <span
              className={cx('settingsroot-tab', {
                active: this.props.active === 'account',
              })}
            >
              Account
            </span>
          </a>
          <a href="/settings/password">
            <span
              className={cx('settingsroot-tab', {
                active: this.props.active === 'password',
              })}
            >
              Password
            </span>
          </a>
          <a href="/settings/subscription">
            <span
              className={cx('settingsroot-tab', {
                active: this.props.active === 'subscription',
              })}
            >
              Subscription
            </span>
          </a>
        </div>
        <div className="settingsroot-content left">
          {this.props.children}
        </div>
      </div>
    );
  }
}

SettingsRootPage.propTypes = {
  query: PropTypes.object.isRequired,
  active: PropTypes.string,
};

export default createFragmentContainer(SettingsRootPage, {
  query: graphql`
    fragment SettingsRootPage_query on Query {
      me {
        id
        username
      }
    }
  `,
});
