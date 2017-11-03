import React from 'react';
import ReactDOM from 'react-dom';

import {
  QueryRenderer,
  graphql,
} from 'react-relay';

import { modernEnvironment } from '../helpers.js';

// import App from '../App.js';
import LoginPage from '../pages/Login/LoginPage.js';

const mountNode = document.getElementById('root');

ReactDOM.render(
  <QueryRenderer
    environment={modernEnvironment}
    query={graphql`
      query LoginPageQuery {
        viewer {
          ...LoginPage_viewer
        }
      }
    `}
    variables={{}}
    render={({ err, props }) => {
      if (props) {
        return (
          <LoginPage viewer={props.viewer} />
        );
      }
      return null;
    }}
  />,
  mountNode
);
