import React from 'react';
import PropTypes from 'prop-types';

import {
  createFragmentContainer,
  graphql,
} from 'react-relay';

class LoginPage extends React.PureComponent {
  render() {
    return (
      <div className="loginpage">
        <h1>
          Login
        </h1>
        <form method="post" action="/login">
          <span className="settingsroot-label">
            Username
          </span>
          <input
            className="login-control"
            name="username"
            type="text"
          />
          <span className="settingsroot-label">
            Password
          </span>
          <input
            className="login-control"
            name="password"
            type="password"
          />
          <button className="login-btn">
            Login
          </button>
        </form>
      </div>
    );
  }
}

LoginPage.propTypes = {
  query: PropTypes.object.isRequired,
};

export default createFragmentContainer(LoginPage, {
  query: graphql`
    fragment LoginPage_query on Query {
      id
    }
  `,
});
