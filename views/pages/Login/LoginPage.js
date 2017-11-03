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
        <form method="post" action="/login">
          <input placeholder="login" type="text" />
          <input placeholder="password" type="password" />
          <input
            className="login-button"
            type="submit"
            value="Login"
          />
        </form>
      </div>
    );
  }
}

LoginPage.propTypes = {
};

export default createFragmentContainer(LoginPage, {
  viewer: graphql`
    fragment LoginPage_viewer on Viewer {
      id
    }
  `,
});
