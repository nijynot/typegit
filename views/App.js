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
    console.log(this.props);
    return (
      <div className="app">
        <Header
          user={this.props.viewer.me}
          showEdit={this.props.viewer.me.id === get(this.props, 'memory.memory.user.id')}
        />
        <div className="content">
          {this.props.children}
        </div>
      </div>
    );
  }
}

App.propTypes = {
  viewer: PropTypes.object.isRequired,
};

export default createFragmentContainer(App, {
  viewer: graphql`
    fragment App_viewer on Viewer {
      me {
        id
        username
      }
    }
  `,
  memory: graphql`
  fragment App_memory on Viewer {
    memory(id: $id) {
      user {
        id
      }
    }
  }
  `,
});
