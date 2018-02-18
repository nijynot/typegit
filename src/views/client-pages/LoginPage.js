import React from 'react';
import ReactDOM from 'react-dom';

import {
  QueryRenderer,
  graphql,
} from 'react-relay';

import { modernEnvironment } from '../helpers.js';

import App from '../App.js';
import LoginPage from '../pages/Login/LoginPage.js';

const mountNode = document.getElementById('root');

ReactDOM.render(
  <QueryRenderer
    environment={modernEnvironment}
    query={graphql`
      query LoginPageQuery {
        ...App_query
        ...LoginPage_query
      }
    `}
    variables={{}}
    render={({ err, props }) => {
      console.log(props);
      if (props) {
        console.log('render');
        return (
          <App query={props}>
            <LoginPage query={props} />
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
