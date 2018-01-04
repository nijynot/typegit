import React from 'react';
import PropTypes from 'prop-types';
import {
  createFragmentContainer,
  createRefetchContainer,
  graphql,
} from 'react-relay';
import isEmail from 'validator/lib/isEmail';
import get from 'lodash/get';
import partial from 'lodash/partial';
import cx from 'classnames';

const { placeholder } = partial;

class RegisterPage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      password: '',
      verifyPassword: '',
      // usernameIsValid: null,
      // emailValid: (get(this.email, 'value')) ? isEmail(this.email.value) : false,
    };
    this.onChange = this.onChange.bind(this);
    this._validateUsername = this._validateUsername.bind(this);
    this._validateEmail = this._validateEmail.bind(this);
    this.registerMutation = this.registerMutation.bind(this);
  }
  onChange(e, key) {
    if (this._throttleTimeout) {
      clearTimeout(this._throttleTimeout);
    }
    if (key === 'username') {
      this._throttleTimeout = setTimeout(
        this._validateUsername,
        200
      );
    } else if (key === 'email') {
      this._throttleTimeout = setTimeout(
        this._validateEmail,
        200
      );
    } else {
      this.setState({ [key]: e.target.value });
    }
  }
  _validateUsername() {
    const refetchVariables = () => ({
      username: this.username.value,
      email: this.email.value,
    });
    this.props.relay.refetch(refetchVariables, null);
  }
  _validateEmail() {
    const refetchVariables = () => ({
      username: this.username.value,
      email: this.email.value,
    });
    this.props.relay.refetch(refetchVariables, null);
  }
  _validatePassword() {
    if (
      this.state.password === this.state.verifyPassword &&
      this.state.password !== '' &&
      this.state.password.length >= 7
    ) {
      return true;
    } else if (
      this.state.password.length > 0 &&
      this.state.verifyPassword.length > 0
    ) {
      return false;
    }
    return null;
  }
  registerMutation() {
    if (
      this.props.viewer.usernameIsValid &&
      this.props.viewer.emailIsValid &&
      this.state.password === this.state.verifyPassword
    ) {
      console.log('register');
    } else {
      console.log('not register');
    }
  }
  render() {
    return (
      <div className="registerpage">
        <h1>
          Register
        </h1>
        <form>
          <div className="settingsroot-form">
            <span className={cx('settingsroot-label', {
              success: this.props.viewer.usernameIsValid,
              error: this.props.viewer.usernameIsValid === false,
            })}
            >
              Username&nbsp;
              {(this.props.viewer.usernameIsValid) ? '✓' : null}
            </span>
            <input
              ref={(node) => { this.username = node; }}
              className="register-ctrl"
              type="text"
              onChange={partial(this.onChange, placeholder, 'username')}
              required
            />
            {(this.props.viewer.usernameIsValid === false) ?
              <span className="settingsroot-hint error">
                Username is invalid or already taken.
              </span> :
              <span className="settingsroot-hint">
                This will be your username. Can be changed.
                Alphanumeric with max length 39.
              </span>}
          </div>
          <div className="settingsroot-form">
            <span className={cx('settingsroot-label', {
              success: this.props.viewer.emailIsValid,
              error: this.props.viewer.emailIsValid === false,
            })}
            >
              Email address&nbsp;
              {(this.props.viewer.emailIsValid) ? '✓' : null}
            </span>
            <input
              ref={(node) => { this.email = node; }}
              className="register-ctrl"
              type="email"
              onChange={partial(this.onChange, placeholder, 'email')}
              required
            />
            {(this.props.viewer.emailIsValid === false) ?
              <span className="settingsroot-hint error">
                Email is invalid or already taken.
              </span> :
              <span className="settingsroot-hint">
                Your email will never be shared with anyone.
              </span>}
          </div>
          <div className="settingsroot-form">
            <span className={cx('settingsroot-label', {
              success: this._validatePassword() === true,
              error: this._validatePassword() === false,
            })}
            >
              Password&nbsp;
              {(this._validatePassword()) ? '✓' : null}
            </span>
            <input
              className="register-ctrl"
              type="password"
              onChange={partial(this.onChange, placeholder, 'password')}
              value={this.state.password}
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
              className="register-ctrl"
              type="password"
              onChange={partial(this.onChange, placeholder, 'verifyPassword')}
              value={this.state.verifyPassword}
              required
            />
          </div>
          <button
            className="register-btn"
            type="button"
            onClick={this.registerMutation}
          >
            Register
          </button>
        </form>
      </div>
    );
  }
}

RegisterPage.propTypes = {
  viewer: PropTypes.object.isRequired,
};

// export default createFragmentContainer(RegisterPage, {
//   viewer: graphql`
//     fragment RegisterPage_viewer on Viewer {
//       id
//     }
//   `,
// });

export default createRefetchContainer(
  RegisterPage,
  {
    viewer: graphql`
      fragment RegisterPage_viewer on Viewer @argumentDefinitions(
        username: { type: "String", defaultValue: "" },
        email: { type: "String", defaultValue: "" }
      ) {
        id
        usernameIsValid(username: $username)
        emailIsValid(email: $email)
      }
    `,
  },
  graphql`
    query RegisterPageRefetchQuery($username: String, $email: String) {
      viewer {
        ...RegisterPage_viewer @arguments(username: $username, email: $email)
      }
    }
  `,
);
