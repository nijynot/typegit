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
        ...App_query
        ...HomePage_query
      }
    `}
    variables={{ search: '' }}
    render={({ err, props }) => {
      if (props) {
        return (
          <App
            query={props}
          >
            <HomePage query={props} />
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
