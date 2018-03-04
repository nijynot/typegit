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
          <input
            className="login-control"
            name="username"
            type="text"
            placeholder="Username"
          />
          <input
            className="login-control"
            name="password"
            type="password"
            placeholder="Password"
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