import React from 'react';
import ReactDOM from 'react-dom';

import {
  QueryRenderer,
  graphql,
} from 'react-relay';

import { modernEnvironment } from '../helpers.js';

import App from '../App.js';
import RegisterPage from '../pages/Register/RegisterPage.js';

const mountNode = document.getElementById('root');

ReactDOM.render(
  <QueryRenderer
    environment={modernEnvironment}
    query={graphql`
      query RegisterPageQuery {
        viewer {
          ...App_viewer
          ...RegisterPage_viewer
        }
      }
    `}
    variables={{}}
    render={({ err, props }) => {
      console.log(props);
      if (props) {
        console.log('render');
        return (
          <App viewer={props.viewer}>
            <RegisterPage viewer={props.viewer} />
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
