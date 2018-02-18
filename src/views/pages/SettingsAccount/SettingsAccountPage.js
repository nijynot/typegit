import React from 'react';
import PropTypes from 'prop-types';
import {
  createFragmentContainer,
  createRefetchContainer,
  graphql,
} from 'react-relay';
import partial from 'lodash/partial';
import { fromGlobalId } from 'graphql-base64';
import cx from 'classnames';
// import stringLength from 'string-length';
// import moment from 'moment';

import { UpdateUserMutation } from './mutations/UpdateUserMutation.js';
import { UpdateAvatarMutation } from './mutations/UpdateAvatarMutation.js';

// import MetaPortal from 'global-components/MetaPortal.js';

const { placeholder } = partial;

class SettingsAccountPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      heading: this.props.viewer.me.heading || '',
      imageUploaded: false,
      accountUpdated: false,
    };
    this.onChange = this.onChange.bind(this);
    this.updateUserMutation = this.updateUserMutation.bind(this);
    this.updateAvatarMutation = this.updateAvatarMutation.bind(this);
    this._validateEmail = this._validateEmail.bind(this);
  }
  onChange(e, key) {
    if (this._throttleTimeout) {
      clearTimeout(this._throttleTimeout);
    }
    if (key === 'email') {
      this._throttleTimeout = setTimeout(
        this._validateEmail,
        200
      );
    } else {
      this.setState({ [key]: e.target.value });
    }
  }
  updateUserMutation() {
    if (
      (this.props.viewer.emailIsValid !== false ||
        this.props.viewer.me.email === this.email.value) &&
      this.email.value.length > 0
    ) {
      UpdateUserMutation({
        environment: this.props.relay.environment,
        heading: this.state.heading,
        email: this.email.value,
      })
      .then((res) => {
        if (res.updateUser) {
          this.setState({ accountUpdated: true });
          setTimeout(
            () => { this.setState({ accountUpdated: false }); },
            3000
          );
        }
      });
    }
  }
  updateAvatarMutation() {
    UpdateAvatarMutation({
      environment: this.props.relay.environment,
      uploadables: {
        file: this.upload.files.item(0),
      },
    })
    .then((res) => {
      this.setState({ imageUploaded: true });
      setTimeout(
        () => { this.setState({ imageUploaded: false }); },
        3000
      );
    });
  }
  _validateEmail() {
    const refetchVariables = () => ({
      email: this.email.value,
    });
    this.props.relay.refetch(refetchVariables, null);
  }
  render() {
    return (
      <div className="settingsaccountpage">
        <h1>
          Account
        </h1>
        <div className="settingsaccount-avatar-container">
          <img
            ref={(node) => { this.image = node; }}
            className="settingsaccount-avatar"
            src={`/assets/u/${fromGlobalId(this.props.viewer.me.id).id}`}
            alt="avatar"
          />
          {(this.state.imageUploaded) ?
            <div className="settingsaccount-upload-success">
              Image uploaded successfully.
            </div> : null}
          <input
            ref={(node) => { this.upload = node; }}
            className="settingsaccount-avatar-ctrl"
            type="file"
          />
          <button
            className="settingsaccount-upload-btn"
            onClick={this.updateAvatarMutation}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-upload">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <span className="settingsaccount-upload-label">
              Upload
            </span>
          </button>
        </div>
        <div className="settingsroot-divider"></div>
        {(this.state.accountUpdated) ?
          <div className="settingsaccount-upload-success">
            Account settings updated successfully.
          </div> : null}
        <div className="settingsroot-form">
          <span className="settingsroot-label">Name</span>
          <input
            className="settingsaccount-ctrl"
            placeholder="Default: PILECROW"
            value={this.state.heading}
            onChange={partial(this.onChange, partial.placeholder, 'heading')}
          />
        </div>
        <div className="settingsroot-form">
          <span className={cx('settingsroot-label', {
            success: this.props.viewer.emailIsValid,
            error: (this.props.viewer.emailIsValid === false) &&
              (this.props.viewer.me.email !== this.email.value),
          })}
          >
            Email address&nbsp;
            {(this.props.viewer.emailIsValid) ? '✓' : null}
          </span>
          <input
            ref={(node) => { this.email = node; }}
            className="settingsaccount-ctrl"
            placeholder="some@email.com"
            defaultValue={this.props.viewer.me.email}
            onChange={partial(this.onChange, placeholder, 'email')}
            type="email"
            required
          />
          {/* <input
            ref={(node) => { this.email = node; }}
            className="register-ctrl"
            type="email"
            onChange={partial(this.onChange, placeholder, 'email')}
            required
          /> */}
          {(this.props.viewer.emailIsValid === false) && (this.props.viewer.me.email !== this.email.value) ?
            <span className="settingsroot-hint error">
              Email is invalid or already taken.
            </span> :
            <span className="settingsroot-hint">
              Your email will never be shared with anyone.
            </span>}
        </div>
        {/* <div className="settingsroot-form">
          <span className="settingsroot-label">Email</span>
          <input
            className="settingsaccount-ctrl"
            placeholder="some@email.com"
            value={this.state.email}
            onChange={partial(this.onChange, partial.placeholder, 'email')}
          />
        </div> */}
        <button
          className="settingsaccount-save-btn"
          onClick={this.updateUserMutation}
        >
          Update account settings
        </button>
      </div>
    );
  }
}

SettingsAccountPage.propTypes = {
  viewer: PropTypes.object.isRequired,
};

// export default createFragmentContainer(SettingsAccountPage, {
//   viewer: graphql`
//     fragment SettingsAccountPage_viewer on Viewer {
//       me {
//         id
//         username
//         email
//         heading
//       }
//     }
//   `,
// });

export default createRefetchContainer(
  SettingsAccountPage,
  {
    viewer: graphql`
      fragment SettingsAccountPage_viewer on Viewer @argumentDefinitions(
        email: { type: "String", defaultValue: "" }
      ) {
        me {
          id
          username
          email
          heading
        }
        emailIsValid(email: $email)
      }
    `,
  },
  graphql`
    query SettingsAccountPageRefetchQuery($email: String) {
      viewer {
        ...SettingsAccountPage_viewer @arguments(email: $email)
      }
    }
  `,
);
