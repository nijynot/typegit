import React from 'react';
import ReactDOM from 'react-dom';

import {
  QueryRenderer,
  graphql,
} from 'react-relay';

import { modernEnvironment } from '../helpers.js';

import App from '../App.js';
import ErrorPage from '../pages/Error/ErrorPage.js';

const mountNode = document.getElementById('root');

ReactDOM.render(
  <QueryRenderer
    environment={modernEnvironment}
    query={graphql`
      query ErrorPageQuery {
        viewer {
          ...App_viewer
        }
      }
    `}
    variables={{}}
    render={({ err, props }) => {
      if (props) {
        console.log(props);
        return (
          <App
            viewer={props.viewer}
          >
            <ErrorPage />
          </App>
        );
      } else if (err) {
        console.log(err);
      }
      return null;
    }}
  />,
  mountNode
);
