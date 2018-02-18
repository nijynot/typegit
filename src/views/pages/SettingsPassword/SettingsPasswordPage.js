import React from 'react';
import PropTypes from 'prop-types';
import {
  createFragmentContainer,
  graphql,
} from 'react-relay';
import partial from 'lodash/partial';
import cx from 'classnames';

import { UpdatePasswordMutation } from './mutations/UpdatePasswordMutation.js';

const { placeholder } = partial;

class SettingsPasswordPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      oldPassword: '',
      newPassword: '',
      verifyPassword: '',
      success: null,
    };
    this.onChange = this.onChange.bind(this);
    this.updatePasswordMutation = this.updatePasswordMutation.bind(this);
    this.renderPasswordMsg = this.renderPasswordMsg.bind(this);
    this._validatePassword = this._validatePassword.bind(this);
  }
  onChange(e, key) {
    this.setState({ [key]: e.target.value });
  }
  async updatePasswordMutation() {
    if (
      this.state.newPassword === this.state.verifyPassword &&
      this.state.newPassword.length >= 7
    ) {
      const data = await UpdatePasswordMutation({
        environment: this.props.relay.environment,
        oldPassword: this.state.oldPassword,
        newPassword: this.state.newPassword,
        verifyPassword: this.state.verifyPassword,
      });
      if (data.updatePassword === 1) {
        this.setState({
          success: true,
          oldPassword: '',
          newPassword: '',
          verifyPassword: '',
        });
      } else {
        this.setState({ success: false });
      }
    }

    if (this._throttleTimeout) {
      clearTimeout(this._throttleTimeout);
    }
    this._throttleTimeout = setTimeout(
      () => { this.setState({ success: null }); },
      5000
    );
  }
  _validatePassword() {
    if (
      this.state.newPassword === this.state.verifyPassword &&
      this.state.newPassword !== '' &&
      this.state.newPassword.length >= 7
    ) {
      return true;
    } else if (
      this.state.newPassword.length > 0 &&
      this.state.verifyPassword.length > 0
    ) {
      return false;
    }
    return null;
  }
  renderPasswordMsg() {
    if (this.state.success === true) {
      return (
        <div>
          <span className="settingspassword-success-msg">
            Password change succeded!
          </span>
        </div>
      );
    } else if (this.state.success === false) {
      return (
        <div>
          <span className="settingspassword-fail-msg">
            Password change failed!
          </span>
        </div>
      );
    }
    return null;
  }
  render() {
    return (
      <div className="settingspasswordpage">
        <h1>
          Password
        </h1>
        {this.renderPasswordMsg()}
        <div className="settingsroot-form">
          <span className="settingsroot-label">Current password</span>
          <input
            className="settingspassword-ctrl"
            type="password"
            onChange={partial(this.onChange, placeholder, 'oldPassword')}
            value={this.state.oldPassword}
            required
          />
        </div>
        <div className="settingsroot-form">
          <span className={cx('settingsroot-label', {
            success: this._validatePassword() === true,
            error: this._validatePassword() === false,
          })}
          >
            New Password&nbsp;
            {(this._validatePassword()) ? '✓' : null}
          </span>
          <input
            className="settingspassword-ctrl"
            type="password"
            onChange={partial(this.onChange, placeholder, 'newPassword')}
            value={this.state.newPassword}
            required
          />
          {(this._validatePassword() === false) ?
            <span className="settingsroot-hint error">
              Make sure your password is at least 7 characters and match!
            </span> :
            <span className="settingsroot-hint">
              At least 7 characters. Make sure to keep it a secret.
            </span>}
        </div>
        <div className="settingsroot-form">
          <span className={cx('settingsroot-label', {
            success: this._validatePassword() === true,
            error: this._validatePassword() === false,
          })}
          >
            Verify password&nbsp;
            {(this._validatePassword()) ? '✓' : null}
          </span>
          <input
            className="settingspassword-ctrl"
            type="password"
            onChange={partial(this.onChange, placeholder, 'verifyPassword')}
            value={this.state.verifyPassword}
            required
          />
        </div>
        {/* <div className="settingsroot-form">
          <span className="settingsroot-label">New password</span>
          <input
            className="settingspassword-ctrl"
            type="password"
            onChange={partial(this.onChange, placeholder, 'newPassword')}
            value={this.state.newPassword}
          />
        </div>
        <div className="settingsroot-form">
          <span className="settingsroot-label">Verify password</span>
          <input
            className="settingspassword-ctrl"
            type="password"
            onChange={partial(this.onChange, placeholder, 'verifyPassword')}
            value={this.state.verifyPassword}
          />
        </div> */}
        <button
          className="settingspassword-btn"
          onClick={this.updatePasswordMutation}
          disabled={this.state.newPassword !== this.state.verifyPassword}
        >
          Change password
        </button>
      </div>
    );
  }
}

SettingsPasswordPage.propTypes = {
  viewer: PropTypes.object.isRequired,
};

export default createFragmentContainer(SettingsPasswordPage, {
  viewer: graphql`
    fragment SettingsPasswordPage_viewer on Viewer {
      me {
        id
        username
        heading
      }
    }
  `,
});
