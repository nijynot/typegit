import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';

import {
  createFragmentContainer,
  graphql,
} from 'react-relay';

import Header from './components/Header.js';

class App extends React.Component {
  render() {
    return (
      <div className="app">
        <Header
          user={this.props.query.me}
        />
        <div className="content">
          {this.props.children}
        </div>
      </div>
    );
  }
}

App.propTypes = {
  query: PropTypes.object.isRequired,
};

export default createFragmentContainer(App, {
  query: graphql`
    fragment App_query on Query {
      me {
        id
        username
        heading
      }
    }
  `,
});
