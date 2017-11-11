import React from 'react';
import ReactDOM from 'react-dom';

import {
  QueryRenderer,
  graphql,
} from 'react-relay';

import { modernEnvironment } from '../helpers.js';

import App from '../App.js';
import HomePage from '../pages/Home/HomePage.js';

const mountNode = document.getElementById('root');

ReactDOM.render(
  <QueryRenderer
    environment={modernEnvironment}
    query={graphql`
      query HomePageQuery {
        viewer {
          ...App_viewer,
          ...HomePage_viewer
        }
      }
    `}
    variables={{ id: null }}
    render={({ err, props }) => {
      if (props) {
        console.log(props);
        return (
          <App viewer={props.viewer}>
            <HomePage viewer={props.viewer} />
          </App>
        );
      }
      return null;
    }}
  />,
  mountNode
);
