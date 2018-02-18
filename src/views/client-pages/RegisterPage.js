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
        ...App_query
        ...RegisterPage_query
      }
    `}
    variables={{}}
    render={({ err, props }) => {
      if (props) {
        return (
          <App query={props}>
            <RegisterPage query={props} />
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
